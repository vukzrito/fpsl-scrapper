const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');

(async () => {
    try {
        const response = await got('http://www.joburgmarket.co.za/dailyprices.php?all=View+All+Commodities');

        let $ = cheerio.load(response.body);
        let products = [];
        let date = new Date();
        $('tbody')[0].children.forEach((row) => {
            let totalAmount = Number.parseFloat($(row.children[2].children[0]).text().replace('R', '').split(',').join(''));
            let totalMass = Number.parseFloat($(row.children[4].children[0]).text().split(',').join(''));
            let totalMassSold = Number.parseFloat($(row.children[6].children[0]).text().split(',').join(''));
            let availableQuantity = Number.parseFloat($(row.children[8].children[0]).text().split(',').join(''));

            products.push({
                name: $(row.children[0].children[0]).text(),
                totalMass, totalAmount,
                averagePricePerKg: totalAmount / totalMassSold,
                availableQuantity,
                date
            })

            // })
        });
        console.log(products)
        let filename = moment().format('YYYY-MM-DD')
        fs.writeFileSync(`data/${filename}.json`, JSON.stringify(products, ' ', 4));
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();