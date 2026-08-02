from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    document_ids: Optional[List[int]] = None  # To ground chat in specific uploaded PDFs if selected

class ChatResponse(BaseModel):
    reply: str