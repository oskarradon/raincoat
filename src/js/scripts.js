// User Interface Logic

function displayResult(result) {
	document.getElementById('loading').style.display = 'none';
	document.getElementById('result').style.display = 'block';
	document.getElementById('result-text').innerHTML = result;
}

function displayTemperatureNow(min, max, desc) {
	document.getElementById('now').style.display = 'block';
	document.querySelectorAll('#now .temps .low-temp')[0].innerHTML = min;
	document.querySelectorAll('#now .temps .high-temp')[0].innerHTML = max;
	document.querySelectorAll('#now .description')[0].innerHTML = desc;
}

function displayTemperatureLater(min, max, desc) {
	document.getElementById('later').style.display = 'block';
	document.querySelectorAll('#later .temps .low-temp')[0].innerHTML = min;
	document.querySelectorAll('#later .temps .high-temp')[0].innerHTML = max;
	document.querySelectorAll('#later .description')[0].innerHTML = desc;
}

// Business Logic

function getLocation () {
	navigator.geolocation.getCurrentPosition(success, error);
	function success(position) {
		getWeather(position.coords.latitude, position.coords.longitude);
	};
	function error() {
  	displayResult("Woah, couldn't find your location!");
	};
}

function getWeather (lat, long) {
	let apiKey = "eef54fef4f484053c798c7b450ab75ab";
	let request = new XMLHttpRequest();
	request.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=' + apiKey, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			let data = JSON.parse(request.responseText);
			console.log(data);
			if (data.list[0].weather[0].main === "Rain" || data.list[1].weather[0].main === "Rain" || data.list[2].weather[0].main === "Rain" ) {
				displayResult("Yep, " + data.city.name + " weather isn't looking too good.");
				let nowMin = convertTemp(data.list[0].main.temp_min);
				let nowMax = convertTemp(data.list[0].main.temp_max);
				let nowDesc = data.list[0].weather.description;
				let laterMin = convertTemp(data.list[1].main.temp_min);
				let laterMax = convertTemp(data.list[1].main.temp_max);
				let laterDesc = data.list[1].weather.description;
				displayTemperatureNow(nowMin, nowMax , nowDesc);
				displayTemperatureLater(laterMin, laterMax, laterDesc);
			}
		} else {
			displayResult("Hmm, couldn't get any weather data.");
		}
	};
	request.onerror = function() {
		displayResult("Hmm, couldn't get any weather data.");
	};
	request.send();
}

function convertTemp (k) {
	return Math.round(1.8 * (k - 273.15) + 32);
}

getLocation();
