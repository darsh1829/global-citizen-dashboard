// --- DEPENDENCY IMPORTS ---
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const auth = require('./middleware/auth');
const axios = require('axios');
// --- INITIALIZATION ---
const app = express();
const cors = require('cors');
// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());
// --- ROUTES ---

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, passwordHash]
    );

    const newUserId = newUser.rows[0].id;

    // Create default preferences for the new user
    await pool.query(
      "INSERT INTO preferences (user_id) VALUES ($1)",
      [newUserId]
    );

    // --- THIS IS THE NEW PART ---
    // 1. Create a JWT payload for the new user
    const payload = {
      user: {
        id: newUserId
      }
    };

    // 2. Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Send back the token AND the user object
    res.json({ token, user: newUser.rows[0] });
    // --------------------------

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
    res.json({ token, user:user.rows[0] });
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


//Onboarding Route
app.put('/api/users/me', auth, async (req,res) => {
  try{
    const {name} = req.body;
    const userID = req.user.id;
    const updateUser = await pool.query(
        "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
        [name, userID]
    ); 
    res.json(updateUser.rows[0]);
    
    
  }catch(err){
      console.error("Onboarding Failed: ", err.message);
      res.status(500).send("Server Error");
  }

})

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
// app.get('/api/data/crypto', async(req,res)=>{
//   try{
//   const cryptoResponse =  await axios.get('https://api.coingecko.com/api/v3/simple/price', {
//     params: {
      
//       ids: 'bitcoin,ethereum,ripple,dogecoin',
//       vs_currencies: 'usd'

//     }
//   })
   
//     res.json(cryptoResponse.data);
//   }
//   catch(err){
//    res.status(500).send('Server Error');
//   }
// })

app.get('/api/data/crypto', async (req, res) => {
  try {
    const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd', // The currency to compare against
        ids: 'bitcoin,ethereum,ripple,dogecoin,solana,cardano', // The coins we want
        order: 'market_cap_desc', // Order the results
        per_page: 10, // Limit the results
        page: 1,
        sparkline: false
      }
    });
    res.json(cryptoResponse.data);
  } catch (err) {
    console.error("Crypto API Error:", err.message);
    res.status(500).send('Server Error');
  }
});

//ExcangeRate
app.get('/api/data/rates', async (req, res) => {
  try {
    const apiKey = process.env.EXCHANGERATE_API_COM_KEY;

    // --- ADD THIS DEBUGGING LINE ---
    console.log("Attempting to use ExchangeRate-API key:", apiKey);
    // -----------------------------

    if (!apiKey) {
      throw new Error("Exchange rate API key is missing. Please check your .env file.");
    }

    const url = "https://v6.exchangerate-api.com/v6/aecdd8ef95e4c227b0d6f738/latest/USD"//`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    const ratesResponse = await axios.get(url);

    res.json(ratesResponse.data);

  } catch (err) {
    console.error("Rates API Error:", err.message);
    res.status(500).send('Server Error');
  }
});


// --- EXPORT ---
module.exports = app;



