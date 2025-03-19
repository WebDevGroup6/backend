const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necesario para conexiones a Supabase o servicios cloud
    }
});

module.exports = pool;