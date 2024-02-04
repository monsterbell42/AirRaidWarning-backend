import * as cheerio from 'cheerio';
import { UrlInfo, getUrlInfo } from './url-functions.js';

async function getDcPostList() {
    let html = await fetch('https://gall.dcinside.com/mgallery/board/lists/?id=rightpolitics&list_num=10').then(res => res.text())

    const $ = cheerio.load(html);
    const postListRaw = $('table.gall_list').find('.us-post')

    const postList = []
    const DC_BASE_URL = 'https://gall.dcinside.com/'

    for (let elem of postListRaw) {
        let $elem = $(elem)

        if ($elem.attr('data-type') === 'icon_notice') {
            continue;
        }

        postList.push({
            'documentId': $elem.find('.gall_num').text(),
            'url': DC_BASE_URL + $elem.find('.gall_tit').find('a').attr('href')
        })
    }

    return postList
}

async function getAllArticleLink(url) {
    if (typeof url === 'string') {
        url = new URL(url);
    }

    const html = await fetch(url).then(res => res.text())

    let linkListRaw = getRawLinkList(html, url.host)

    await reloadAllShortUrls(linkListRaw)

    linkListRaw = beUniqueUrlList(linkListRaw)

    let articleList = linkListRaw.filter(i => i.type === 'article')
    let communityList = linkListRaw.filter(i => i.type === 'community')


    let scrapedLinks = []
    if (communityList.length != 0) {
        scrapedLinks = await Promise.all(communityList.map(i => getAllArticleLink(i.url)))
        .then(value => [].concat(...value))
    }

    let finalArticleList = beUniqueUrlList(articleList.concat(scrapedLinks))

    return finalArticleList
}

function getRawLinkList(html, urlHost) {
    const $ = cheerio.load(html);

    const aTagList = $(getDocumentBodySelector(urlHost)).find('a');

    let linkListOrigin = []

    for (let elem of aTagList) {
        linkListOrigin.push(new UrlInfo(elem.attribs.href));
    }

    return beUniqueUrlList(linkListOrigin)
}

function getDocumentBodySelector(urlHost) {
    switch (urlHost) {
        case 'gall.dcinside.com':
        case 'm.dcinside.com':
            return 'div.writing_view_box'
        case 'www.ddanzi.com':
            return 'div.read_content'
    }
}

async function reloadAllShortUrls(linkListOrigin) {
    let tryCount = 3

    while (tryCount >= 0) {
        try {
            await Promise.all(linkListOrigin
                .filter(i => i.type === 'shortUrl')
                .map(i => i.reloadShortUrl()))
            return;
        }
        catch {
            tryCount -= 1
        }
    }

    console.error('변환 오류')
}

function beUniqueUrlList(urlInfoList) {
    function makeUniqueKey(urlInfo) {
        return (urlInfo.communityId || urlInfo.pressId || '') + '&' + (urlInfo.documentId || urlInfo.articleId)
    }

    const uniquleCheckSet = new Set()
    const uniqueUrlInfo = [];

    for (let urlInfo of urlInfoList) {
        let uniqueKey = makeUniqueKey(urlInfo)

        if (!uniquleCheckSet.has(uniqueKey)) {
            uniquleCheckSet.add(uniqueKey)
            uniqueUrlInfo.push(urlInfo)
        }
    }

    return uniqueUrlInfo;
}

getAllArticleLink('https://gall.dcinside.com/mini/board/view/?id=test&no=1124').then(v=>console.log(v))
//test url : 'https://gall.dcinside.com/mini/board/view/?id=test&no=1124'
//'https://www.ddanzi.com/index.php?mid=free&document_srl=796235818'