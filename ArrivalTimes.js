const http = require('http')
const request = require('request-promise-native')

module.exports = {getArrivalTimes: getArrivalTimes}

function getArrivalTimes(stopID){


	const arrivalsPromise = request.get('https://api.tfl.gov.uk/StopPoint/' + stopID + '/Arrivals')


	arrivalsPromise.then((val) => processJSON(val));

	function processJSON(json) {
		var arrivalsData = JSON.parse(json)
		arrivalsData.sort(function(a,b) { return a.timeToStation - b.timeToStation })
		arrivalsData.length = 5
		arrivalsData.forEach(arrival => console.log(stringForArrival(arrival)))
	}

	function stringForArrival(arrival) {
		const str =
			`${arrival.lineName}	${arrival.destinationName}	${Math.floor(arrival.timeToStation/60)}m ${arrival.timeToStation % 60}s`
		return str
	}
}