const pool = require('../config/database.js');


exports.findOneByUuid = async (uuid) => {
    const query = 'SELECT uuid, content FROM comments WHERE uuid = $1 LIMIT 1';

    try {
        const result = await pool.query(query, uuid);
        return result.success ? result.data[0] : null;
    } catch (error) {
        console.error('Error finding post by uuid:', error);
        throw error;
    }
};

exports.commentExists = async (uuid, postUuid) => {
    const query = 'SELECT 1 FROM comments WHERE uuid = $1 AND post_uuid = $2';
    try {
        const result = await pool.query(query, uuid, postUuid);
        return result.success;
    } catch (error) {
        console.error('Error checking if post exists:', error);
        throw error;
    }
};

exports.createComment = async (content, user_uuid, post_uuid) => {
    const query = `INSERT INTO comments (content, user_uuid, post_uuid) VALUES ($1, $2, $3)`;
    try {
        const result = await pool.query(query, content, user_uuid, post_uuid);
        return result.success;
    } catch (error) {
        throw error;
    }
}

exports.deleteComment = async (uuid) => {
    const query = `DELETE FROM comments WHERE uuid = $1`;
    try {
        const result = await pool.query(query, uuid);
        return result.success;
    } catch (error) {
        throw error;
    }
}