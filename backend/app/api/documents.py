import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
import fitz
from groq import Groq

from app.database.session import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse, DocumentListResponse
from app.core.config import settings

from pydantic import BaseModel
from typing import List, Optional

class DocumentSummarizeRequest(BaseModel):
    doc_ids: Optional[List[int]] = None
    summary_style: str = "bullet_points"

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

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


# ─── 1. UPLOAD ───────────────────────────────────────────────────────────────
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


# ─── 2. LIST ─────────────────────────────────────────────────────────────────
@router.get("/", response_model=DocumentListResponse)
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return {"documents": docs, "total": len(docs)}


# ─── 3. SUMMARIZE (MUST be declared BEFORE /{document_id}) ───────────────────
@router.post("/summarize")
async def summarize_documents(
    payload: DocumentSummarizeRequest,
    db: Session = Depends(get_db)
):
    combined_text = ""

    # Source: existing documents from DB
    if payload.doc_ids:
        docs = db.query(Document).filter(Document.id.in_(payload.doc_ids)).all()
        for doc in docs:
            if doc.extracted_text:
                combined_text += f"\n\n=== {doc.original_name} ===\n{doc.extracted_text}"

    if not combined_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found in selected documents. Make sure the selected document contains text."
        )

    style_prompts = {
        "bullet_points": "Create a structured summary with bullet points covering all key concepts and important details.",
        "executive": "Write a concise executive summary paragraph, then list 3 core takeaways.",
        "key_takeaways": "Extract key definitions, important formulas, and main concepts for exam revision."
    }

    style = payload.summary_style or "bullet_points"

    prompt = f"""You are an expert study assistant helping a student understand their documents.
{style_prompts.get(style, style_prompts['bullet_points'])}

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
        return {"summary": summary_text, "style": style}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

# ─── 4. DELETE (Dynamic path at the VERY BOTTOM) ─────────────────────────────
@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted successfully", "id": document_id}