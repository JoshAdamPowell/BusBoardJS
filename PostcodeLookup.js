const http = require('http')
const request = require('request-promise-native')

module.exports = {locationOfPostcode: locationOfPostcode}

function locationOfPostcode(postcode){
	const postcodeDataPromise = request.get("http://api.postcodes.io/postcodes/"+ postcode)

	return postcodeDataPromise.then(val => processJson(val))
}

function processJson(stringInput){
	let postcodeData = JSON.parse(stringInput)
	if (postcodeData.status === 200) {
		let long = postcodeData.result.longitude
		let lat = postcodeData.result.latitude
		return [lat, long]
	}
	else {
		throw postcodeData
	}

}