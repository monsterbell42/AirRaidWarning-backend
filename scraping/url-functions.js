class UrlInfo {
    constructor(url) {
        this.setNewUrl(url)
    }

    setNewUrl(url) {
        Object.keys(this).forEach(key => delete this[key]); //초기화
        Object.assign(this, getUrlInfo(url), { url });
    }

    async reloadShortUrl() {
        if (this.type != 'shortUrl') {
            console.log('TypeError : The type is not shortUrl')
            return
        }
        const newUrl = await fetch(this.url).then((res) => res.url)

        this.setNewUrl(newUrl)
    }
}


function getUrlInfo(url) {
    if (typeof url === 'string') {
        url = new URL(url);
    }

    switch (url.host) {
        case 'n.news.naver.com':
            return getNaverArticleInfo(url);
        case 'gall.dcinside.com':
            return getDcPCPostInfo(url);
        case 'm.dcinside.com':
            return getDcMobileInfo(url);
        case 'www.ddanzi.com':
            return getDdanziInfo(url);
        case 'naver.me':
            return { type: 'shortUrl', documentId: url.pathname.slice(1) };
        default:
            return { type: 'unknown' };
    }
}

function getNaverArticleInfo(url) {
    const pathList = url.pathname.split('/');

    if (!pathList.includes('article')) {
        return null;
    }

    const pressId = +pathList.find((i) => /^\d{3}$/.test(i))
    const articleId = +pathList.find((i) => /^\d{10}$/.test(i))

    return {
        type: 'article',
        siteId: 'naver-article',
        pressId,
        articleId
    };
}

function getDcPCPostInfo(url) {
    let communityId
    let documentId
    const pathList = url.pathname.split('/');

    if (!pathList.includes('view')) {
        const len = pathList.length

        communityId = pathList[len - 1]
        documentId = pathList[len - 2]

    } else {
        communityId = 'dc_' + url.searchParams.get('id')
        documentId = url.searchParams.get('no')
    }

    return {
        type: 'community',
        siteId: 'dcincide',
        communityId,
        documentId
    }
}

function getDcMobileInfo(url) {
    const pathList = url.pathname.split('/');

    if (pathList.length < 3) {
        return null;
    }

    const communityId = 'dc_' + pathList[2]
    const documentId = pathList[3]

    return {
        type: 'community',
        siteId: 'dcincide',
        communityId,
        documentId
    }
}

function getDdanziInfo(url) {
    const communityId = 'ddanzi'
    let documentId

    if (url.pathname === '/index.php') {
        documentId = url.searchParams.get('document_srl')
    } else {
        const pathList = url.pathname.split('/')
        
        if (!isNaN(pathList[2])) documentId = pathList[2]
        else if (!isNaN(pathList[1])) documentId = pathList[1]
        else documentId = 0
    }

    return {
        type: 'community',
        siteId: 'ddanzi',
        communityId,
        documentId
    }
}

function getNaverArticleUrl(pressId, articleId) {
    function zeroPad(num, len) {
        return num.toString().padStart(len, '0');
    }

    return `https://n.news.naver.com/article/${zeroPad(pressId, 3)}/${zeroPad(articleId, 10)}`

}

export { UrlInfo, getUrlInfo, getNaverArticleUrl }

// console.log(getUrlInfo('https://gall.dcinside.com/board/view/?id=cartoon&no=683359&page=1'))

// (async () => {
//     let newUrlInfo = new UrlInfo('https://naver.me/G4xZM1Yx')

//     console.log(newUrlInfo)

//     await newUrlInfo.reloadShortUrl()

//     console.log(newUrlInfo)
// })();