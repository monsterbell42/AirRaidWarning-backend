// 국민의 힘 : 좌표, 댓방, 500 
// 인간 이재명 : ㅂㅊ, ㄸㅈ, 10
// 이재명 : 댓관, 비추, ㅊㅊ, 
// 이재명은 합니다 : 140, 댓관, ㅂㅊ, ㅊㅊ,
// 이재명의 민주당 : 60, ㄸㅈ,
// 국민의힘 비대위 : 10, 댓방

const commonWords = ['좌표', 'user_comment', '댓방', '댓관', 'ㅂㅊ', '비추', 'ㅊㅊ', '베댓', '역따']
    .map(word => {
        return { 'searchKeyword': word }
    })
const leftWords = ['ㄸㅈ', '딴지',]
    .map(word => {
        return { 'searchKeyword': word }
    })

const DEFAULT_INTERVAL_SHORT = 900
const DEFAULT_INTERVAL = 1800
const DEFAULT_INTERVAL_LONG = 21600

const scrapSchedule = {
    // 'dc_test' : {
    //     scrapOptions: [{
    //         searchKeyword:1,
    //         tabId:2
    //     }],
    //     intervalSecond: 10
    // },
    'dc_drama_new3': {
        scrapOptions: [
            { 'searchKeyword': '한동훈줌' },
            { 'searchKeyword': 'user_comment' }
        ],
        intervalSecond: DEFAULT_INTERVAL_SHORT
    },
    'dc_leejaemyung': {
        scrapOptions: [
            ...commonWords,
            ...leftWords,
            { 'searchKeyword': '●' }
        ],
        intervalSecond: DEFAULT_INTERVAL
    },
    'dc_alliescon': {
        scrapOptions: [
            { tabId: 500 },
            ...commonWords
        ],
        intervalSecond: DEFAULT_INTERVAL
    },
    'dc_leejaemyungdo': {
        scrapOptions: [
            { tabId: 140 },
            ...commonWords,
            ...leftWords,
        ],
        intervalSecond: DEFAULT_INTERVAL
    },
    'dc_rightpolitics': {
        scrapOptions: [
            { tabId: 10 },
            ...commonWords
        ],
        intervalSecond: DEFAULT_INTERVAL
    },
    'dc_zamminjoo': {
        scrapOptions: [
            { tabId: 60 },
            ...commonWords,
            ...leftWords,
        ],
        intervalSecond: DEFAULT_INTERVAL_LONG
    },
    'dc_ljm': {
        scrapOptions: [
            { tabId: 10 },
            ...commonWords,
            ...leftWords,
        ],
        intervalSecond: DEFAULT_INTERVAL_LONG
    },
}

export { scrapSchedule }