const postcodeLookup = require ('./PostcodeLookup')
const request = require('request-promise-native')
module.exports = {weatherBoard : weatherBoard}


function weatherBoard(req, result){
	const postcode = req.query.postcode
	const postcodePromise = postcodeLookup.locationOfPostcode(postcode)
	const iconPromise = postcodePromise.then(val => weatherByLocation(...val))
	iconPromise.then(val => result.send(val)).catch(err => {
		if (err.statusCode === 404) {
			const errorString = JSON.parse(err.error).error
			if (errorString == "Invalid postcode" || errorString == "Postcode not found") {
				result.status(400).send(JSON.stringify({
					errno: 1,
					message: "Invalid postcode"
				}))
			}
		}
	})
}




function weatherByLocation(lat, long){

	const weatherPromise = request.get('http://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + long + '&appid=37888eaa1abb65c2bf3243d85aa09ec4')

	return weatherPromise.then(val => processJSON(val))
}

function processJSON(inputString){
	let inputObject = JSON.parse(inputString)
	return inputObject.weather[0].icon

}

