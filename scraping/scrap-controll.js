import { scrapSchedule } from './scrap-schedule.js'
import { getDcPostList } from './community-scrap.js'
import { scrapArticleLinks } from './post-scrap.js'
import { getScrapTime, updateScrapTime } from '../db/function.js'
import { wait } from '../useful-functions.js'

async function scrapStart() {
    for (let communityId in scrapSchedule) {
        const S_TO_MS = 1000
        const scrapIntervalTime = scrapSchedule[communityId].intervalSecond * S_TO_MS
        const scrapOptions = scrapSchedule[communityId].scrapOptions

        console.log(communityId, '등록 전 실행')

        await scrapDcGall(communityId, scrapOptions)

        console.log(communityId, '등록 전 실행 완료')

        setInterval(scrapDcGall, scrapIntervalTime, communityId, scrapOptions)

        console.log(communityId, '일정 등록 완료')
        console.log('스크랩 등록간 대기 : 240초 대기')

        await wait(240).then(() => console.log('스크랩 등록 대기 완'))
    }
}

async function scrapDcGall(communityId, scrapOptions) {
    console.log(communityId, '스크랩 시작')

    let nowTime = new Date()
    const postList = await scrapDcPostUnify(communityId, scrapOptions)

    console.log(`${communityId}에서 postlist ${postList.length}개 수집`)

    for (let post of postList) {
        let result = await scrapArticleLinks(post.url)
        console.log(`크롤링된 링크 ${result.length}개`)
    }

    await updateScrapTime(communityId, nowTime)
    console.log(`${communityId} 스크랩 타임 업데이트`)

}

async function scrapDcPostUnify(communityId, scrapOptions) {
    console.log(communityId, scrapOptions, '스크랩 시작')

    const lastScrapTime = await getLastScrapTime(communityId)

    let postList = []

    if (scrapOptions.length == 0 || !scrapOptions) {
        postList = await getDcPostList(communityId, lastScrapTime).catch(err => 'err')
    }
    else {
        // postList = await Promise.all(scrapOptions.map(scrapOption => {
        //     const { searchKeyword, tabId } = scrapOption
        //     return getDcPostList(communityId, lastScrapTime, searchKeyword, tabId)
        // }))
        //     .then(value => [].concat(...value))
        //     .then(postList => beUniqueUrlList(postList))
        //     .catch(err=>'err')
        // 디시에 차단당했던 이전 링크
        for (const scrapOption of scrapOptions) {
            const { searchKeyword, tabId } = scrapOption
            const postListResult = await getDcPostList(communityId, lastScrapTime, searchKeyword, tabId)

            console.log(scrapOption, '스크랩 완', postListResult.length, '개')

            postList.push(...postListResult)

            console.log('스크랩 옵션간 대기 : 2초 대기')
            await wait(2).then(() => console.log('스크랩 옵션간 대기 완'))
        }

        postList = beUniqueUrlList(postList)
    }

    console.log(`${communityId}에서 post ${postList.length}개 수집 완료`)

    if (postList == 'err') {
        console.log(communityId, '오류')
    }

    console.log(communityId, '스크랩 완료')

    return postList
}

async function getLastScrapTime(communityId) {
    const getScrapTimeResult = await getScrapTime(communityId)

    let lastScrapTime = new Date(0)

    if (getScrapTimeResult.length !== 0) {
        lastScrapTime = getScrapTimeResult[0].scrap_time
    }

    return lastScrapTime
}

function beUniqueUrlList(dcUrlList) {
    const urlListCopy = [...dcUrlList]
    const uniquleCheckSet = new Set()
    const uniqueUrlList = [];

    for (let urlInfo of urlListCopy) {
        const uniqueKey = urlInfo.documentId

        if (!uniquleCheckSet.has(uniqueKey)) {
            uniquleCheckSet.add(uniqueKey)
            uniqueUrlList.push(urlInfo)
        }
    }

    return uniqueUrlList;
}

export { scrapStart }

// scrapDcGall('dc_ljm', [
//     { tabId: 10 },
//     { searchKeyword: '좌표' },
//     { searchKeyword: '댓방' },
//     { searchKeyword: '댓관' },
//     { searchKeyword: 'ㅂㅊ' },
//     { searchKeyword: '비추' },
//     { searchKeyword: 'ㄸㅈ' },
//     { searchKeyword: '딴지' },
//     { searchKeyword: 'ㅊㅊ' },
//     { searchKeyword: '베댓' },
//     { searchKeyword: '역따' }
// ])

// scrapStart()