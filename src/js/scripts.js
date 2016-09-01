function getLocation () {
	navigator.geolocation.getCurrentPosition(success, error);
	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;
		getWeather(latitude, longitude); // get weather
	};
	function error() {
		//Couldn't find location
  	document.getElementById('loading').style.display = 'none';
		document.getElementById('result').style.display = 'block';
		document.getElementById('result-text').innerHTML = "Woah, couldn't find your location!"
	};
}

function getWeather (lat, long) {
	var apiKey = "eef54fef4f484053c798c7b450ab75ab";
	var request = new XMLHttpRequest();
	request.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=' + apiKey, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			console.log(data);
			document.getElementById('loading').style.display = 'none';
			document.getElementById('result').style.display = 'block';
			console.log(data.list[0].weather[0].main )
			if (data.list[0].weather[0].main === "Rain" || data.list[1].weather[0].main === "Rain" || data.list[2].weather[0].main === "Rain" ) {
				document.getElementById('result-text').innerHTML = "Yep, " + data.city.name + " weather isn't looking too good."
			}
		} else {
			document.getElementById('loading').style.display = 'none';
			document.getElementById('result').style.display = 'block';
			document.getElementById('result-text').innerHTML = "Whoops, couldn't check the weather."
			console.log('server error ', request.status)
		}
	};
	request.onerror = function() {
		document.getElementById('loading').style.display = 'none';
		document.getElementById('result').style.display = 'block';
		document.getElementById('result-text').innerHTML = "Whoops, couldn't check the weather."
		console.log('API connection error')
	};
	request.send();
}

getLocation();