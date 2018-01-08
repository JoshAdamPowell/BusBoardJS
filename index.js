const http = require('http')
const request = require('request-promise-native')
const arrivalTimes = require ('./ArrivalTimes')
const postcodeLookup = require ('./PostcodeLookup')
const busStopFinder = require ('./BusStopFinder')
const express = require('express')
const weather = require('./weather')


const errors = {
	BadPostcodeError: 1
}

// Start the server
const app = express()

// Listen for connections on /departureBoard
app.use(express.static('frontend'));
app.get('/departureBoard', departureBoard)
app.get('/weatherBoard', weather.weatherBoard)

app.listen(3000)

function departureBoard(request, result) {
	const postcode = request.query.postcode
	const busStopsPromise = busStopsByPostcode(postcode)
	const outputPromise = busStopsPromise.then(arrivalsDataFromBusStops)
	outputPromise.then((output) => {
		result.send(output)
	}).catch(err => {
		if (err.statusCode === 404) {
			const errorString = JSON.parse(err.error).error
			if (errorString == "Invalid postcode" || errorString == "Postcode not found") {
				result.status(400).send(JSON.stringify({
					errno: errors.BadPostcodeError,
					message: "Invalid postcode"
				}))
			}
		}
	})
}

function arrivalsDataFromBusStops(busStops) {
	var arrivalTimesPromises = [];
	for (const busStop of busStops) {
		const busStopId = busStop.id
		const busStopName = busStop.commonName
		const arrivalTimesPromise = arrivalTimes.getArrivalTimes(busStopId).then(arrivalTimes => {
			return {
				stopData: busStop,
				arrivals: arrivalTimes,
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