const http = require('http')
const request = require('request-promise-native')

module.exports = {getArrivalTimes: getArrivalTimes}

function getArrivalTimes(stopID){


	const arrivalsPromise = request.get('https://api.tfl.gov.uk/StopPoint/' + stopID + '/Arrivals')


	return arrivalsPromise.then((val) => processJSON(val));

	function processJSON(json) {
		var arrivalsData = JSON.parse(json)
		arrivalsData.sort(function(a,b) { return a.timeToStation - b.timeToStation })
		arrivalsData.length = 5
		var newArrivalsData = []
		arrivalsData.forEach(arrival => newArrivalsData.push(simplifiedArrivalObject(arrival)))
		return newArrivalsData
	}

	function simplifiedArrivalObject(arrival) {
		return {
			lineName: arrival.lineName,
			destination: arrival.destinationName,
			timeToArrival: arrival.timeToStation
		}
	}
}