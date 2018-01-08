const http = require('http')
const request = require('request-promise-native')
const arrivalTimes = require ('./ArrivalTimes')
const postcodeLookup = require ('./PostcodeLookup')
const busStopFinder = require ('./BusStopFinder')
const express = require('express')


// Start the server
const app = express()

// Listen for connections on /departureBoard
app.use(express.static('frontend'));
app.get('/departureBoard', departureBoard)

app.listen(3000)

function departureBoard(request, result) {
	const postcode = request.query.postcode
	const busStopsPromise = busStopsByPostcode(postcode)
	const outputPromise = busStopsPromise.then(arrivalsDataFromBusStops)
	outputPromise.then((output) => {
		result.send(output)
	})
}

function arrivalsDataFromBusStops(busStops) {
	var arrivalTimesPromises = [];
	for (const busStop of busStops) {
		busStopId = busStop.id
		busStopName = busStop.commonName
		const arrivalTimesPromise = arrivalTimes.getArrivalTimes(busStopId).then(arrivalTimes => {
			return {
				id: busStopId,
				commonName: busStopName,
				arrivals: arrivalTimes
			}
		})
		arrivalTimesPromises.push(arrivalTimesPromise)
	}
	const combinedArrivalsPromise = Promise.all(arrivalTimesPromises)
	return combinedArrivalsPromise.then((results) => {
		console.log(results)

		const stringFromResults = JSON.stringify(results)
		console.log(stringFromResults)
		return stringFromResults
	})
}

function busStopsByPostcode(postcode) {
	const locationPromise = postcodeLookup.locationOfPostcode(postcode)
	return locationPromise.then(latlong => busStopFinder.busStopsByLocation(...latlong))
}

// postcodeLookup.locationOfPostcode("NW5 1TL").then(val => busStopFinder.busStopsByLocation(...val).then(val => console.log(val)))
//
// arrivalTimes.getArrivalTimes("490008660N")
