fetch("https://api-football-v1.p.rapidapi.com/v2/leagues/country/ZA/2021", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "gHFw81hQKEmshLqxzkkdydjvQhQpp1cjPN0jsnI216UfisnN5o",
		"x-rapidapi-host": "api-football-v1.p.rapidapi.com"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});

const got = require('got');
const response = await got('http://www.joburgmarket.co.za/dailyprices.php?all=View+All+Commodities');
