#!/usr/bin/env python3
"""
Todo API - A Simple REST API with Flask

This is a complete, single-file REST API for managing todos.
Features:
- Full CRUD operations (Create, Read, Update, Delete)
- In-memory storage (resets on restart)
- JSON request/response format
- Error handling and validation
- CORS enabled for frontend integration

Usage:
    # Install dependencies
    pip install flask flask-cors
    
    # Run the server
    python app.py
    
    # API will be available at http://localhost:5000

API Endpoints:
    GET    /todos          - List all todos
    GET    /todos/<id>     - Get a specific todo
    POST   /todos          - Create a new todo
    PUT    /todos/<id>     - Update a todo
    DELETE /todos/<id>     - Delete a todo
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes (allows frontend to call API from different origin)
CORS(app)

# ============================================
# Data Storage (In-Memory)
# ============================================
# In production, replace with a database like SQLite, PostgreSQL, or MongoDB

todos = [
    {
        "id": "1",
        "title": "Learn Flask",
        "description": "Build a REST API with Flask",
        "completed": False,
        "priority": "high",
        "created_at": "2024-01-15T10:00:00",
        "updated_at": "2024-01-15T10:00:00"
    },
    {
        "id": "2",
        "title": "Build Frontend",
        "description": "Create a React app to consume the API",
        "completed": False,
        "priority": "medium",
        "created_at": "2024-01-15T11:00:00",
        "updated_at": "2024-01-15T11:00:00"
    }
]

# ============================================
# Helper Functions
# ============================================

def generate_id():
    """Generate a unique ID for new todos."""
    return str(uuid.uuid4())[:8]  # Short 8-character ID


def get_current_timestamp():
    """Get current timestamp in ISO format."""
    return datetime.now().isoformat()


def find_todo(todo_id):
    """Find a todo by ID."""
    for todo in todos:
        if todo["id"] == todo_id:
            return todo
    return None


def validate_todo_data(data, required_fields=None):
    """
    Validate todo data.
    Returns (is_valid, error_message)
    """
    if required_fields:
        for field in required_fields:
            if field not in data or data[field] is None:
                return False, f"Missing required field: {field}"
    
    # Validate priority if provided
    if "priority" in data:
        valid_priorities = ["low", "medium", "high"]
        if data["priority"] not in valid_priorities:
            return False, f"Invalid priority. Must be one of: {', '.join(valid_priorities)}"
    
    # Validate completed if provided
    if "completed" in data and not isinstance(data["completed"], bool):
        return False, "Field 'completed' must be a boolean"
    
    return True, None


# ============================================
# API Routes
# ============================================

@app.route('/')
def index():
    """Root endpoint - API information."""
    return jsonify({
        "name": "Todo API",
        "version": "1.0.0",
        "description": "A simple REST API for managing todos",
        "endpoints": {
            "GET /todos": "List all todos",
            "GET /todos/<id>": "Get a specific todo",
            "POST /todos": "Create a new todo",
            "PUT /todos/<id>": "Update a todo",
            "DELETE /todos/<id>": "Delete a todo"
        },
        "documentation": "See README.md for detailed usage"
    })


@app.route('/todos', methods=['GET'])
def get_todos():
    """
    Get all todos with optional filtering.
    
    Query Parameters:
        completed (bool): Filter by completion status
        priority (str): Filter by priority (low, medium, high)
        search (str): Search in title and description
    
    Returns:
        JSON array of todos
    """
    result = todos.copy()
    
    # Filter by completion status
    completed_param = request.args.get('completed')
    if completed_param is not None:
        is_completed = completed_param.lower() == 'true'
        result = [t for t in result if t["completed"] == is_completed]
    
    # Filter by priority
    priority = request.args.get('priority')
    if priority:
        result = [t for t in result if t["priority"] == priority.lower()]
    
    # Search in title and description
    search = request.args.get('search')
    if search:
        search_lower = search.lower()
        result = [t for t in result 
                  if search_lower in t["title"].lower() 
                  or search_lower in t.get("description", "").lower()]
    
    return jsonify({
        "success": True,
        "count": len(result),
        "todos": result
    })


@app.route('/todos/<todo_id>', methods=['GET'])
def get_todo(todo_id):
    """
    Get a specific todo by ID.
    
    Args:
        todo_id: The ID of the todo to retrieve
    
    Returns:
        JSON object of the todo or 404 error
    """
    todo = find_todo(todo_id)
    
    if todo is None:
        return jsonify({
            "success": False,
            "error": "Todo not found",
            "message": f"No todo found with ID: {todo_id}"
        }), 404
    
    return jsonify({
        "success": True,
        "todo": todo
    })


@app.route('/todos', methods=['POST'])
def create_todo():
    """
    Create a new todo.
    
    Request Body (JSON):
        title (str, required): Todo title
        description (str, optional): Todo description
        priority (str, optional): low, medium, or high (default: medium)
        completed (bool, optional): Completion status (default: false)
    
    Returns:
        JSON object of the created todo with 201 status
    """
    # Check if request has JSON data
    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request",
            "message": "Request must be JSON with Content-Type: application/json"
        }), 400
    
    data = request.get_json()
    
    # Validate required fields
    is_valid, error_message = validate_todo_data(data, required_fields=["title"])
    if not is_valid:
        return jsonify({
            "success": False,
            "error": "Validation error",
            "message": error_message
        }), 400
    
    # Create new todo
    new_todo = {
        "id": generate_id(),
        "title": data["title"],
        "description": data.get("description", ""),
        "completed": data.get("completed", False),
        "priority": data.get("priority", "medium"),
        "created_at": get_current_timestamp(),
        "updated_at": get_current_timestamp()
    }
    
    todos.append(new_todo)
    
    return jsonify({
        "success": True,
        "message": "Todo created successfully",
        "todo": new_todo
    }), 201


@app.route('/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """
    Update an existing todo.
    
    Args:
        todo_id: The ID of the todo to update
    
    Request Body (JSON):
        title (str, optional): New title
        description (str, optional): New description
        priority (str, optional): New priority
        completed (bool, optional): New completion status
    
    Returns:
        JSON object of the updated todo
    """
    # Check if request has JSON data
    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request",
            "message": "Request must be JSON with Content-Type: application/json"
        }), 400
    
    # Find the todo
    todo = find_todo(todo_id)
    if todo is None:
        return jsonify({
            "success": False,
            "error": "Todo not found",
            "message": f"No todo found with ID: {todo_id}"
        }), 404
    
    data = request.get_json()
    
    # Validate data
    is_valid, error_message = validate_todo_data(data)
    if not is_valid:
        return jsonify({
            "success": False,
            "error": "Validation error",
            "message": error_message
        }), 400
    
    # Update fields (only if provided)
    if "title" in data:
        todo["title"] = data["title"]
    if "description" in data:
        todo["description"] = data["description"]
    if "priority" in data:
        todo["priority"] = data["priority"]
    if "completed" in data:
        todo["completed"] = data["completed"]
    
    todo["updated_at"] = get_current_timestamp()
    
    return jsonify({
        "success": True,
        "message": "Todo updated successfully",
        "todo": todo
    })


@app.route('/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """
    Delete a todo.
    
    Args:
        todo_id: The ID of the todo to delete
    
    Returns:
        JSON confirmation message
    """
    global todos
    
    # Find the todo
    todo = find_todo(todo_id)
    if todo is None:
        return jsonify({
            "success": False,
            "error": "Todo not found",
            "message": f"No todo found with ID: {todo_id}"
        }), 404
    
    # Remove the todo
    todos = [t for t in todos if t["id"] != todo_id]
    
    return jsonify({
        "success": True,
        "message": "Todo deleted successfully",
        "deleted_id": todo_id
    })


# ============================================
# Additional Utility Endpoints
# ============================================

@app.route('/todos/stats', methods=['GET'])
def get_stats():
    """
    Get todo statistics.
    
    Returns:
        JSON object with todo counts and statistics
    """
    total = len(todos)
    completed = len([t for t in todos if t["completed"]])
    pending = total - completed
    
    by_priority = {
        "high": len([t for t in todos if t["priority"] == "high"]),
        "medium": len([t for t in todos if t["priority"] == "medium"]),
        "low": len([t for t in todos if t["priority"] == "low"])
    }
    
    return jsonify({
        "success": True,
        "stats": {
            "total": total,
            "completed": completed,
            "pending": pending,
            "completion_rate": round(completed / total * 100, 1) if total > 0 else 0,
            "by_priority": by_priority
        }
    })


# ============================================
# Error Handlers
# ============================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "success": False,
        "error": "Not found",
        "message": "The requested resource was not found"
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        "success": False,
        "error": "Method not allowed",
        "message": "The HTTP method is not allowed for this endpoint"
    }), 405


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        "success": False,
        "error": "Internal server error",
        "message": "Something went wrong on the server"
    }), 500


# ============================================
# Main Entry Point
# ============================================

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Todo API Server Starting...")
    print("=" * 50)
    print("\n📍 API Endpoints:")
    print("   GET    http://localhost:5000/          - API info")
    print("   GET    http://localhost:5000/todos     - List all todos")
    print("   GET    http://localhost:5000/todos/1   - Get todo by ID")
    print("   POST   http://localhost:5000/todos     - Create todo")
    print("   PUT    http://localhost:5000/todos/1   - Update todo")
    print("   DELETE http://localhost:5000/todos/1   - Delete todo")
    print("   GET    http://localhost:5000/todos/stats - Get statistics")
    print("\n📖 See README.md for detailed usage examples")
    print("=" * 50)
    
    # Run the Flask development server
    # Use debug=False in production!
    app.run(host='0.0.0.0', port=5000, debug=True)
