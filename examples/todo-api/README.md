# Todo API

A simple, single-file REST API for managing todos built with Flask.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- 🔍 Search and filter todos
- 📊 Statistics endpoint
- 🌐 CORS enabled for frontend integration
- 📝 JSON request/response format
- ⚠️ Comprehensive error handling

## Quick Start

### 1. Install Dependencies

```bash
pip install flask flask-cors
```

### 2. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/todos` | List all todos |
| GET | `/todos/<id>` | Get a specific todo |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/<id>` | Update a todo |
| DELETE | `/todos/<id>` | Delete a todo |
| GET | `/todos/stats` | Get statistics |

## Usage Examples

### List All Todos

```bash
curl http://localhost:5000/todos
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "todos": [
    {
      "id": "1",
      "title": "Learn Flask",
      "description": "Build a REST API",
      "completed": false,
      "priority": "high",
      "created_at": "2024-01-15T10:00:00",
      "updated_at": "2024-01-15T10:00:00"
    }
  ]
}
```

### Create a New Todo

```bash
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "todo": {
    "id": "a1b2c3d4",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "medium",
    "created_at": "2024-01-15T14:30:00",
    "updated_at": "2024-01-15T14:30:00"
  }
}
```

### Update a Todo

```bash
curl -X PUT http://localhost:5000/todos/a1b2c3d4 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Delete a Todo

```bash
curl -X DELETE http://localhost:5000/todos/a1b2c3d4
```

### Filter Todos

```bash
# Get only completed todos
curl "http://localhost:5000/todos?completed=true"

# Get high priority todos
curl "http://localhost:5000/todos?priority=high"

# Search todos
curl "http://localhost:5000/todos?search=flask"
```

### Get Statistics

```bash
curl http://localhost:5000/todos/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "completed": 2,
    "pending": 3,
    "completion_rate": 40.0,
    "by_priority": {
      "high": 2,
      "medium": 2,
      "low": 1
    }
  }
}
```

## Data Model

### Todo Object

```json
{
  "id": "string (auto-generated)",
  "title": "string (required)",
  "description": "string (optional)",
  "completed": "boolean (default: false)",
  "priority": "string (low/medium/high, default: medium)",
  "created_at": "string (ISO timestamp)",
  "updated_at": "string (ISO timestamp)"
}
```

## Query Parameters

### GET /todos

| Parameter | Type | Description |
|-----------|------|-------------|
| `completed` | boolean | Filter by completion status |
| `priority` | string | Filter by priority (low, medium, high) |
| `search` | string | Search in title and description |

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error description"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 500 | Internal Server Error |

## Frontend Integration

### JavaScript/Fetch Example

```javascript
// Get all todos
fetch('http://localhost:5000/todos')
  .then(res => res.json())
  .then(data => console.log(data.todos));

// Create a todo
fetch('http://localhost:5000/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    priority: 'high'
  })
});

// Update a todo
fetch('http://localhost:5000/todos/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed: true })
});

// Delete a todo
fetch('http://localhost:5000/todos/1', {
  method: 'DELETE'
});
```

## Production Considerations

1. **Database**: Replace in-memory storage with a real database:
   ```python
   # Example with SQLite
   import sqlite3
   # Or use SQLAlchemy for ORM
   ```

2. **Authentication**: Add API key or JWT authentication

3. **Environment Variables**: Use `.env` for configuration:
   ```python
   from dotenv import load_dotenv
   import os
   load_dotenv()
   app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
   ```

4. **Deployment**: Use Gunicorn for production:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## File Structure

```
todo-api/
├── app.py       # Main Flask application (single file)
├── README.md    # This file
└── .env         # Environment variables (create this)
```

## Requirements

- Python 3.7+
- Flask
- Flask-CORS

## License

MIT License - Feel free to use and modify!
