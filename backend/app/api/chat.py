from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatResponse
from app.database.session import get_db
from app.models.document import Document
from app.core.config import settings
from groq import Groq

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])

groq_client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """You are StudyMate AI, an expert, encouraging tutor for students.
Your goal is to answer questions clearly, break down complex concepts into simple steps, 
and help students study efficiently. If document content is provided below, base your answer strictly on that material."""

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # 1. Fetch text context if document IDs are provided
        context_text = ""
        if request.document_ids:
            docs = db.query(Document).filter(Document.id.in_(request.document_ids)).all()
            for doc in docs:
                if doc.extracted_text:
                    context_text += f"\n--- Document: {doc.original_name} ---\n{doc.extracted_text}\n"

        # 2. Build system message with context if present
        system_content = SYSTEM_PROMPT
        if context_text.strip():
            system_content += f"\n\nStudy Material Context:\n{context_text[:40000]}"

        # 3. Format message history for Groq
        formatted_messages = [{"role": "system", "content": system_content}]
        for msg in request.messages:
            formatted_messages.append({
                "role": msg.role,
                "content": msg.content
            })

        # 4. Call Groq Llama 3.3 70B
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            temperature=0.5,
            max_tokens=2048,
        )

        bot_reply = completion.choices[0].message.content
        return {"reply": bot_reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat Error: {str(e)}")