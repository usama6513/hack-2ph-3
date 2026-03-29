from sqlmodel import Session
from typing import List, Optional
from ..models.conversation import Conversation


class ConversationService:
    """Service for managing conversations"""
    
    @staticmethod
    def create_conversation(user_id: int, language: str, db: Session) -> Conversation:
        """Create a new conversation"""
        conversation = Conversation(
            user_id=user_id,
            language=language
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation
    
    @staticmethod
    def get_conversation_by_id(conversation_id: int, user_id: int, db: Session) -> Optional[Conversation]:
        """Get conversation by ID and verify ownership"""
        return db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        ).first()
    
    @staticmethod
    def get_conversations_by_user(user_id: int, db: Session) -> List[Conversation]:
        """Get all conversations for a user"""
        return db.query(Conversation).filter(
            Conversation.user_id == user_id
        ).order_by(Conversation.updated_at.desc()).all()
