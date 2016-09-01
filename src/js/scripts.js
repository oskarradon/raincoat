var apiKey = "eef54fef4f484053c798c7b450ab75ab";

document.addEventListener("DOMContentLoaded", function(event) { 
	getLocation();
});

function getLocation () {
	// get lat and long coordinates from browser
	navigator.geolocation.getCurrentPosition(success, error);

	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;
		console.log(latitude, longitude);
		callAPI(latitude, longitude);
	};

	function error() {
		console.log('GPS error')
	};
}

// function callAPI (lat, long) {
// 	var request = new XMLHttpRequest();
// 	request.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + apiKey, true);

// 	request.onload = function() {
// 		if (request.status >= 200 && request.status < 400) {
// 			var data = JSON.parse(request.responseText);
// 			console.log(data);
// 			document.getElementById('location').textContent = data.name;
// 		} else {
// 			console.log('server error ', request.status)
// 		}
// 	};

// 	request.onerror = function() {
// 		console.log('API connection error')
// 	};

// 	request.send();
// }

function callAPI(lat, long) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(JSON.parse(this.responseText));
    };
    xhr.onerror = reject;
    xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=' + apiKey);
    xhr.send();
  });
}

callAPI().then(function(result) {
  console.log(result);
}).catch(function() {
  // An error occurred
});