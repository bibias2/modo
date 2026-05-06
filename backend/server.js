const express = require('express');
const Database = require('better-sqlite3');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'submissions.db');

app.use(express.json());

// Rate limiting: stricter limit on write endpoint, looser on read endpoints
const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize database and create table if it doesn't exist
let db;
try {
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      username  TEXT    NOT NULL,
      text      TEXT    NOT NULL,
      timestamp TEXT    NOT NULL
    )
  `);
} catch (err) {
  console.error('Failed to open database:', err.message);
  process.exit(1);
}

// Prepare statements once at startup for reuse
const stmtInsert = db.prepare('INSERT INTO submissions (username, text, timestamp) VALUES (?, ?, ?)');
const stmtSelectAll = db.prepare('SELECT * FROM submissions ORDER BY id ASC');
const stmtSelectById = db.prepare('SELECT * FROM submissions WHERE id = ?');

// POST /submit — store a new submission
app.post('/submit', writeLimiter, (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ error: 'Both username and text are required.' });
  }

  if (typeof username !== 'string' || username.length > 50) {
    return res.status(400).json({ error: 'username must be a string of at most 50 characters.' });
  }

  if (typeof text !== 'string' || text.length > 1000) {
    return res.status(400).json({ error: 'text must be a string of at most 1000 characters.' });
  }

  const timestamp = new Date().toISOString();
  const result = stmtInsert.run(username, text, timestamp);

  res.status(201).json({ id: result.lastInsertRowid, username, text, timestamp });
});

// GET /submissions — return all submissions
app.get('/submissions', readLimiter, (req, res) => {
  res.json(stmtSelectAll.all());
});

// GET /submissions/:id — return a single submission by ID
app.get('/submissions/:id', readLimiter, (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID.' });
  }

  const row = stmtSelectById.get(id);

  if (!row) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  res.json(row);
});

const server = app.listen(PORT, () => {
  console.log(`Modo backend running on http://localhost:${PORT}`);
});

// Graceful shutdown: close DB connection before exit
const SHUTDOWN_TIMEOUT_MS = 10000;
function shutdown() {
  const timer = setTimeout(() => {
    console.error('Shutdown timeout — forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  timer.unref();

  server.close(() => {
    try {
      db.close();
    } catch (err) {
      console.error('Error closing database:', err.message);
    }
    process.exit(0);
  });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
