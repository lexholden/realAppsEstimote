var Estimote = require('bleacon').Estimote;

var beacons = []

Estimote.discover(function(estimote) {
	// console.log(estimote);
});

Estimote.discoverAll(function(estimote) {
	console.log('Connected to: ' + estimote.uuid);
	var exists = beacons.filter(function(b) { return b.id == estimote.id; })
	if (exists.length) {
		console.log('The beacon ' + estimote.id + ' has already been registered.')
	} else {
		estimote.connectAndSetUp(function(error) {
			console.log(error);
			estimote.on('disconnect', function() {'We disconnected!'});
			// estimote.unsubscribeMotion(callback(error));
			estimote.on('motionStateChange', function(isMoving) {
				console.log('EARTHQUAKE!!!!')
				console.log(isMoving)
			});
			estimote.pair(function(error) {
				if (error) {
					console.log(error);
				}
				beacons.push(estimote);
			});

		});
	}

})

function logTemperature() {
	console.log("we have " + beacons.length + " beacons connected");
	beacons.forEach(function(b) {
		b.readTemperature(function(err, temp) {
		// b.readBatteryLevel(function(err, temp) {
			if (err) {
				console.log(err);
			}
			console.log('Temp is ' + temp);
		})

		b.readDeviceName(function(error, deviceName) {
			if (error) {console.log("Cannot read device name " + error); console.log(b);}
			else { console.log(deviceName);}
		});
		b.subscribeMotion(function(error) {
			console.log('Could not subscribe to motion ' + error);
		});

		// estimote.subscribeMotion(callback(error));


	});
	console.log('That\'s all folks!');
	setTimeout(logTemperature, 10000)
}

setTimeout(logTemperature, 10000)

// estimote.readTemperature(callback(error, temperature));



// require('./node_modules/bleacon/Estimote/test');