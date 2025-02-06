// Get your free API key from https://openweathermap.org/api
const API_KEY = '1fd6775f7dc6e47c23cf9f95dfc44086';

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = document.getElementById('cityName');
    const temp = document.getElementById('temp');
    const weather = document.getElementById('weather');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const weatherInfo = document.getElementById('weatherInfo');
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        
        // Update DOM elements
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temp.textContent = Math.round(data.main.temp);
        weather.textContent = data.weather[0].main;
        humidity.textContent = data.main.humidity;
        wind.textContent = data.wind.speed;

        // Show weather info and hide error
        weatherInfo.style.display = 'block';
        errorMessage.style.display = 'none';

    } catch (error) {
        errorMessage.textContent = 'Error: ' + error.message;
        errorMessage.style.display = 'block';
        weatherInfo.style.display = 'none';
    }
}