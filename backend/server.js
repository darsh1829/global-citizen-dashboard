// --- DEPENDENCY IMPORTS ---
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const auth = require('./middleware/auth');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
// --- AI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- INITIALIZATION ---
const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'https://global-citizen-dashboard.vercel.app', 'https://global-citizen.darssh.dev'] }));
// --- ROUTES ---

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, passwordHash]
    );
    const newUserId = newUser.rows[0].id;
    await pool.query(
      "INSERT INTO preferences (user_id) VALUES ($1)",
      [newUserId]
    );
    // FIX: Return a token on registration so frontend can immediately authenticate
    const payload = { user: { id: newUserId } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ id: newUserId, email: newUser.rows[0].email, token });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).send("Server error");
  }
});

// User Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const payload = { user: { id: user.rows[0].id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Server error");
  }
});

// GET current user's profile (Protected Route)
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, email, name FROM users WHERE id = $1",
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE current user's display name (Protected Route)
app.put('/api/users/me', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const updatedUser = await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name",
      [name, req.user.id]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error("Update Name Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// GET a user's preferences (Protected Route)
app.get('/api/preferences', auth, async (req, res) => {
  try {
    const preferences = await pool.query(
      "SELECT tracked_countries, tracked_cryptos FROM preferences WHERE user_id = $1",
      [req.user.id]
    );
    res.json(preferences.rows[0]);
  } catch (err) {
    console.error("Preferences Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// UPDATE a user's preferences (Protected Route)
app.put('/api/preferences', auth, async (req, res) => {
  try {
    const { tracked_countries, tracked_cryptos } = req.body;
    const userId = req.user.id;
    const updatePreferences = await pool.query(
      "UPDATE preferences SET tracked_countries=$1, tracked_cryptos=$2 WHERE user_id=$3 RETURNING *",
      [tracked_countries, tracked_cryptos, userId]
    );
    res.json(updatePreferences.rows[0]);
  } catch (err) {
    console.error("Update Preferences Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// News - GNews API
// Cache for 5 minutes to avoid hitting GNews rate limits during development
let newsCache = { data: null, timestamp: 0 };
const NEWS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get('/api/data/news', async (req, res) => {
  try {
    const now = Date.now();
    if (newsCache.data && (now - newsCache.timestamp) < NEWS_CACHE_TTL) {
      return res.json(newsCache.data);
    }
    const newsResponse = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        token: process.env.GNEWS_API_KEY,
        lang: 'en',
        max: 10
      }
    });
    const mapped = {
      status: 'ok',
      news: newsResponse.data.articles.map((article, index) => ({
        id: String(index),
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        published: article.publishedAt,
        author: article.source?.name || 'Unknown'
      }))
    };
    newsCache = { data: mapped, timestamp: now };
    res.json(mapped);
  } catch (err) {
    // If rate limited and we have stale cache, serve it instead of failing
    if (newsCache.data) {
      console.error("News API Error (serving stale cache):", err.message);
      return res.json(newsCache.data);
    }
    console.error("News API Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// Crypto - CoinGecko public endpoint (no API key needed)
// Simple 60s cache to avoid 429 rate limit errors
let cryptoCache = { data: null, timestamp: 0 };
const CACHE_TTL = 60 * 1000; // 60 seconds

app.get('/api/data/crypto', async (req, res) => {
  try {
    const now = Date.now();
    if (cryptoCache.data && (now - cryptoCache.timestamp) < CACHE_TTL) {
      return res.json(cryptoCache.data);
    }
    const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum,ripple,dogecoin,solana,cardano',
        order: 'market_cap_desc',
        per_page: 6,
        page: 1,
        sparkline: false
      },
      headers: { 'Accept': 'application/json' }
    });
    cryptoCache = { data: cryptoResponse.data, timestamp: now };
    res.json(cryptoResponse.data);
  } catch (err) {
    console.error("Crypto API Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// Exchange Rates - FreeCurrencyAPI
// Returns: { data: { EUR: 0.91, GBP: 0.79, ... } }
// Mapped to same shape frontend expects: { result, base_code, conversion_rates }
app.get('/api/data/rates', async (req, res) => {
  try {
    const ratesResponse = await axios.get('https://api.freecurrencyapi.com/v1/latest', {
      params: {
        apikey: process.env.FREECURRENCY_API_KEY,
        base_currency: 'USD'
      }
    });
    // Map to the shape CurrencyPage expects
    const mapped = {
      result: 'success',
      base_code: 'USD',
      conversion_rates: ratesResponse.data.data
    };
    res.json(mapped);
  } catch (err) {
    console.error("Rates API Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// --- EXPORT ---
// AI Insight of the Day
// Takes today's cached news headlines and asks Gemini to write a short,
// digestible summary of what's happening in the world today.
let insightCache = { data: null, timestamp: 0 };
const INSIGHT_CACHE_TTL = 60 * 60 * 1000; // 1 hour — no need to regenerate more often

app.get('/api/ai/insight', async (req, res) => {
  try {
    const now = Date.now();
    if (insightCache.data && (now - insightCache.timestamp) < INSIGHT_CACHE_TTL) {
      return res.json(insightCache.data);
    }

    // Reuse the news cache so we don't make an extra GNews call
    if (!newsCache.data || !newsCache.data.news || newsCache.data.news.length === 0) {
      return res.status(503).json({ error: "News data not yet available, try again shortly." });
    }

    const headlines = newsCache.data.news
      .slice(0, 8)
      .map((article) => `- ${article.title}`)
      .join('\n');

   const modelFallbacks = ["gemini-3.5-flash", "gemini-2.5-flash-preview-04-17"];

    const prompt = `You are a sharp, neutral news analyst writing for a "Global Citizen Dashboard" app.
Based on these recent headlines, write a short "Insight of the Day" — 3-4 sentences summarizing
the most important theme or connection across today's news. Be concise, insightful, and politically neutral.
Do not just list the headlines back, synthesize them into one cohesive insight.

Headlines:
${headlines}`;

    let result;
for (const modelName of modelFallbacks) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    result = await model.generateContent(prompt);
    console.log(`AI Insight generated using: ${modelName}`);
    break;
  } catch (err) {
    console.error(`Model ${modelName} failed:`, err.message);
    if (modelName === modelFallbacks[modelFallbacks.length - 1]) throw err;
  }
}

    const mapped = {
      insight: result.response.text().trim(),
      generatedAt: new Date().toISOString()
    };

    insightCache = { data: mapped, timestamp: now };
    res.json(mapped);
  } catch (err) {
    console.error("AI Insight Error:", err.message);
    // Serve stale cache if available rather than failing completely
    if (insightCache.data) {
      return res.json(insightCache.data);
    }
    res.status(500).send('Server Error');
  }
});

module.exports = app;