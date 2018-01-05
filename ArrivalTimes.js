const http = require('http')
const request = require('request-promise-native')

module.exports = {getArrivalTimes: getArrivalTimes}

function getArrivalTimes(stopID){


	const promise = request.get('https://api.tfl.gov.uk/StopPoint/' + stopID + '/Arrivals')


	const promiseOfTimeToTwoDP = promise.then((val) => processJSON(val));

	function processJSON(json) {
		var objects = JSON.parse(json)
		objects.sort(function(a,b) { return a.timeToStation - b.timeToStation })
		objects.length = 5
		objects.forEach(arrival => console.log(stringForArrival(arrival)))
	}

	function stringForArrival(arrival) {
		const str =
			`${arrival.lineName}	${arrival.destinationName}	${Math.floor(arrival.timeToStation/60)}m ${arrival.timeToStation % 60}s`
		return str
	}
}