import * as cheerio from 'cheerio';

async function hello(url) {
    if (typeof url === 'string') {
        url = new URL(url);
    }

    const html = await fetch(url).then(res => res.text())

    const $ = cheerio.load(html);

    console.log($('.top_title .time').length)
    const documentDate = new Date($('.top_title .time').contents())

    console.log(documentDate.toString())
}

hello('https://www.ddanzi.com/index.php?mid=free&document_srl=796235818')