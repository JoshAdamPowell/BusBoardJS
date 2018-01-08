const http = require('http')
const request = require('request-promise-native')
const arrivalTimes = require ('./ArrivalTimes')
const postcodeLookup = require ('./PostcodeLookup')
const busStopFinder = require ('./BusStopFinder')
const express = require('express')


// Start the server
const app = express()

// Listen for connections on /departureBoard
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
		const arrivalTimesPromise = arrivalTimes.getArrivalTimes(busStop).then(arrivalTimes => {
			return {
				id: busStop,
				arrivals: arrivalTimes
			}
		})
		arrivalTimesPromises.push(arrivalTimesPromise)
	}
	const combinedArrivalsPromise = Promise.all(arrivalTimesPromises)
	return combinedArrivalsPromise.then((results) => {
		const stringFromResults = JSON.stringify(results)
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
