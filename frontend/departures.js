function getArrivalTimes (postcode) {
	var xhttp = new XMLHttpRequest();

	xhttp.open('GET', 'http://localhost:3000/departureBoard?postcode=' + postcode, true);

	console.log(postcode)

	xhttp.setRequestHeader('Content-Type', 'application/json');

	xhttp.onload = function() {
		let arrivalsObject = JSON.parse(xhttp.response)

		document.getElementById("results").innerHTML = `    <h2>Results</h2>
    <h3>${arrivalsObject[0].commonName}</h3>
    <table>
    <tr><th> Line </th> <th> Destination</th> <th> Time to arrival</th></tr>
    	${listItemsForArrivals(arrivalsObject[0].arrivals)}
    	</table>
    <h3>${arrivalsObject[1].commonName}</h3>
    <table>
    <tr><th> Line </th> <th> Destination</th> <th> Time to arrival</th></tr>
    	${listItemsForArrivals(arrivalsObject[1].arrivals)}
    </table>`;
	}

	xhttp.send();
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
	return totalString

}


