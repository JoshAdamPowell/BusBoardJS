const http = require('http')
const request = require('request-promise-native')
module.exports = {busStopsByLocation:busStopsByLocation}

function busStopsByLocation(lat, long){
	const busStopPromise = request.get(	"https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanMetroStation%2CNaptanRailStation%2C%20NaptanBusCoachStation%2CNaptanFerryPort%2CNaptanPublicBusCoachTram&radius=500&lat=" + lat + "&lon=" + long + "&modes=bus")

	return busStopPromise.then(val => processJson(val))
}

function processJson(inputString){
	let busArray = []
	const busStopData = JSON.parse(inputString)
	var stopPointData = busStopData.stopPoints
	stopPointData.sort(function(a,b) { return a.distance - b.distance })
	stopPointData = stopPointData.filter(stop => stop.lines.length != 0) // because some bus stops don't exist
	stopPointData.length = 2
	stopPointData.forEach(stop => busArray.push({
		id : stop.id,
		commonName : stop.commonName,
		stopLetter: stop.stopLetter,
	}))
	return busArray
}