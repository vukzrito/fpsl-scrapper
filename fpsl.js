const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');

async function getTeamPlayers() {
    const teams = require('./teams.json');
    let team = teams[0];
    // teams.forEach(async team => {
    let response = await got(`https://www.transfermarkt.co.za/quickselect/players/${team.id}`);
    let players = JSON.parse(response.body);
    for (const player of players) {
        await getPlayerInfo(team, player);
        // sleep(120);
    }
    //  })
}
getTeamPlayers();
const getPlayerInfo = async (team, profile) => {
    try {

        const puppeteer = require('puppeteer-core');

        const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', headless: false });
        const page = await browser.newPage();
        console.log(`https://www.transfermarkt.co.za${profile.link}`)
        await page.goto(`https://www.transfermarkt.co.za${profile.link}`, { timeout: 0 });
        //await page.screenshot({ path: 'example.png' });
        await page.waitFor(10000);
        let bodyHTML = await page.evaluate(() => document.body.innerHTML, { timeout: 0 });
        browser.close();
        let $ = cheerio.load(bodyHTML);
        let player = {
            id: profile.id,
            teamId: team.id,
            temName: team.name,
            name: $('#main > div:nth-child(10) > div > div > div.dataMain > div > div.dataName > h1').text(),
            positionId: profile.positionId,
            position: $('#main > div:nth-child(15) > div.large-8.columns > div:nth-child(2) > div.row.collapse > div.large-6.large-pull-6.small-12.columns.spielerdatenundfakten > div.spielerdaten > table > tbody > tr:nth-child(7) > td').text().trim(),
            goals: formatNumber($('#main > div:nth-child(15) > div.large-8.columns > div.box.spielerDatenContainer.viewport-tracking > div.spielerDatenSlider.swiper-container > div > div > div.leistungsdatenContent.swiper-container.swiper-container-fade.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > div.tabelle > div:nth-child(3) > a > span').text().trim()),
            assists: formatNumber($('#main > div:nth-child(15) > div.large-8.columns > div.box.spielerDatenContainer.viewport-tracking > div.spielerDatenSlider.swiper-container > div > div > div.leistungsdatenContent.swiper-container.swiper-container-fade.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > div.tabelle > div:nth-child(5) > a > span').text().trim()),
            yellowCards: formatNumber($('#main > div:nth-child(15) > div.large-8.columns > div.box.spielerDatenContainer.viewport-tracking > div.spielerDatenSlider.swiper-container > div > div > div.leistungsdatenContent.swiper-container.swiper-container-fade.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > div.tabelle > div:nth-child(2) > a').text().trim()),
            appearances: formatNumber($('#main > div:nth-child(15) > div.large-8.columns > div.box.spielerDatenContainer.viewport-tracking > div.spielerDatenSlider.swiper-container.swiper-container-fade.swiper-container-horizontal > div > div.swiper-slide.swiper-slide-active > div.leistungsdatenContent.swiper-container.swiper-container-fade.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > div.tabelle > div:nth-child(1) > a > span').text().trim()),
            redCards: formatNumber($('').text().trim()),

        }

        console.log(player)


        //  $('#main > div:nth-child(15) > div.large-8.columns > div.box.spielerDatenContainer.viewport-tracking > div.spielerDatenSlider.swiper-container > div > div > div.leistungsdatenContent.swiper-container.swiper-container-fade.swiper-container-horizontal > div.swiper-wrapper > div.swiper-slide.swiper-slide-active > div.tabelle')[0].children.forEach((row) => {
        //      console.log(row);
        // //     let totalAmount = Number.parseFloat($(row.children[2].children[0]).text().replace('R', '').split(',').join(''));
        // //     let totalMass = Number.parseFloat($(row.children[4].children[0]).text().split(',').join(''));
        // //     let totalMassSold = Number.parseFloat($(row.children[6].children[0]).text().split(',').join(''));
        // //     let availableQuantity = Number.parseFloat($(row.children[8].children[0]).text().split(',').join(''));

        // //     products.push({
        // //         name: $(row.children[0].children[0]).text(),
        // //         totalMass, totalAmount,
        // //         averagePricePerKg: totalAmount / totalMassSold,
        // //         availableQuantity,
        // //         date
        // //     })

        // //     // })
        //  });
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
};
function formatNumber(value) {
    return value == '-' || value == '' ? 0 : Number.parseInt(value);
}
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}