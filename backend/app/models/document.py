from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Document(Base):
    __tablename__ = "documents"

    id           = Column(Integer, primary_key=True, index=True)
    filename     = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    file_path    = Column(String, nullable=False)
    file_size    = Column(Integer, nullable=True)   # bytes
    page_count   = Column(Integer, nullable=True)
    extracted_text = Column(Text, nullable=True)    # raw text from PDF
    owner_id     = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="documents")