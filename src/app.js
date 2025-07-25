// app.js
import express from 'express';
import { escape } from 'lodash';

const app = express();
app.use(express.urlencoded({ extended: true }));

// ——— XSS validator ———
function validateSearchTerm(raw) {
  if (typeof raw !== 'string') throw new Error('invalid');
  const term = raw.trim();
  if (term.length === 0 || term.length > 100) throw new Error('invalid');
  if (!/^[A-Za-z0-9\s-]+$/.test(term)) throw new Error('invalid');
  return term;
}

// ——— SQL-i detector ———
function detectSQLi(raw) {
  if (typeof raw !== 'string') throw new Error('invalid');
  const sqliPattern = /['"=;]|--|\/\*|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b/i;
  if (sqliPattern.test(raw)) throw new Error('invalid');
}

// Home page
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Search</title></head>
      <body>
        <h1>Simple Search</h1>
        <form action="/search" method="GET">
          <input type="text" name="q" placeholder="Enter search term" required />
          <button type="submit">Search</button>
        </form>
      </body>
    </html>
  `);
});

// Search endpoint → on valid input, show result page; on invalid, redirect home
app.get('/search', (req, res) => {
  try {
    detectSQLi(req.query.q);
    const term = validateSearchTerm(req.query.q);
    const safe = escape(term);

    // Render result page with a “Back to Home” button
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Search Result</title>
        </head>
        <body>
          <h1>Search Result</h1>
          <p>You searched for: <strong>${safe}</strong></p>
          <button onclick="window.location.href='/'">
            Back to Home
          </button>
        </body>
      </html>
    `);
  } catch (_) {
    // Invalid (XSS/SQL-i) → drop input & go back
    return res.redirect('/');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
