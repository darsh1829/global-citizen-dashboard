// --- DEPENDENCY IMPORTS ---
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const auth = require('./middleware/auth');
const axios = require('axios');
// --- INITIALIZATION ---
const app = express();

// --- MIDDLEWARE ---
app.use(express.json());

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
    res.json({ id: newUserId, email: newUser.rows[0].email });
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

// GET a user's preferences (Protected Route)
app.get('/api/preferences', auth, async (req, res) => {
  try {
    // THE FIX: Corrected the typo from 'tracked_countires' to 'tracked_countries'.
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

//
app.put('/api/preferences',auth, async (req, res) => {
  try {
    const {tracked_countries, tracked_cryptos}=req.body;
    const userId = req.user.id;

    const updatePreferences = await pool.query(
      "UPDATE preferences SET tracked_countries=$1, tracked_cryptos = $2 WHERE user_id = $3 RETURNING *",
      [tracked_countries, tracked_cryptos, userId]
    );
     console.log("Data being sent to client:", updatePreferences.rows[0]);
    res.json(updatePreferences.rows[0]);
  } catch (err) {
    
    console.error("Update Preferences Error:", err.message);
    res.status(500).send('Server Error');
  }
});

//Current News
app.get('/api/data/news', async (req, res) => {
  try {
    const newsResponse = await axios.get('https://api.currentsapi.services/v1/latest-news', {
      params: {
        // The API key is now securely loaded from our .env file
        apiKey: process.env.CURRENTS_API_KEY
      }
    });

    res.json(newsResponse.data);

  } catch (err) {
    console.error("News API Error:", err.message);
    res.status(500).send('Server Error');
  }
});


//Crypto rate
app.get('/api/data/crypto', async(req,res)=>{
  try{
  const cryptoResponse =  await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      
      ids: 'bitcoin,ethereum,ripple,dogecoin',
      vs_currencies: 'usd'

    }
  })
   
    res.json(cryptoResponse.data);
  }
  catch(err){
   res.status(500).send('Server Error');
  }
})

//ExcangeRate
app.get('/api/data/rates', async (req, res) => {
  try {
    // Get the API key from our environment variables
    const apiKey = process.env.EXCHANGERATE_API_COM_KEY;

    // Construct the correct URL with the API key in the path
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    // Make the GET request to the new URL
    const ratesResponse = await axios.get(url);

    res.json(ratesResponse.data);

  } catch (err) {
    console.error("Rates API Error:", err.response ? err.response.data : err.message);
    res.status(500).send('Server Error');
  }
});


// --- EXPORT ---
module.exports = app;


//currentsapi: JI3HDGEZkqMUjm68PssPxLRMh7r8adug0sYUbR4xAkNWz65D
//coingecko: CG-PFioNEaxzA7i7hEtyTbteSno	
// exchangerate.host: 278f44226f272e209967c455643fee75


