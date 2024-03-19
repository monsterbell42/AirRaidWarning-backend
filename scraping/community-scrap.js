import * as cheerio from 'cheerio';
import { communityInfo } from '../community-info.js';

async function getDcPostList(communityId, lastScrapTime = new Date(0), searchKeyword = '', tabId = '') {
    let url = new URL(communityInfo[communityId].listUrl);

    if (tabId) {
        url.searchParams.append('search_head', tabId)
    }

    if (searchKeyword) {
        url.searchParams.append('s_type', 'search_subject_memo')
        url.searchParams.append('s_keyword', encodeUTF8ForDcUrl(searchKeyword))
    }

    let html = await fetch(url).then(res => res.text())

    const $ = cheerio.load(html);
    const postListRaw = $('table.gall_list').find('.us-post')

    const postList = []
    const DC_BASE_URL = 'https://gall.dcinside.com'

    for (let elem of postListRaw) {
        let $elem = $(elem)

        if ($elem.attr('data-type') === 'icon_notice') {
            continue;
        }

        if (new Date($elem.find('.gall_date').attr('title')) < lastScrapTime) {
            continue;
        }

        postList.push({
            'documentId': $elem.find('.gall_num').text(),
            'url': DC_BASE_URL + $elem.find('.gall_tit').find('a').attr('href')
        })
    }

    return postList
}

function encodeUTF8ForDcUrl(str) {
    const encoder = new TextEncoder()
    let output = ''
    for (let char of str) {
        if (/[0-9a-zA-Z]/.test(char)) {
            output += char
            continue;
        }

        let view = encoder.encode(char)
        output += [...view].map(i => `.${i.toString(16).toUpperCase()}`).join('')
    }

    return output
}

export { getDcPostList };

// console.log(encodeUTF8ForDcUrl('단톡방'))
// getDcPostList('dc_alliescon', '속보', 500, new Date())
// .then(res=>console.log(res))