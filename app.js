import express from 'express';
import { getWarnByArticle } from './db/function.js';
import { communityInfo } from './community-info.js';
import { scrapStart } from './scraping/scrap-controll.js'

const app = express();
let port = 3000;

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { type, press_id, article_id } = req.query;

    let sendResult = {
        status: 'error',
        isRaid: false,
        message: 'default'
    }

    if (isNaN(press_id) || isNaN(article_id)) {
        let sendResult = {
            status: 'error',
            isRaid: false,
            message: 'Invalid input format: not a numeric value'
        }

        res.send(sendResult);
        return;
    }

    getWarnByArticle(press_id, article_id)
        .then((raidResult) => {
            if (raidResult.length === 0) {
                sendResult = {
                    status: 'success',
                    isRaid: false
                }
                return;
            }

            let raidResultFinal = []
            for (let i of raidResult) {
                const communityResult = communityInfo[i.community_id];
                let pushJson = {}

                if(!communityResult) {
                    pushJson = {
                        community_name: i.community_id,
                        community_url: ''
                    }

                } else {
                    pushJson = {
                        community_name: communityResult.name,
                        community_url: communityResult.getUrl(i.document_id)
                    }
                }

                raidResultFinal.push(pushJson)
            }

            sendResult = {
                status: 'success',
                isRaid: true,
                result: raidResultFinal
            }
        })
        .catch((err) => {
            sendResult = {
                status: 'error',
                isRaid: false,
                message: 'db error'
            }
        })
        .finally(() => {
            res.send(sendResult);
        })

});

const server = app.listen(port, () => {
    console.log(`server on ${port}`);
});

// (async () => {
//     await scrapStart().catch(err => console.log(err))
// })()