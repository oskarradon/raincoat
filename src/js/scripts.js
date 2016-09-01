var apiKey = "eef54fef4f484053c798c7b450ab75ab";

document.addEventListener("DOMContentLoaded", function(event) {

	getLocation().then((position) => {
		console.log(position);
		return position;
	}).then((position) => {
		var lat  = position.coords.latitude;
		var long = position.coords.longitude;
		getWeather(lat, long).then((response) => {
			console.log(response);
		});	
	});
});

function getLocation () {
	return new Promise(function(resolve, reject) {
		navigator.geolocation.getCurrentPosition(success, error);
		function success(position) {
			resolve(position);
		}
		function error() {
			reject();
		}
	});
}

function getWeather(lat, long) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			resolve(JSON.parse(this.responseText));
		};
		xhr.onerror = reject;
		xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + apiKey);
		xhr.send();
	});
}