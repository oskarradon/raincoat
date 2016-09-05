
// Initialize animations
introAnimate();
window.setTimeout(headerAnimate, 7000);
window.setTimeout(loadingShow, 7500);
document.getElementById('about').addEventListener("click", aboutAnimate); 
document.getElementById('logo').addEventListener("click", () => {location.reload()}); 
window.setTimeout(getLocation, 7000);

// Temperature conversions
function toFahrenheit (k) {
	return Math.round(1.8 * (k - 273.15) + 32);
}

function toCelcius (k) {
	return Math.round(k - 273.15);
}


// User Interface Logic
function introAnimate() {
	document.getElementById('intro').style.display = 'flex';
	TweenMax.from(document.querySelectorAll('#intro div h1'), 1.5, {delay: .5, ease: Power1.easeIn, marginTop: '-60px', opacity: 0});
	TweenMax.from(document.querySelectorAll('#intro div h4'), 1, {delay: 2, ease: Power4.easeIn, opacity: 0});
	TweenMax.to(document.querySelectorAll('#intro div'), 1, {delay: 6, ease: Power4.easeOut, opacity: 0,	marginTop: '-40px'});
	window.setTimeout(() => {
		document.getElementById('intro').style.display = 'none';
	}, 7000);
}

function headerAnimate() {
	document.getElementsByTagName('header')[0].style.display = 'block';
	TweenMax.from(document.getElementsByTagName('header'), 1, {ease: Power3.easeInOut, marginTop: '-80px'});
}

function loadingShow() {
	document.getElementById('loading').style.display = 'block';
	TweenMax.from(document.getElementById('loading'), 1, {ease: Power4.easeOut, opacity: 0, marginTop: '-40px'});
}

function loadingHide() {
	TweenMax.to(document.getElementById('loading'), 1, {ease: Power4.easeOut, opacity: 0,	marginTop: '-40px'});
	window.setTimeout(() => {
		document.getElementById('loading').style.display = 'none';
	}, 2000);
}

function aboutAnimate() {
	if (document.getElementById('about').classList[0] != 'active') {
		document.getElementById('about').classList.add('active');
		document.getElementById('credit').style.display = 'block';
		TweenMax.to(document.getElementById('bg'), 1, {ease: Power4.easeOut, top: '0px'});
		TweenMax.to(document.getElementById('credit'), 2, {ease: Power4.easeOut, opacity: 1, top: '80px'});
	} else {
		document.getElementById('about').classList.remove('active');
		TweenMax.to(document.getElementById('bg'), 1, {ease: Power4.easeOut, top: '-200vh'});
		TweenMax.to(document.getElementById('credit'), 2, {ease: Power4.easeOut, opacity: 0, top: '0px'});
	}
};

function resultAnimate(data) {
	loadingHide();
	window.setTimeout(() => {
		document.getElementById('result').style.display = 'block';
		if (data === null) {
			document.getElementById('result-text').innerHTML = 'Sorry, couldn\'t get weather data';
		} else if (data.list[0].weather[0].main === "Rain" || data.list[1].weather[0].main === "Rain" || data.list[2].weather[0].main === "Rain") {
			document.getElementById('result-text').innerHTML = 'Yep, ' + data.city.name + ' weather isn\'t looking too good';
		} else {
			document.getElementById('result-text').innerHTML = 'Don\'t bother with a coat, ' + data.city.name + ' weather\'s great!';
		}
	}, 2000);
	TweenMax.from(document.getElementById('result'), 1, {delay: 2, ease: Power4.easeOut, opacity: 0,	marginTop: '-40px'});
}

function temperatureTilesShow(data) {
	const nowTemp = toFahrenheit(data.list[0].main.temp);
	const nowDesc = data.list[0].weather[0].main;
	const laterTemp = toFahrenheit(data.list[1].main.temp);
	const laterDesc = data.list[1].weather[0].main;
	temperatureNowAnimate(nowTemp, nowDesc);
	temperatureLaterAnimate(nowTemp, nowDesc);
}

function temperatureNowAnimate(temp, desc) {
	document.getElementById('now').style.display = 'block';
	document.querySelectorAll('#now .description')[0].innerHTML = desc;
	document.querySelectorAll('#now img')[0].src = displayPicture(desc);
	document.querySelectorAll('#now .temp')[0].innerHTML = temp + '&#176;';
	TweenMax.from(document.getElementById('now'), 1, {delay: 3, ease: Power4.easeOut, opacity: 0,	marginTop: '-40px'});
}

function temperatureLaterAnimate(temp, desc) {
	document.getElementById('later').style.display = 'block';	
	document.querySelectorAll('#later .description')[0].innerHTML = desc;
	document.querySelectorAll('#later img')[0].src = displayPicture(desc);
	document.querySelectorAll('#later .temp')[0].innerHTML = temp + '&#176;';
	TweenMax.from(document.getElementById('later'), 1, {delay: 4, ease: Power4.easeOut, opacity: 0,	marginTop: '-40px'});
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
	} else if (desc === "Clear" && (5 < hours < 17)) {
		return "../img/moon.png" // only display moon between 5PM - 5AM
	} else if (desc === "Clear") {
		return "../img/sun.png"
	} else {
		return "../img/swirl.png"
	}
}


// Business Logic

function getLocation () {
	navigator.geolocation.getCurrentPosition(success, error);
	function success(position) {
		getWeather(position.coords.latitude, position.coords.longitude);
		// console.log(position.coords.latitude, position.coords.longitude);
	};
	function error() {
  	displayResult(null);
	};
}

function getWeather (lat, long) {
	const apiKey = "eef54fef4f484053c798c7b450ab75ab";
	const request = new XMLHttpRequest();
	request.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=' + apiKey, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			const data = JSON.parse(request.responseText);
			// console.log(data);
			resultAnimate(data);	
			temperatureTilesShow(data);
		} else {
			resultAnimate(null);
		}
	};
	request.onerror = function() {
		resultAnimate(null);
	};
	request.send();
}
