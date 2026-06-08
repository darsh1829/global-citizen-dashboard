const {Pool} = require('pg');

const pool = new Pool({
    user: 'hiyamajmundar',
    host: 'localhost',
    database: 'global_citizen_db',
    password: '@ps25',
    port: 5432,
})

module.exports = pool;