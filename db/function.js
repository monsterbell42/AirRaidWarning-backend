import { pool } from './connect.js';
import mysql from 'mysql2/promise';

async function doQuery(sql, params = []) {
    const connection = await pool.getConnection();
    let results

    if (params.length == 0) {
        [results] = await connection.query(sql);
    } else {
        [results] = await connection.execute(sql, params);
    }

    connection.release();

    return results
}

async function getWarnByArticle(pressId, articleId) {
    const sql = 'SELECT `community_id`, `document_id` FROM `naver_raids` WHERE `press_id`=(?) AND `article_id`=(?);'

    return await doQuery(sql, [pressId, articleId])
}

async function getWarnByCommunity(communityId, documentId) {
    const sql = 'SELECT `press_id`, `article_id` FROM `naver_raids` WHERE `community_id`=(?) AND `document_id`=(?);'

    return await doQuery(sql, [communityId, documentId])
}

async function insertWarnOne(pressId, articleId, communityId, documentId, raidTime) {
    const sql = 'INSERT IGNORE INTO `naver_raids`(`press_id`, `article_id`, `community_id`, `document_id`, `raid_time`) VALUES(?,?,?,?,?);'

    return await doQuery(sql, [pressId, articleId, communityId, documentId, raidTime])
}

async function insertWarnBulk(urlInfoList, communityId, documentId, raidTime) {
    if (urlInfoList.length == 0) {
        console.log('insertWarnBulk 오류')
        return
    }
    const valuesPlaceholder = '(?,?,?,?,?)';
    const sql = 'INSERT IGNORE INTO `naver_raids`(`press_id`, `article_id`, `community_id`, `document_id`, `raid_time`) VALUES'
        + Array(urlInfoList.length).fill(valuesPlaceholder).join(',') + ';'

    const inputList = []

    for (let urlInfo of urlInfoList) {
        inputList.push(urlInfo.pressId, urlInfo.articleId, communityId, documentId, raidTime)
    }

    return await doQuery(sql, inputList)
}

async function getScrapTime(communityId) {
    const sql = 'SELECT `scrap_time` FROM `last_scrap_time` WHERE `community_id`=(?);'
    return await doQuery(sql, [communityId])
}

async function updateScrapTime(communityId, scrapTime = new Date()) {
    if (!(scrapTime instanceof Date)) {
        scrapTime = new Date(scrapTime)
    }
    
    const sql = 'INSERT INTO `last_scrap_time` (`community_id`, `scrap_time`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `scrap_time`=?;'
    return await doQuery(sql, [communityId, scrapTime, scrapTime])
}

export { getWarnByArticle, getWarnByCommunity, insertWarnOne, getScrapTime, updateScrapTime, insertWarnBulk };

// getWarnByArticle(57,1794654).then(i=>console.log(i))

// doQuery('SELECT * FROM `users` WHERE `id`=(?) ORDER BY `name` ASC;', [2]).then(i => console.log(i))


// insertWarnOne(1,1,1,1,new Date())

// getWarnByArticle(1, 1).then(i=>console.log(i))

// insertWarnBulk([
//     { pressId: 2, articleId: 2 }, { pressId: 3, articleId: 3 }, { pressId: 4, articleId: 4 }
// ], 8, 8, new Date())

// getScrapTime('dc_test').then(i=>console.log(i))