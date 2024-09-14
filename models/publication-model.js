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

exports.findAll = async (pageSize, pageIndex) => {
    const query = `SELECT 
                    p.uuid, 
                    p.title, 
                    p.content, 
                    p.user_uuid as "createdByUuid",
                    u.email as "createdBy",
                    COALESCE(
                        (
                          SELECT 
                            ARRAY_AGG(
                                json_build_object(
                                    'content', c.content,
                                    'commentedAt', c.created_at,
                                    'commentedBy', cu.email,
                                    'commentedByUuid', cu.uuid
                                )
                            ) 
                          FROM comments c 
                          LEFT JOIN users cu ON c.user_uuid = cu.uuid
                          WHERE c.publication_uuid = p.uuid
                        )
                        , '{}') as "comments",
                    COALESCE(
                        (
                          SELECT ARRAY_AGG(
                              json_build_object(
                                  'likedBy', lu.email,
                                  'likedByUuid', lu.uuid
                              )
                          ) FROM likes l 
                          LEFT JOIN users lu ON l.user_uuid = lu.uuid 
                          WHERE l.publication_uuid = p.uuid
                        )
                        , '{}') as "likes"
                FROM publications p
                LEFT JOIN users u ON p.user_uuid = u.uuid
                LIMIT $1 OFFSET $2`;
   
    // const query = `
    // WITH LimitedPublications AS (
    //     SELECT p.uuid, p.title, p.content, p.user_uuid, u.email AS created_by
    //     FROM publications p
    //     LEFT JOIN users u ON p.user_uuid = u.uuid
    //   ),
    
    //   PaginatedComments AS (
    //     SELECT 
    //       c.publication_uuid, 
    //       json_build_object(
    //         'content', c.content,
    //         'commentedAt', c.created_at,
    //         'commentedBy', cu.email,
    //         'commentedByUuid', cu.uuid
    //       ) AS comment
    //     FROM comments c
    //     LEFT JOIN users cu ON c.user_uuid = cu.uuid
    //     WHERE c.publication_uuid IN (SELECT uuid FROM LimitedPublications)
    //     ORDER BY c.created_at DESC
    //   ),
    
    //   PaginatedLikes AS (
    //     SELECT 
    //       l.publication_uuid, 
    //       json_build_object(
    //         'likedBy', lu.email,
    //         'likedByUuid', lu.uuid
    //       ) AS like
    //     FROM likes l
    //     LEFT JOIN users lu ON l.user_uuid = lu.uuid
    //     WHERE l.publication_uuid IN (SELECT uuid FROM LimitedPublications)
    //   )
      
    //   SELECT 
    //     lp.uuid, 
    //     lp.title, 
    //     lp.content, 
    //     lp.user_uuid AS "userUuid",
    //     lp.created_by,
    //     COALESCE(
    //       (
    //         SELECT ARRAY_AGG(pc.comment)
    //         FROM PaginatedComments pc
    //         WHERE pc.publication_uuid = lp.uuid
    //       ), '{}'
    //     ) AS "comments",
    //     COALESCE(
    //       (
    //         SELECT ARRAY_AGG(pl.like)
    //         FROM PaginatedLikes pl
    //         WHERE pl.publication_uuid = lp.uuid
    //       ), '{}'
    //     ) AS "likes"
    //   FROM LimitedPublications lp;
    // `

    const countQuery = `SELECT COUNT(uuid) FROM publications`;
    try {
        const result = await pool.query(query, pageSize, pageIndex * pageSize);
        const countResult = await pool.query(countQuery);

        const totalCount = +countResult.data[0]?.count || 0;

        return { success: result.success, data: result.data, totalCount};
    } catch (error) {
        throw error;
    }
}

exports.findOne = async (uuid) => {
    const query = `SELECT 
                    p.uuid, 
                    p.title, 
                    p.content, 
                    p.user_uuid as "createdByUuid",
                    u.email as "createdBy",
                    COALESCE(
                        (
                          SELECT 
                            ARRAY_AGG(
                                json_build_object(
                                    'content', c.content,
                                    'commentedAt', c.created_at,
                                    'commentedBy', cu.email,
                                    'commentedByUuid', cu.uuid
                                )
                            ) 
                          FROM comments c 
                          LEFT JOIN users cu ON c.user_uuid = cu.uuid
                          WHERE c.publication_uuid = p.uuid
                        )
                        , '{}') as "comments",
                    COALESCE(
                        (
                          SELECT ARRAY_AGG(
                              json_build_object(
                                  'likedBy', lu.email,
                                  'likedByUuid', lu.uuid
                              )
                          ) FROM likes l 
                          LEFT JOIN users lu ON l.user_uuid = lu.uuid 
                          WHERE l.publication_uuid = p.uuid
                        )
                        , '{}') as "likes"
                FROM publications p
                LEFT JOIN users u ON p.user_uuid = u.uuid
                WHERE p.uuid = $1`;
    
    try {
        const result = await pool.query(query, uuid);
        return result.success ? result.data[0] : null;
    } catch (error) {
        throw error;
    }
}