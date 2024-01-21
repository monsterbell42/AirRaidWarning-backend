import express from 'express';
import {conn as db} from './db/maria.js';

const app = express();
let port = 3000;

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")

    const {url} = req.query;
    
    let fakeRaidWarn = {
        isRaid: true,
        selector: '#cbox_module',
        originName: '공격 원점',
        originUrl: 'https://www.naver.com' //공습경보 원점
    }

    res.send(fakeRaidWarn);
});

//maria db
db.connect();



const server = app.listen(port, () => {
    console.log(`server on ${port}`);
});