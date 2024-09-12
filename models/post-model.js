const pool = require('../config/database.js');


exports.findOneByUuid = async (uuid) => {
    const query = 'SELECT uuid, title, content, user_uuid as "userUuid" FROM posts WHERE uuid = $1 LIMIT 1';

    try {
        const result = await pool.query(query, uuid);
        return result.success ? result.data[0] : null;
    } catch (error) {
        console.error('Error finding post by uuid:', error);
        throw error;
    }
};

exports.postExists = async (uuid, userUuid) => {
    const query = 'SELECT 1 FROM posts WHERE uuid = $1 AND user_uuid = $2';
    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        console.error('Error checking if post exists:', error);
        throw error;
    }
};

exports.create = async (title, content, user_uuid) => {
    const query = `
        INSERT INTO posts (title, content, user_uuid)
        VALUES ($1, $2, $3)
    `;

    try {
        const result = await pool.query(query, title, content, user_uuid);
        return result.success;
    } catch (error) {
        throw error;
    }
};

exports.update = async (title, content, updateDate, uuid, userUuid) => {
    const query = `UPDATE posts set title = $1, content = $2, updated_at = $3 WHERE uuid = $4 AND user_uuid = $5`;

    try {
        const result = await pool.query(query, title, content, updateDate, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
};

exports.delete = async (uuid, userUuid) => {
    const query = `DELETE FROM posts WHERE uuid = $1 AND user_uuid = $2`;

    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
};

exports.isAlreadyLiked = async (uuid, userUuid) => {
    const query = `SELECT 1 FROM likes WHERE post_uuid = $1 AND user_uuid = $2`;
    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
}
exports.createLike = async (uuid, userUuid) => {
    const query = `INSERT INTO likes (post_uuid, user_uuid) VALUES ($1, $2)`;
    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
}
