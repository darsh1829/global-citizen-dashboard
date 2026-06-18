// const {Pool} = require('pg');

// const pool = new Pool({
//     user: 'hiyamajmundar',
//     host: 'localhost',
//     database: 'global_citizen_db',
//     password: '@ps25',
//     port: 5432,
// })

// module.exports = pool;

const { Pool } = require('pg');
 
// Neon requires SSL. The connection string itself usually includes
// ?sslmode=require, but we set ssl explicitly here as a safety net.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
 
module.exports = pool;