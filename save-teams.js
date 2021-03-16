const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
    const teams = require('./teams.json');
    teams.forEach(async team => {
        const { body } = await got.post('https://fpsl.azurewebsites.net/api/teams', {
            json: team,
            responseType: 'json'
        });
        console.log(body.data);
    })
}
)()