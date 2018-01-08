function getArrivalTimes (postcode) {
	var xhttp = new XMLHttpRequest();

	xhttp.open('GET', 'http://localhost:3000/departureBoard?postcode=' + postcode, true);

	xhttp.setRequestHeader('Content-Type', 'application/json');

	xhttp.onload = function() {
		let arrivalsObject = JSON.parse(xhttp.response)

		if (arrivalsObject.length !== 0) {
			document.getElementById("results").innerHTML = `    <h2>Results</h2>
    
    <h3>${readableStopName(arrivalsObject[0].stopData)}</h3>
    <table>
    <tr><th> Line </th> <th> Destination</th> <th> Time to arrival</th></tr>
    	${listItemsForArrivals(arrivalsObject[0].arrivals)}
    	</table>
    <h3>${readableStopName(arrivalsObject[1].stopData)}</h3>
    <table>
    <tr><th> Line </th> <th> Destination</th> <th> Time to arrival</th></tr>
    	${listItemsForArrivals(arrivalsObject[1].arrivals)}
    </table>`;
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
	totalString = ""
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
	console.log(totalString)
	return totalString

}


