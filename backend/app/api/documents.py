import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import fitz
# from google import genai



from app.database.session import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse, DocumentListResponse
from app.core.config import settings

from groq import Groq

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize Gemini ONCE at module level
#gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
groq_client = Groq(api_key=settings.GROQ_API_KEY)

def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    try:
        doc = fitz.open(file_path)
        page_count = len(doc)
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
        return text.strip(), page_count
    except Exception:
        return "", 0


# ─── UPLOAD ──────────────────────────────────────────────────────────────────
@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    unique_name = f"{uuid.uuid4().hex[:8]}-{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 50MB.")

    with open(file_path, "wb") as f:
        f.write(content)

    extracted_text, page_count = extract_text_from_pdf(file_path)

    document = Document(
        filename=unique_name,
        original_name=file.filename,
        file_path=file_path,
        file_size=len(content),
        page_count=page_count,
        extracted_text=extracted_text[:50000],
        owner_id=None
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


# ─── LIST ────────────────────────────────────────────────────────────────────
@router.get("/", response_model=DocumentListResponse)
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return {"documents": docs, "total": len(docs)}


# ─── SUMMARIZE (must be before /{document_id}) ───────────────────────────────
@router.post("/summarize")
async def summarize_documents(
    doc_ids: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    summary_style: str = Form("bullet_points"),
    db: Session = Depends(get_db)
):
    """
    Summarize documents from:
    1. Existing documents selected from library (doc_ids as comma-separated string)
    2. New PDFs uploaded directly
    """
    combined_text = ""

    # Source 1: existing documents from DB
    if doc_ids:
        ids = [int(i) for i in doc_ids.split(",") if i.strip().isdigit()]
        docs = db.query(Document).filter(Document.id.in_(ids)).all()
        for doc in docs:
            if doc.extracted_text:
                combined_text += f"\n\n=== {doc.original_name} ===\n{doc.extracted_text}"

    # Source 2: newly uploaded files
    if files:
        for file in files:
            if file and file.filename and file.filename.lower().endswith(".pdf"):
                temp_path = os.path.join(UPLOAD_DIR, f"temp_{uuid.uuid4().hex[:6]}_{file.filename}")
                content = await file.read()
                with open(temp_path, "wb") as f:
                    f.write(content)
                text, _ = extract_text_from_pdf(temp_path)
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                if text:
                    combined_text += f"\n\n=== {file.filename} ===\n{text}"

    if not combined_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found. Select documents or upload a PDF."
        )

    style_prompts = {
        "bullet_points": "Create a structured summary with bullet points covering all key concepts and important details.",
        "executive": "Write a concise executive summary paragraph, then list 3 core takeaways.",
        "key_takeaways": "Extract key definitions, important formulas, and main concepts for exam revision."
    }

    prompt = f"""You are an expert study assistant helping a student understand their documents.
{style_prompts.get(summary_style, style_prompts['bullet_points'])}

Format your response clearly with:
📌 Main Topic
🎯 Key Concepts (bullet points)
📝 Important Details
✅ Summary / Conclusion

Document content:
{combined_text[:60000]}"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert study assistant that creates clear, structured summaries to help students learn efficiently."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=2048,
        )
        summary_text = response.choices[0].message.content
        return {"summary": summary_text, "style": summary_style}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")


# ─── GET ONE ────────────────────────────────