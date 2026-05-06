# Modo Backend

A standalone Node.js + Express backend with SQLite persistent storage for the Modo project.

## Requirements

- Node.js 18 or later
- npm

## Setup

```bash
# Install dependencies
cd backend
npm install

# Start the server (default port: 3000)
npm start
```

The server starts on `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port.

The SQLite database file (`submissions.db`) is created automatically in the `backend/` directory on first run.

## API Endpoints

### POST /submit

Submit a new entry.

**Request body (JSON):**
```json
{
  "username": "alice",
  "text": "A quiet thought."
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "alice",
  "text": "A quiet thought.",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

### GET /submissions

Retrieve all submissions.

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "alice",
    "text": "A quiet thought.",
    "timestamp": "2024-01-15T12:00:00.000Z"
  }
]
```

---

### GET /submissions/:id

Retrieve a single submission by ID.

**Response (200):**
```json
{
  "id": 1,
  "username": "alice",
  "text": "A quiet thought.",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

Returns `404` if the submission does not exist.

## Example Usage (curl)

```bash
# Submit a new entry
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "text": "A quiet thought."}'

# List all submissions
curl http://localhost:3000/submissions

# Get submission with ID 1
curl http://localhost:3000/submissions/1
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the server listens on |
| `DB_PATH` | `./submissions.db` | Path to the SQLite database file |

## Deployment

The backend is intended to be deployed separately from the frontend. Any Node.js-compatible hosting platform (Railway, Fly.io, Render, a VPS, etc.) will work.

Make sure to:
1. Set the `PORT` environment variable as required by the hosting platform.
2. Persist the `DB_PATH` location across deploys (or use an external SQLite-compatible volume).
