from sqlmodel import Session
from typing import List, Optional
from ..models.message import Message, MessageRole
from ..models.conversation import Conversation
from datetime import datetime


class MessageService:
    """Service for managing messages"""
    
    @staticmethod
    def create_message(
        conversation_id: int,
        role: MessageRole,
        content: str,
        db: Session
    ) -> Message:
        """Create a new message"""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        db.add(message)
        
        # Update conversation updated_at
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id
        ).first()
        if conversation:
            conversation.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(message)
        return message
    
    @staticmethod
    def get_messages_by_conversation(conversation_id: int, db: Session) -> List[Message]:
        """Get all messages for a conversation"""
        return db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc()).all()
