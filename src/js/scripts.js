function getLocation () {
	navigator.geolocation.getCurrentPosition(success, error);
	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;
		console.log(latitude, longitude);
		getWeather(latitude, longitude);
	};
	function error() {
		//Couldn't find location
		console.log('GPS error')
	};
}

function getWeather (lat, long) {
	var apiKey = "eef54fef4f484053c798c7b450ab75ab";
	var request = new XMLHttpRequest();
	request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + apiKey, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			console.log(data);
		} else {
			// Couldnt get the weather
			console.log('server error ', request.status)
		}
	};
	request.onerror = function() {
		// Couldnt get the weather
		console.log('API connection error')
	};
	request.send();
}

getLocation();