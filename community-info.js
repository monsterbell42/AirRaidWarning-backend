const communityInfo = {
    test: {
        name: '테스트 갤러리',
        getUrl: (document_id) => `https://gall.dcinside.com/mini/board/view/?id=test&no=${document_id}`
    },
    jamgall: {
        name: '이재명 갤러리',
        getUrl: (document_id) => `https://gall.dcinside.com/mgallery/board/view/?id=leejaemyung&no=${document_id}`
    },
    jammangall: {
        name: '인간 이재명 갤러리',
        getUrl: (document_id) => `https://gall.dcinside.com/mgallery/board/view/?id=ljm&no=${document_id}`
    },
    jamdogall: {
        name: '이재명은 합니다 갤러리',
        getUrl: (document_id) => `https://gall.dcinside.com/mgallery/board/view/?id=leejaemyungdo&no=${document_id}`
    },
    jamdogall: {
        name: '이재명의 민주당 갤러리',
        getUrl: (document_id) => `https://gall.dcinside.com/mgallery/board/view/?id=zamminjoo&no=${document_id}`
    },
    pppgall: {
        name: '국민의힘 갤러리',
        getUrl: (document_id) => `https://gall.dcinside.com/mgallery/board/view/?id=alliescon&no=${document_id}`
    },
    ddanzi: {
        name: '딴지일보',
        getUrl: (document_id) => `https://www.ddanzi.com/free/${document_id}`
    }

};

export { communityInfo }