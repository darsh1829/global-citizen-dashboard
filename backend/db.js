const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'global_citizen_db',
    password: 'Darsh@ps25',
    port: 5432,
})

module.exports = pool;