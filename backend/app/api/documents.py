import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import fitz  # PyMuPDF

from app.database.session import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse, DocumentListResponse

router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])

# Upload folder — sits inside backend/
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    """
    Extract text from PDF using PyMuPDF.
    Returns (extracted_text, page_count).
    PyMuPDF handles scanned and complex PDFs much better than pypdf.
    """
    try:
        doc = fitz.open(file_path)
        page_count = len(doc)
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
        return text.strip(), page_count
    except Exception as e:
        return "", 0


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a PDF file.
    1. Validate it's a PDF
    2. Save to disk with a unique name
    3. Extract text using PyMuPDF
    4. Save record to PostgreSQL
    5. Return the document info
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Create unique filename to avoid conflicts
    # e.g. "physics-notes.pdf" → "a3f9b2c1-physics-notes.pdf"
    unique_name = f"{uuid.uuid4().hex[:8]}-{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # Save file to disk
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:  # 50MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 50MB.")

    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text and page count
    extracted_text, page_count = extract_text_from_pdf(file_path)

    # Save to database
    document = Document(
        filename=unique_name,
        original_name=file.filename,
        file_path=file_path,
        file_size=len(content),
        page_count=page_count,
        extracted_text=extracted_text[:50000],  # store up to 50k chars
        owner_id=None  # will link to user after auth sprint
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    return document


@router.get("/", response_model=DocumentListResponse)
def list_documents(db: Session = Depends(get_db)):
    """Get all uploaded documents."""
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return {"documents": docs, "total": len(docs)}


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get a single document by ID."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc


@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """
    Delete a document:
    1. Remove file from disk
    2. Remove record from database
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Delete file from disk
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # Delete from database
    db.delete(doc)
    db.commit()

    return {"message": f"Document '{doc.original_name}' deleted successfully."}