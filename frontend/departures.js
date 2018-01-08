function getArrivalTimes (postcode) {

	document.getElementById('results').innerHTML=`<p>Loading</p>`

	var xhttp = new XMLHttpRequest();

	xhttp.open('GET', 'http://localhost:3000/departureBoard?postcode=' + postcode, true);

	xhttp.timeout = 5000

	xhttp.setRequestHeader('Content-Type', 'application/json');

	xhttp.ontimeout = function () {
		document.getElementById("results").innerHTML = `<p>Our server seems to be having a bother. Maybe try again?</p>`
	}

	xhttp.onload = function() {
		let arrivalsObject = JSON.parse(xhttp.response)
		if (xhttp.status != 200) {
			if (arrivalsObject.errno == 1) {
				document.getElementById("results").innerHTML = `<p>That's not a postcode.</p>`
			} else {
				document.getElementById("results").innerHTML = `<p>An unknown error occurred. Sorry.</p>`
				console.log(arrivalsObject)
			}
			return
		}

		if (arrivalsObject.length !== 0) {
			document.getElementById("results").innerHTML = `    <h2>Bus stops near ${postcode}</h2>
    
    <h3>${readableStopName(arrivalsObject[0].stopData)}</h3>
    	${listItemsForArrivals(arrivalsObject[0].arrivals)}
    <h3>${readableStopName(arrivalsObject[1].stopData)}</h3>
    	${listItemsForArrivals(arrivalsObject[1].arrivals)}`;
		}
		else {
			document.getElementById("results").innerHTML = ` <p>There were no bus stops found within 500m of ${postcode} </p>`
		}
	}

	xhttp.send();
}

function readableStopName(stopData) {
	const stopName = stopData.commonName;
	const stopLetter = stopData.stopLetter;
	switch (stopLetter) {
		case "->W":
			return stopName + ' W (Westbound)'
		case "->E":
			return stopName + ' E (Eastbound)'
		case "->N":
			return stopName + ' N (Northbound)'
		case "->S":
			return stopName + ' S (Southbound)'
		case undefined:
			return stopName
		default:
			return stopName + ' ' + stopLetter
	}
}

function listItemsForArrivals(arrivals){
	if (arrivals.length == 0) {
		return `<p>There are no arrivals at this bus stop within the next 30 minutes.</p>`
	}

	var totalString = `<table>
 	   <tr><th> Line </th> <th> Destination</th> <th> Time to arrival</th></tr>`
	for(var arrival of arrivals){
		var arrivalTime = Math.round(arrival.timeToArrival / 60)
		if (arrivalTime === 0){
			arrivalTime = "due"
		}
		else if (arrivalTime > 1){
			arrivalTime = arrivalTime + " minutes"
		}
		else {
			arrivalTime = arrivalTime + " minute"
		}
		newString = `<tr> <td>${arrival.lineName}</td> 	<td>${arrival.destination}</td>		<td>${arrivalTime}</td> </tr>`
		totalString += newString
	}
	totalString += `</table>`
	return totalString

}


