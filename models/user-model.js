const pool = require('../config/database.js');

// Get user by email
exports.findOneByEmail = async (email) => {
    try {
        const query = 'SELECT uuid, password, is_verified as "isVerified", verification_code as "verificationCode", verification_code_exp_date_time as "codeExpDateTime" FROM users WHERE email = $1 LIMIT 1';
        const result = await pool.query(query, email);
        return result.success ? result.data[0] : null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

// Get user by uuid
exports.findOneByUuid = async (uuid) => {
    try {
        const query = 'SELECT uuid, full_name, email, is_verified as "isVerified" FROM users WHERE uuid = $1 LIMIT 1';
        const result = await pool.query(query, uuid);
        return result.success ? result.data[0] : null;
    } catch (error) {
        console.error('Error finding user by uuid:', error);
        throw error;
    }
};

// Check if user exists by email
exports.userExists = async (email) => {
    try {
        const query = 'SELECT 1 FROM users WHERE email = $1';
        const result = await pool.query(query, email);
        return result.success;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
};

// Create new user
exports.create = async (name, email, password) => {
    try {
        const query = `
            INSERT INTO users (full_name, email, password) 
            VALUES ($1, $2, $3) 
        `;
        const result = await pool.query(query, name, email, password);
        return result.success;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Update a user
exports.update = async (fullName, email, updateDate, uuid) => {
    try {
        const query = 'UPDATE users SET full_name = $1, email = $2, updated_at = $3 WHERE uuid = $4';
        const result = await pool.query(query, fullName, email, updateDate, uuid);
        return result.success;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

exports.setVerificationCodeWithExpDateTime = async (userUuid, code, dateTime) => {
    try {
        const query = `
            UPDATE users 
            SET verification_code_exp_date_time = $1, verification_code = $2
            WHERE uuid = $3
        `;
       const result = await pool.query(query, dateTime, code, userUuid);
       return result.success;
    } catch (error) {
        console.error('Error setting verification code expiration:', error);
        throw error;
    }
};


exports.verifyUserEmail = async (email) => {
    try {
        const query = 'UPDATE users SET is_verified = true WHERE email = $1';
        const result = await pool.query(query, email);
        return result.success;
    } catch (error) {
        console.error('Error verifying user email:', error);
        throw error;
    }
};
