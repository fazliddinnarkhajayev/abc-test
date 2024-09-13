const pool = require('../config/database.js');


exports.findOneByUuid = async (uuid) => {
    const query = 'SELECT uuid, title, content, user_uuid as "userUuid" FROM publications WHERE uuid = $1 LIMIT 1';

    try {
        const result = await pool.query(query, uuid);
        return result.success ? result.data[0] : null;
    } catch (error) {
        console.error('Error finding publication by uuid:', error);
        throw error;
    }
};

exports.postExists = async (uuid, userUuid) => {
    const query = 'SELECT 1 FROM publications WHERE uuid = $1 AND user_uuid = $2';
    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        console.error('Error checking if publication exists:', error);
        throw error;
    }
};

exports.create = async (title, content, user_uuid) => {
    const query = `
        INSERT INTO publications (title, content, user_uuid)
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
    const query = `UPDATE publications set title = $1, content = $2, updated_at = $3 WHERE uuid = $4 AND user_uuid = $5`;

    try {
        const result = await pool.query(query, title, content, updateDate, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
};

exports.delete = async (uuid, userUuid) => {
    const query = `DELETE FROM publications WHERE uuid = $1 AND user_uuid = $2`;

    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
};

exports.isAlreadyLiked = async (uuid, userUuid) => {
    const query = `SELECT 1 FROM likes WHERE publication_uuid = $1 AND user_uuid = $2`;
    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
}
exports.createLike = async (uuid, userUuid) => {
    const query = `INSERT INTO likes (publication_uuid, user_uuid) VALUES ($1, $2)`;
    try {
        const result = await pool.query(query, uuid, userUuid);
        return result.success;
    } catch (error) {
        throw error;
    }
}

exports.findAll = async () => {
    // const query = `SELECT 
    //                 p.uuid, 
    //                 p.title, 
    //                 p.content, 
    //                 p.user_uuid as "userUuid",
    //                 u.email as "createdBy",
    //                 COALESCE(
    //                     (
    //                       SELECT 
    //                         ARRAY_AGG(
    //                             json_build_object(
    //                                 'content', c.content,
    //                                 'commentedAt', c.created_at,
    //                                 'commentedBy', cu.email,
    //                                 'commentedByUuid', cu.uuid
    //                             )
    //                         ) 
    //                       FROM comments c 
    //                       LEFT JOIN users cu ON c.user_uuid = cu.uuid
    //                       WHERE c.publication_uuid = p.uuid
    //                     )
    //                     , '{}') as "comments",
    //                 COALESCE(
    //                     (
    //                       SELECT ARRAY_AGG(
    //                           json_build_object(
    //                               'likedBy', lu.email,
    //                               'likedByUuid', lu.uuid
    //                           )
    //                       ) FROM likes l 
    //                       LEFT JOIN users lu ON l.user_uuid = lu.uuid 
    //                       WHERE l.publication_uuid = p.uuid
    //                     )
    //                     , '{}') as "likes"
    //             FROM publications p
    //             LEFT JOIN users u ON p.user_uuid = u.uuid`;
    const query = `
    WITH CommentData AS (
        SELECT 
          c.publication_uuid, 
          json_build_object(
            'content', c.content,
            'commentedAt', c.created_at,
            'commentedBy', cu.email,
            'commentedByUuid', cu.uuid
          ) AS comment
        FROM comments c
        LEFT JOIN users cu ON c.user_uuid = cu.uuid
      ),
      LikeData AS (
        SELECT 
          l.publication_uuid, 
          json_build_object(
            'likedBy', lu.email,
            'likedByUuid', lu.uuid
          ) AS like
        FROM likes l
        LEFT JOIN users lu ON l.user_uuid = lu.uuid
      )
      
      SELECT 
        p.uuid, 
        p.title, 
        p.content, 
        p.user_uuid AS "userUuid",
        u.email AS "createdBy",
        COALESCE(
          (
            SELECT ARRAY_AGG(cd.comment)
            FROM CommentData cd
            WHERE cd.publication_uuid = p.uuid
          ), '{}'
        ) AS "comments",
        COALESCE(
          (
            SELECT ARRAY_AGG(ld.like)
            FROM LikeData ld
            WHERE ld.publication_uuid = p.uuid
          ), '{}'
        ) AS "likes"
      FROM publications p
      LEFT JOIN users u ON p.user_uuid = u.uuid;
    `
    try {
        const result = await pool.query(query);
        return result.success ? result.data : null;
    } catch (error) {
        throw error;
    }
}



