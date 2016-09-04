// User Interface Logic

function displayResult(result) {
	document.getElementById('loading').style.display = 'none';
	document.getElementById('result').style.display = 'block';
	document.getElementById('result-text').innerHTML = result;
}

function displayTemperatureNow(min, max, desc) {
	document.getElementById('now').style.display = 'block';
	document.querySelectorAll('#now .temps .low-temp')[0].innerHTML = min + "&#176;";
	document.querySelectorAll('#now .temps .high-temp')[0].innerHTML = max + "&#176;";
	document.querySelectorAll('#now .description')[0].innerHTML = desc;
	document.querySelectorAll('#now img')[0].src = displayPicture(desc);
}

function displayTemperatureLater(min, max, desc) {
	document.getElementById('later').style.display = 'block';
	document.querySelectorAll('#later .temps .low-temp')[0].innerHTML = min + "&#176;";
	document.querySelectorAll('#later .temps .high-temp')[0].innerHTML = max + "&#176;";
	document.querySelectorAll('#later .description')[0].innerHTML = desc;
	document.querySelectorAll('#later img')[0].src = displayPicture(desc);
}

function displayPicture(desc) {
	const hours = new Date().getHours();
	if (desc === "Rain" || desc === "Drizzle") {
		return "../img/rain.png"
	} else if (desc === "Snow") {
		return "../img/snow.png"
	} else if (desc === "Clouds") {
		return "../img/cloud.png"
	} else if (desc === "Thunderstorm") {
		return "../img/thunder.png"
	} else if (desc === "Clear" && (17 < hours > 5)) {
		return "../img/moon.png" // only display moon between 5PM - 5AM
	} else if (desc === "Clear") {
		return "..img/sun.png"
	} else {
		return "../img/swirl.png"
	}
}

// Animations

function introAnimate() {
	document.getElementById('intro').style.display = 'flex';
	TweenMax.from(document.querySelectorAll('#intro div h1'), 1.5, {delay: .5, ease: Power1.easeIn, marginTop: '-60px', opacity: 0});
	TweenMax.from(document.querySelectorAll('#intro div h4'), 1, {delay: 2, ease: Power4.easeIn, opacity: 0});
	TweenMax.to(document.querySelectorAll('#intro div'), 1, {delay: 6, ease: Power4.easeOut, opacity: 0,	marginTop: '-40px'});
	window.setTimeout(() => {
		document.getElementById('intro').style.display = 'none';
		console.log('hide intro');
	}, 7000);
}

function headerAnimate() {
	document.getElementsByTagName('header')[0].style.display = 'block';
	TweenMax.from(document.getElementsByTagName('header'), 1, {ease: Power3.easeInOut, marginTop: '-80px'});
}

function loadingAnimate() {
	document.getElementById('loading').style.display = 'block';
	TweenMax.from(document.getElementById('loading'), 1, {ease: Power4.easeOut, opacity: 0, marginTop: '-40px'});
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
	const apiKey = "eef54fef4f484053c798c7b450ab75ab";
	const request = new XMLHttpRequest();
	request.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=' + apiKey, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			const data = JSON.parse(request.responseText);
			if (data.list[0].weather[0].main === "Rain" || data.list[1].weather[0].main === "Rain" || data.list[2].weather[0].main === "Rain" ) {
				displayResult("Yep, " + data.city.name + " weather isn't looking too good.");
				const nowMin = toFahrenheit(data.list[0].main.temp_min);
				const nowMax = toFahrenheit(data.list[0].main.temp_max);
				const nowDesc = data.list[0].weather[0].main;
				const laterMin = toFahrenheit(data.list[1].main.temp_min);
				const laterMax = toFahrenheit(data.list[1].main.temp_max);
				const laterDesc = data.list[1].weather[0].main;
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

function toFahrenheit (k) {
	return Math.round(1.8 * (k - 273.15) + 32);
}

function toCelcius (k) {
	return Math.round(k - 273.15);
}


introAnimate();
window.setTimeout(headerAnimate, 7000);
window.setTimeout(loadingAnimate, 7500);
// window.setTimeout(getLocation, 7000);