from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from typing import Dict, Any
from sqlmodel import Session
from jose import JWTError, jwt
import os
from ..database.init import get_session
from ..models.user import User
from ..services.user_service import get_current_user
from ..agents.todo_agent import TodoAgent
from ..services.conversation_service import ConversationService
from ..services.message_service import MessageService
from ..models.conversation import Conversation
from ..models.message import Message, MessageRole
from ..agents.language_detector import detect_language


# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-in-production")
ALGORITHM = "HS256"


def get_current_user_id_from_token(token: str = Header(..., alias="authorization")) -> int:
    """Get current user ID from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        if token.startswith("Bearer "):
            token = token[7:]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return int(user_id)


router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: int = None
    language: str = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    language: str
    user_message: str


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user_id: int = Depends(get_current_user_id_from_token),
    db: Session = Depends(get_session)
):
    """Chat endpoint that processes messages through AI agent."""
    try:
        detected_language = request.language or detect_language(request.message)

        if request.conversation_id:
            conversation = ConversationService.get_conversation_by_id(
                request.conversation_id, current_user_id, db
            )
            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found or access denied"
                )
        else:
            conversation = ConversationService.create_conversation(
                user_id=current_user_id,
                language=detected_language,
                db=db
            )

        user_message = MessageService.create_message(
            conversation_id=conversation.id,
            role=MessageRole.USER,
            content=request.message,
            db=db
        )

        agent = TodoAgent()
        agent_response = agent.process_message(
            user_message=request.message,
            user_id=current_user_id,
            conversation_id=conversation.id
        )

        agent_message = MessageService.create_message(
            conversation_id=conversation.id,
            role=MessageRole.ASSISTANT,
            content=agent_response["response"],
            db=db
        )

        return ChatResponse(
            response=agent_response["response"],
            conversation_id=conversation.id,
            language=detected_language,
            user_message=request.message
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@router.get("/history/{conversation_id}", response_model=Dict)
async def get_conversation_history(
    conversation_id: int,
    current_user_id: int = Depends(get_current_user_id_from_token),
    db: Session = Depends(get_session)
):
    """Get the full history of a conversation."""
    conversation = ConversationService.get_conversation_by_id(
        conversation_id, current_user_id, db
    )
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied"
        )

    messages = MessageService.get_messages_by_conversation(conversation_id, db)

    return {
        "conversation_id": conversation.id,
        "language": conversation.language,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role.value,
                "content": msg.content,
                "created_at": msg.created_at
            }
            for msg in messages
        ]
    }


@router.get("/conversations", response_model=Dict)
async def get_user_conversations(
    current_user_id: int = Depends(get_current_user_id_from_token),
    db: Session = Depends(get_session)
):
    """Get all conversations for the current user."""
    conversations = ConversationService.get_conversations_by_user(current_user_id, db)

    return {
        "conversations": [
            {
                "id": conv.id,
                "language": conv.language,
                "created_at": conv.created_at,
                "updated_at": conv.updated_at
            }
            for conv in conversations
        ]
    }
