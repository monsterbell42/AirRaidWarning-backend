import { pool } from './connect.js';

function getWarn(press_id, article_id) {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.error('Error getting connection from pool:', err);
                reject(err);
                return;
            }

            const sql = `SELECT community_id, document_id
            FROM raid_list_naver_article
            WHERE press_id=${press_id}
            AND article_id=${article_id}`;

            connection.query(sql, (queryError, results) => {
                if (queryError) {
                    console.error('Error executing query:', queryError);
                    reject(queryError);
                    return;
                }

                connection.release();
                resolve(results);
            });
        });
    });
}


export { getWarn };
