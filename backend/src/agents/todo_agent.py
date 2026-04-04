from typing import Dict, Any, List
from openai import OpenAI
import os
import json
import re
from ..tools.todo_tools import create_todo, list_todos, update_todo, delete_todo, toggle_todo_status


class TodoAgent:
    """
    OpenAI-based todo assistant agent that supports English, Urdu, and Sindhi.
    Supports multiple providers: Groq, OpenRouter, and OpenAI.
    """

    def __init__(self):
        # Priority 1: Groq API - Fast and FREE with excellent tool calling support
        if os.getenv("GROQ_API_KEY"):
            self.client = OpenAI(
                api_key=os.getenv("GROQ_API_KEY"),
                base_url="https://api.groq.com/openai/v1"
            )
            # Use Llama 3.1 8B Instant - most reliable for function calling
            self.model = "llama-3.1-8b-instant"
        # Priority 2: OpenRouter API (if Groq not available)
        elif os.getenv("OPENROUTER_API_KEY"):
            self.client = OpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1"
            )
            # Use models that support tool calling (note: most free models don't support tools)
            self.model = "meta-llama/llama-3.1-8b-instruct"
        # Priority 3: OpenAI API (fallback)
        elif os.getenv("OPENAI_API_KEY"):
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            self.model = "gpt-4-turbo-preview"
        else:
            raise ValueError("No API key found. Please set GROQ_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY")

    def get_system_prompt(self) -> str:
        """
        Get the system prompt for the agent.
        """
        return """You are a helpful multilingual todo assistant supporting English, Urdu, and Sindhi.
DO NOT use any tools or functions other than the ones explicitly provided to you (create_todo, list_todos, update_todo, delete_todo, toggle_todo_status).
NEVER try to call language_detection or any other tool not in the provided list.
Always detect the language of the user's message manually and respond in the exact same language the user wrote in.
For Urdu use proper اردو script.
For Sindhi use proper سنڌي script.
Tool call parameters must always be in English internally.
IMPORTANT: When calling functions, ALL numeric parameters (user_id, todo_id) MUST be integers, NOT strings.
For example: user_id=1 NOT user_id="1", todo_id=5 NOT todo_id="5"
Your purpose is to help users manage their todo list through natural language commands.
You can create, read, update, delete, and mark todos as complete or pending.

SUPPORTED COMMANDS:
- CREATE: "add a todo", "create task", "new todo to buy groceries"
- LIST: "show todos", "list tasks", "what are my tasks", "pending todos"
- UPDATE: "edit task 1", "update todo 2 to buy milk", "change task 3"
- DELETE: "delete task 2", "remove todo 1", "delete my first task"
- COMPLETE: "mark task 1 complete", "done task 2", "finish todo 3"
- PENDING: "mark task 1 pending", "undo complete task 2", "set task 3 as pending"

When listing todos, ALWAYS provide a summary with counts:
- Total number of tasks
- Number of completed tasks
- Number of pending/incomplete tasks
- Then list the actual todos with their status and IDs

Example response format:
"You have 4 tasks total: 2 completed and 2 pending.
Here are your todos:
✓ Task 1 (completed) - ID: 1
✗ Task 2 (pending) - ID: 2
..."

If the user wants to create a todo, look for keywords like 'add', 'create', 'new', 'task', 'todo'.
If the user wants to see todos, look for keywords like 'show', 'list', 'my', 'see', 'how many', 'pending', 'completed'.
If the user wants to update a todo, look for keywords like 'update', 'change', 'edit', 'modify'.
If the user wants to delete a todo, look for keywords like 'delete', 'remove', 'cancel'.
If the user wants to mark a todo complete, look for keywords like 'complete', 'done', 'finish', 'mark'.
If the user wants to mark a todo as pending, look for keywords like 'pending', 'undo', 'reopen', 'set as pending'.
Always respond with natural, friendly language and provide task counts.
When user says task number without ID, map it to the task ID accordingly."""

    def process_message(self, user_message: str, user_id: int, conversation_id: int = None) -> Dict[str, Any]:
        """
        Process a user message through LLM API and return a response.
        Uses modern tools API (compatible with OpenRouter, Groq, and OpenAI).

        Args:
            user_message: The message from the user
            user_id: The ID of the authenticated user
            conversation_id: The ID of the conversation (not used in this implementation)

        Returns:
            Dictionary containing the agent's response and any tool calls
        """
        try:
            # Prepare the messages for chat completion
            messages = [
                {"role": "system", "content": self.get_system_prompt()},
                {"role": "user", "content": user_message}
            ]

            # Define the tools for the model to call (modern API)
            tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "create_todo",
                        "description": "Create a new todo item for the user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "integer", "description": "ID of the user"},
                                "description": {"type": "string", "description": "Description of the todo item"}
                            },
                            "required": ["user_id", "description"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "list_todos",
                        "description": "List all todo items for the user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "integer", "description": "ID of the user"}
                            },
                            "required": ["user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "update_todo",
                        "description": "Update an existing todo item for the user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "todo_id": {"type": "integer", "description": "ID of the todo item"},
                                "user_id": {"type": "integer", "description": "ID of the user"},
                                "description": {"type": "string", "description": "Updated description of the todo item"}
                            },
                            "required": ["todo_id", "user_id", "description"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "delete_todo",
                        "description": "Delete a todo item for the user",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "todo_id": {"type": "integer", "description": "ID of the todo item to delete"},
                                "user_id": {"type": "integer", "description": "ID of the user"}
                            },
                            "required": ["todo_id", "user_id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "toggle_todo_status",
                        "description": "Toggle the completion status of a todo item",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "todo_id": {"type": "integer", "description": "ID of the todo item"},
                                "user_id": {"type": "integer", "description": "ID of the user"}
                            },
                            "required": ["todo_id", "user_id"]
                        }
                    }
                }
            ]

            # Call the API with tool calling (modern API)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools,
                tool_choice="auto",  # Auto-determine which tool to call
                temperature=0.3
            )

            # Get the response message
            message = response.choices[0].message

            # If the model wants to call a tool (check both tool_calls and function_call for compatibility)
            tool_call = None
            if hasattr(message, 'tool_calls') and message.tool_calls:
                tool_call = message.tool_calls[0]
            elif hasattr(message, 'function_call') and message.function_call:
                # Fallback for older APIs (Groq)
                tool_call = message.function_call

            if tool_call:
                # Handle both new tool_calls and old function_call formats
                if hasattr(tool_call, 'function'):
                    # New format (OpenRouter)
                    function_name = tool_call.function.name
                    arguments = json.loads(tool_call.function.arguments)
                else:
                    # Old format (Groq fallback)
                    function_name = tool_call.name
                    arguments = json.loads(tool_call.arguments)

                # Process the tool call
                result = self._process_tool_call(function_name, arguments, user_id)

                # If the tool call was successful, return the result
                if result.get("success", False):
                    # Get the function result
                    if function_name == "list_todos":
                        todos = result.get("todos", [])
                        if todos:
                            total = len(todos)
                            completed = sum(1 for t in todos if t.get('completed', False))
                            pending = total - completed
                            
                            # Create formatted list with status
                            todo_list = "\n".join([
                                f"{'✓' if todo.get('completed', False) else '✗'} {todo['description']} ({'completed' if todo.get('completed', False) else 'pending'})"
                                for todo in todos
                            ])
                            
                            response_text = f"You have {total} task{'s' if total != 1 else ''} total: {completed} completed and {pending} pending.\n\nHere are your todos:\n{todo_list}"
                        else:
                            response_text = "You have no todos yet. Start by adding a task!"
                    elif function_name in ["create_todo", "update_todo"]:
                        if "todo" in result and result["todo"]:
                            response_text = f"Successfully updated your todo: {result['todo']['description']}"
                        else:
                            response_text = "Operation completed successfully."
                    elif function_name == "delete_todo":
                        response_text = "Todo deleted successfully."
                    elif function_name == "toggle_todo_status":
                        if "todo" in result and result["todo"]:
                            status = "completed" if result["todo"]["completed"] else "not completed"
                            response_text = f"Todo marked as {status}."
                        else:
                            response_text = "Todo status updated successfully."
                    else:
                        response_text = "Operation completed successfully."
                else:
                    # If there was an error in the tool call
                    error_msg = result.get("error", "An error occurred")
                    response_text = f"Sorry, there was an error: {error_msg}"
            else:
                # If no tool call was made, return the model's response
                response_text = message.content or "I'm sorry, I couldn't process your request. Please try again."

            return {
                "response": response_text,
                "user_message": user_message,
                "user_id": user_id
            }

        except Exception as e:
            # In case of any error, return a helpful message
            return {
                "response": f"I'm sorry, I encountered an error: {str(e)}. Please try again.",
                "user_message": user_message,
                "user_id": user_id
            }

    def _process_tool_call(self, function_name: str, arguments: Dict, user_id: int) -> Dict[str, Any]:
        """
        Process a tool call by calling the appropriate MCP tool function.
        """
        if function_name == "create_todo":
            # Extract parameters from arguments
            description = arguments.get("description", "")
            # Override user_id from arguments with the one passed to the function
            return create_todo(user_id, description)

        elif function_name == "list_todos":
            # Override user_id from arguments with the one passed to the function
            return list_todos(user_id)

        elif function_name == "update_todo":
            todo_id = arguments.get("todo_id")
            description = arguments.get("description", "")
            # Convert to int if it's a string (model sometimes sends strings)
            if isinstance(todo_id, str):
                try:
                    todo_id = int(todo_id)
                except ValueError:
                    return {"success": False, "error": "Invalid todo_id"}
            # Override user_id from arguments with the one passed to the function
            return update_todo(todo_id, user_id, description)

        elif function_name == "delete_todo":
            todo_id = arguments.get("todo_id")
            # Convert to int if it's a string (model sometimes sends strings)
            if isinstance(todo_id, str):
                try:
                    todo_id = int(todo_id)
                except ValueError:
                    return {"success": False, "error": "Invalid todo_id"}
            # Override user_id from arguments with the one passed to the function
            return delete_todo(todo_id, user_id)

        elif function_name == "toggle_todo_status":
            todo_id = arguments.get("todo_id")
            # Convert to int if it's a string (model sometimes sends strings)
            if isinstance(todo_id, str):
                try:
                    todo_id = int(todo_id)
                except ValueError:
                    return {"success": False, "error": "Invalid todo_id"}
            # Override user_id from arguments with the one passed to the function
            return toggle_todo_status(todo_id, user_id)

        else:
            return {"success": False, "error": f"Unknown function: {function_name}"}
