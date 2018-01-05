const http = require('http')
const request = require('request-promise-native')
const arrivalTimes = require ('./ArrivalTimes')
const postcodeLookup = require ('./PostcodeLookup')
const busStopFinder = require ('./BusStopFinder')

postcodeLookup.locationOfPostcode("NW5 1TL").then(val => busStopFinder.busStopsByLocation(...val).then(val => console.log(val)))

arrivalTimes.getArrivalTimes("490008660N")