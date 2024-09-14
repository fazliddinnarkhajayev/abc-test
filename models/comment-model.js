const pool = require('../config/database.js');


exports.findOneByUuid = async (uuid) => {
    const query = 'SELECT uuid, content FROM comments WHERE uuid = $1 LIMIT 1';

    try {
        const result = await pool.query(query, uuid);
        return result.success ? result.data[0] : null;
    } catch (error) {
        console.error('Error finding publication by uuid:', error);
        throw error;
    }
};

exports.commentExists = async (uuid, publicationUUid) => {
    const query = 'SELECT 1 FROM comments WHERE uuid = $1 AND publication_uuid = $2';
    try {
        const result = await pool.query(query, uuid, publicationUUid);
        return result.success;
    } catch (error) {
        console.error('Error checking if publication exists:', error);
        throw error;
    }
};

exports.createComment = async (content, user_uuid, publication_uuid) => {
    const query = `INSERT INTO comments (content, user_uuid, publication_uuid) VALUES ($1, $2, $3)`;
    try {
        const result = await pool.query(query, content, user_uuid, publication_uuid);
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

exports.findAll = async (pageSize, pageIndex) => {
    const query = `SELECT
                    c.uuid,
                    c.content,
                    c.created_at as "createdAt",
                    u.email as "creatdBy",
                    p.uuid as "publicationUuid"
                    FROM comments c
                    LEFT JOIN users u ON c.user_uuid = u.uuid
                    LEFT JOIN publications p ON c.publication_uuid = p.uuid
                    LIMIT $1 OFFSET $2
                    `;
    const countQuery = 'SELECT COUNT(uuid) FROM comments';
    
try {
    const result = await pool.query(query, pageSize, pageIndex * pageSize);
    const countResult = await pool.query(countQuery);

    const totalCount = +countResult.data[0]?.count || 0;
    return { success: result.success, data: result.data, totalCount };
} catch (error) {
    console.error('Error finding all comments`:', error);
    throw error;
}
}