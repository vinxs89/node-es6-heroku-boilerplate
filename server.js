const req = require('request');

const getData = (endpoint) => {
	return new Promise((resolve, reject) => {
		const options = {
			url: endpoint,
			headers: {
				'x-api-key': 'caminomasca',
				'Accept': 'application/json'
			}
		}
		req.get(options, (err, res) => {
			console.debug('Received: ' + JSON.stringify(res));
			resolve(res);
		});
	});
};

const notify = (data) => {
	const options = {
		url: '',
		body: data
	}
	req.post(options, (err, res) => {
		console.log('Notified: ' + JSON.stringify(data));
	});
};

const start = async (endpoints) => {
	const availableSeats = [];

	const promises = endpoints.map(endpoint => getData(endpoint));
	const responses = await Promise.all(promises);
	
	responses.forEach(response => {
		if (!response.availability) {
			console.warn("No availability array");
			return;
		}
		
		response.availability.forEach(availability => {
			if(!availability.sessions) {
				console.warn("No sessions array");
				return;
			}
			
			availability.sessions.forEach(session => {
				console.debug("Checking session for date " + availability.date + ": " + JSON.stringify(session));
				
				if(session.available && session.available > 0) {
					availableSeats.push({
						date: availability.date,
						session
					});
				}
			});
		});
	});
	
	if (availableSeats.length > 0 ) {
		console.log('There are available seats :)');
		availableSeats.forEach(console.log);
		//notify({ seats: availableSeats});
	} else {
		console.log('No seats available :(');
	}
};

const endpoints = [
	'https://api.volcanoteide.com/products/1927/availability/2021-05'
];

try {
	start(endpoints);
} catch (e) {
	console.error(e);
}
