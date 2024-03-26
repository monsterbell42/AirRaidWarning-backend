import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

import { scrapArticleLinks } from './scraping/post-scrap.js'
import { scrapDcGall } from './scraping/scrap-controll.js'

async function manualPostScrap() {
    while (1) {
        const rl = readline.createInterface({ input, output })
        const answer = await rl.question('url 입력(끝내고 싶으면 e 입력) : ')
        rl.close();

        if (answer === 'e') break

        await scrapArticleLinks(answer)
    }

    return
}

manualPostScrap()

// scrapDcGall('dc_ljm', [
//         { searchKeyword: '●' }
//     ], new Date('1900-01-01'))