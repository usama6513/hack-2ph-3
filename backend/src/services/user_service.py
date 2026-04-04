from sqlmodel import Session, select
from passlib.context import CryptContext
from typing import Optional
from ..models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    """
    Service class for user-related operations.
    """

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against its hash.
        """
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """
        Generate a hash for a plain password.
        """
        return pwd_context.hash(password)

    @staticmethod
    def create_user(user_data: dict, db_session: Session) -> User:
        """
        Create a new user with hashed password.
        """
        hashed_password = UserService.get_password_hash(user_data["password"])
        user = User(email=user_data["email"], hashed_password=hashed_password)
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @staticmethod
    def get_user_by_email(email: str, db_session: Session) -> Optional[User]:
        """
        Retrieve a user by email.
        """
        statement = select(User).where(User.email == email)
        return db_session.exec(statement).first()

    @staticmethod
    def get_user_by_id(user_id: int, db_session: Session) -> Optional[User]:
        """
        Retrieve a user by ID.
        """
        statement = select(User).where(User.id == user_id)
        return db_session.exec(statement).first()

    @staticmethod
    def authenticate_user(email: str, password: str, db_session: Session) -> Optional[User]:
        """
        Authenticate user by email and password.
        """
        user = UserService.get_user_by_email(email, db_session)
        if not user:
            return None
        if not UserService.verify_password(password, user.hashed_password):
            return None
        return user


# Standalone function for auth.py
def get_current_user(email: str, db: Session) -> Optional[User]:
    """
    Get current user by email.
    """
    return UserService.get_user_by_email(email, db)
