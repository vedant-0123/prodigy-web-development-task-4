const apiKey = '02c4adcfa05d267fc47be634bf0caa0b'; 

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByCoords, showError);
    } else {
        document.getElementById('weatherDisplay').innerText = 'Geolocation is not supported by this browser.';
    }
});

function getWeatherByCoords(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherData(`lat=${lat}&lon=${lon}`);
}

function getWeatherByLocation() {
    const location = document.getElementById('locationInput').value;
    fetchWeatherData(`q=${location}`);
}

function fetchWeatherData(query) {
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weatherDisplay').innerText = 'Error fetching weather data. Please try again.';
        });
}

function displayWeather(data) {
    if (data.cod !== 200) {
        document.getElementById('weatherDisplay').innerText = `Error: ${data.message}`;
        return;
    }

    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
}

function showError(error) {
    let errorMessage = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = 'An unknown error occurred.';
            break;
    }
    document.getElementById('weatherDisplay').innerText = errorMessage;
}