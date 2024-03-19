// 국민의 힘 : 좌표, 댓방, 500 
// 인간 이재명 : ㅂㅊ, ㄸㅈ, 10
// 이재명 : 댓관, 비추, ㅊㅊ, 
// 이재명은 합니다 : 140, 댓관, ㅂㅊ, ㅊㅊ,
// 이재명의 민주당 : 60, ㄸㅈ,
// 국민의힘 비대위 : 10, 댓방

const commonWords = ['좌표', '댓방', '댓관', 'ㅂㅊ', '비추', 'ㄸㅈ', '딴지', 'ㅊㅊ', '베댓', '역따']
    .map(word => {
        return { 'searchKeyword': word }
    })

const DEFAULT_INTERVAL_SHORT = 600
const DEFAULT_INTERVAL = 600
const DEFAULT_INTERVAL_LONG = 21600

const scrapSchedule = {
    // 'dc_test' : {
    //     scrapOptions: [{
    //         searchKeyword:1,
    //         tabId:2
    //     }],
    //     intervalSecond: 10
    // },
    // 'dc_ljm': {
    //     scrapOptions: [
    //         { tabId: 10 },
    //         ...commonWords
    //     ],
    //     intervalSecond: DEFAULT_INTERVAL
    // },
    // 'dc_alliescon': {
    //     scrapOptions: [
    //         { tabId: 500 },
    //         ...commonWords
    //     ],
    //     intervalSecond: DEFAULT_INTERVAL
    // },
    // 'dc_leejaemyung': {
    //     scrapOptions: [
    //         ...commonWords
    //     ],
    //     intervalSecond: DEFAULT_INTERVAL
    // },
    'dc_leejaemyungdo': {
        scrapOptions: [
            { tabId: 140 },
            ...commonWords
        ],
        intervalSecond: DEFAULT_INTERVAL
    },
    // 'dc_zamminjoo': {
    //     scrapOptions: [
    //         { tabId: 60 },
    //         ...commonWords
    //     ],
    //     intervalSecond: DEFAULT_INTERVAL * 6
    // },
    // 'dc_rightpolitics': {
    //     scrapOptions: [
    //         { tabId: 10 },
    //         ...commonWords
    //     ],
    //     intervalSecond: DEFAULT_INTERVAL
    // },
}

export { scrapSchedule }