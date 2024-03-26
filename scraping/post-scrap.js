import * as cheerio from 'cheerio';
import { UrlInfo, getNaverArticleUrl } from './url-functions.js';
import { communityInfo } from '../community-info.js';
import { getWarnByCommunity, insertWarnBulk } from '../db/function.js'
import { wait } from '../useful-functions.js'

async function scrapArticleLinks(urlInfo, stack = []) {
    if (!(urlInfo instanceof UrlInfo)) {
        urlInfo = new UrlInfo(urlInfo)
    }

    const resultList = await getWarnByCommunity(urlInfo.communityId, urlInfo.documentId)

    if (resultList.length == 0) {
        console.log('링크 스크랩 전 : 1.3초 대기')
        await wait(1.3).then(() => console.log('링크 스크랩 전 대기 완'))

        console.log(`${urlInfo.url} 링크 스크랩 시작`)
        const scrapResult = await getArticleLinksByUrl(urlInfo, stack)

        console.log('링크 스크랩 후 : 1.7초 대기')
        await wait(1.7).then(() => console.log('링크 스크랩 후 대기 완'))

        return scrapResult
    }

    console.log(`db에서 불러옴 ${resultList.length}개`)
    await wait(0.1)

    return resultList.map(item => {
        const articleUrl = getNaverArticleUrl(item.press_id, item.article_id)
        return new UrlInfo(articleUrl)
    })
}


async function getArticleLinksByUrl(urlInfo, stack = []) {
    const html = await fetch(urlInfo.url).then(res => res.text())
    const $ = cheerio.load(html);
    const raidTime = getRaidDate($, urlInfo.url)

    let linkListRaw = getRawLinkList($, urlInfo.url)

    if (linkListRaw.length == 0) return []

    await reloadAllShortUrls(linkListRaw)

    linkListRaw = beUniqueUrlList(linkListRaw)

    let articleList = linkListRaw.filter(i => i.type === 'article')
    let communityList = linkListRaw.filter(i => i.type === 'community')

    console.log(`커뮤니티 리스트 ${communityList.length}개 발견`)

    let scrapedLinks = []
    if (communityList.length != 0) {
        // scrapedLinks = await Promise.all(communityList.map(i => scrapArticleLinks(i.url)))
        //     .then(value => [].concat(...value))
        //디시에서 밴 먹지 않도록 수정할 것
        scrapedLinks = await combineCommunityListScrap(communityList, [...stack, urlInfo])
    }

    let finalArticleList = beUniqueUrlList(articleList.concat(scrapedLinks))

    console.log(`${urlInfo.url} 에서 좌표 ${finalArticleList.length}개 스크랩 완료`)

    if (finalArticleList.length === 0) return []

    await insertWarnBulk(finalArticleList, urlInfo.communityId, urlInfo.documentId, raidTime)

    return finalArticleList
}

async function combineCommunityListScrap(communityList, stack) {
    let scrapedLinks = []

    for (const communityUrl of communityList) {
        if (isInStack(communityUrl, stack)) {
            continue
        }

        const scrapedResult = await scrapArticleLinks(communityUrl.url, stack)
        scrapedLinks.push(...scrapedResult)
    }

    return scrapedLinks

    function isInStack(communityUrl, stack) {
        function makeUniqueKey(urlInfo) {
            return (urlInfo.communityId || '') + '&' + (urlInfo.documentId)
        }
        const communityKey = makeUniqueKey(communityUrl)

        for (let stackUrl of stack) {
            const stackKey = makeUniqueKey(stackUrl)

            if (communityKey === stackKey) {
                console.log(communityUrl.url, '중복 발견')
                return true
            }
        }

        return false

    }
}

function getRawLinkList($, url) {
    // 링크로 찾기
    const bodyArea = $(getDocumentBodySelector(url))
    const aTagList = bodyArea.find('a');
    const innerText = bodyArea.text();

    let linkListOrigin = []

    for (let elem of aTagList) {
        if (elem.attribs?.href) {
            linkListOrigin.push(new UrlInfo(elem.attribs.href));
        }
    }

    // 텍스트로 찾기
    const urlRegex = /(https?:\/\/[0-9a-zA-Z.&?%/=-_#,]+)/g;
    // ...방지는 디시 방지용
    const urlGetByText = (innerText.match(urlRegex) || [])
        .filter(urlStr => !urlStr.includes('...'))
        .map(url => new UrlInfo(url))

    linkListOrigin.push(...urlGetByText)

    return beUniqueUrlList(linkListOrigin)
}

function getDocumentBodySelector(url) {
    const urlHost = new URL(url).host

    switch (urlHost) {
        case 'gall.dcinside.com':
        case 'm.dcinside.com':
            return 'div.writing_view_box'
        case 'www.ddanzi.com':
            return 'div.read_content'
    }
}

function getRaidDate($, url) {
    const urlHost = new URL(url).host
    let dateStr = ''

    switch (urlHost) {
        case 'gall.dcinside.com':
        case 'm.dcinside.com':
            dateStr = $('.gall_date').attr('title')
            break
        case 'www.ddanzi.com':
            dateStr = $('.top_title .time').contents()
            break
    }

    return new Date(dateStr)
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

export { scrapArticleLinks }