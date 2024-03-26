const DC_BASE_MAIN_LIST_URL = 'https://gall.dcinside.com/board/lists/'
const DC_BASE_MINOR_LIST_URL = 'https://gall.dcinside.com/mgallery/board/lists/'
const DC_BASE_MINI_LIST_URL = 'https://gall.dcinside.com/mini/board/lists/'

const DC_BASE_MAIN_VIEW_URL = 'https://gall.dcinside.com/board/view/'
const DC_BASE_MINOR_VIEW_URL = 'https://gall.dcinside.com/mgallery/board/view/'
const DC_BASE_MINI_VIEW_URL = 'https://gall.dcinside.com/mini/board/view/'

const communityInfo = {
    dc_scipol: {
        name: '테스트 갤러리',
        listUrl: `${DC_BASE_MINI_LIST_URL}?id=scipol`,
        getUrl: (document_id) => `${DC_BASE_MINI_VIEW_URL}?id=scipol&no=${document_id}`
    },
    dc_leejaemyung: {
        name: '이재명 갤러리',
        listUrl: `${DC_BASE_MINOR_LIST_URL}?id=leejaemyung`,
        getUrl: (document_id) => `${DC_BASE_MINOR_VIEW_URL}?id=leejaemyung&no=${document_id}`
    },
    dc_ljm: {
        name: '인간 이재명 갤러리',
        listUrl: `${DC_BASE_MINOR_LIST_URL}?id=ljm`,
        getUrl: (document_id) => `${DC_BASE_MINOR_VIEW_URL}?id=ljm&no=${document_id}`
    },
    dc_leejaemyungdo: {
        name: '이재명은 합니다 갤러리',
        listUrl: `${DC_BASE_MINOR_LIST_URL}?id=leejaemyungdo`,
        getUrl: (document_id) => `${DC_BASE_MINOR_VIEW_URL}?id=leejaemyungdo&no=${document_id}`
    },
    dc_zamminjoo: {
        name: '이재명의 민주당 갤러리',
        listUrl: `${DC_BASE_MINOR_LIST_URL}?id=zamminjoo`,
        getUrl: (document_id) => `${DC_BASE_MINOR_VIEW_URL}?id=zamminjoo&no=${document_id}`
    },
    dc_rightpolitics: {
        name: '국민의힘 비대위 갤러리',
        listUrl: `${DC_BASE_MINOR_LIST_URL}?id=rightpolitics`,
        getUrl: (document_id) => `${DC_BASE_MINOR_VIEW_URL}?id=rightpolitics&no=${document_id}`
    },
    dc_alliescon: {
        name: '국민의힘 갤러리',
        listUrl: `${DC_BASE_MINOR_LIST_URL}?id=alliescon`,
        getUrl: (document_id) => `${DC_BASE_MINOR_VIEW_URL}?id=alliescon&no=${document_id}`
    },
    dc_drama_new3: {
        name: '기타 국내 드라마 갤러리',
        listUrl: `${DC_BASE_MAIN_LIST_URL}?id=drama_new3`,
        getUrl: (document_id)=> `${DC_BASE_MAIN_VIEW_URL}?id=drama_new3&no=${document_id}`
    },
    ddanzi: {
        name: '딴지일보',
        getUrl: (document_id) => `https://www.ddanzi.com/free/${document_id}`
    },
};

export { communityInfo }