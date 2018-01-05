const http = require('http')
const request = require('request-promise-native')
const arrivalTimes = require ('./ArrivalTimes')

arrivalTimes.getArrivalTimes("490008660N")