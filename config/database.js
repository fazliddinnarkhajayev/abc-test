const { Pool } = require('pg');
require('dotenv').config();
const { DatabaseError } = require('../utils/errors.js');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'abc_test',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
});

async function query(queryText, ...params) {
    // Automatically get a client connection from the pool
    const client = await pool.connect();
  
    try {
        // Use the client for database operations
        const res = await client.query(queryText, params);
        return { success: res.rowCount > 0, data: res.rows };
    } catch (error) {
        console.error('Error during database operation:', error);
        throw new DatabaseError(error.message);
    } finally {
        // Automatically release the client back to the pool
        client.release();
    }
}

module.exports = { query };
