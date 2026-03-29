from typing import Dict, Any
from sqlmodel import Session
from ..database.init import get_session
from ..models.todo import Todo


def create_todo(user_id: int, description: str) -> Dict[str, Any]:
    """Create a new todo"""
    try:
        with get_session() as session:
            todo = Todo(
                description=description,
                user_id=user_id,
                completed=False
            )
            session.add(todo)
            session.commit()
            session.refresh(todo)
            
            return {
                "success": True,
                "todo": {
                    "id": todo.id,
                    "description": todo.description,
                    "completed": todo.completed,
                    "user_id": todo.user_id
                }
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


def list_todos(user_id: int) -> Dict[str, Any]:
    """List all todos for a user"""
    try:
        with get_session() as session:
            todos = session.query(Todo).filter(Todo.user_id == user_id).all()
            
            return {
                "success": True,
                "todos": [
                    {
                        "id": todo.id,
                        "description": todo.description,
                        "completed": todo.completed,
                        "user_id": todo.user_id
                    }
                    for todo in todos
                ]
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


def update_todo(todo_id: int, user_id: int, description: str) -> Dict[str, Any]:
    """Update a todo"""
    try:
        with get_session() as session:
            todo = session.query(Todo).filter(
                Todo.id == todo_id,
                Todo.user_id == user_id
            ).first()
            
            if not todo:
                return {"success": False, "error": "Todo not found"}
            
            todo.description = description
            session.commit()
            session.refresh(todo)
            
            return {
                "success": True,
                "todo": {
                    "id": todo.id,
                    "description": todo.description,
                    "completed": todo.completed,
                    "user_id": todo.user_id
                }
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


def delete_todo(todo_id: int, user_id: int) -> Dict[str, Any]:
    """Delete a todo"""
    try:
        with get_session() as session:
            todo = session.query(Todo).filter(
                Todo.id == todo_id,
                Todo.user_id == user_id
            ).first()
            
            if not todo:
                return {"success": False, "error": "Todo not found"}
            
            session.delete(todo)
            session.commit()
            
            return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


def toggle_todo_status(todo_id: int, user_id: int) -> Dict[str, Any]:
    """Toggle todo completion status"""
    try:
        with get_session() as session:
            todo = session.query(Todo).filter(
                Todo.id == todo_id,
                Todo.user_id == user_id
            ).first()
            
            if not todo:
                return {"success": False, "error": "Todo not found"}
            
            todo.completed = not todo.completed
            session.commit()
            session.refresh(todo)
            
            return {
                "success": True,
                "todo": {
                    "id": todo.id,
                    "description": todo.description,
                    "completed": todo.completed,
                    "user_id": todo.user_id
                }
            }
    except Exception as e:
        return {"success": False, "error": str(e)}
