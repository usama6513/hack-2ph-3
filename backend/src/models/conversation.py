from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Conversation(SQLModel, table=True):
    """Conversation model for chat history"""
    
    __tablename__ = "conversation"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    language: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
