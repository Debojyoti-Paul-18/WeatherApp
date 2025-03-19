const API_KEY = '1fd6775f7dc6e47c23cf9f95dfc44086';

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = document.getElementById('cityName');
    const temp = document.getElementById('temp');
    const weather = document.getElementById('weather');
    const pressure = document.getElementById('pressure');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const weatherInfo = document.getElementById('weatherInfo');
    const errorMessage = document.getElementById('errorMessage');
    const forecastContainer = document.getElementById('forecast');

    try {
        // Fetch current weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        
        // Update Current Weather Details
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temp.textContent = Math.round(data.main.temp);
        weather.textContent = data.weather[0].main;
        pressure.textContent = data.main.pressure;
        humidity.textContent = data.main.humidity;
        wind.textContent = data.wind.speed;

        // Show Weather Info & Hide Error
        weatherInfo.style.display = 'block';
        errorMessage.style.display = 'none';

        // Fetch 3-Day Forecast Data
        getForecast(cityInput.value);

    } catch (error) {
        errorMessage.textContent = 'Error: ' + error.message;
        errorMessage.style.display = 'block';
        weatherInfo.style.display = 'none';
    }
}

// Fetch 3-Day Forecast Data
async function getForecast(city) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous data

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Forecast data not found');
        }

        const data = await response.json();
        const forecastDays = {};

        // Extract 3-Day Forecast Data
        data.list.forEach((item) => {
            const date = new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "long" });

            if (!forecastDays[date]) {
                forecastDays[date] = {
                    temp: Math.round(item.main.temp),
                    weather: item.weather[0].main,
                    icon: item.weather[0].icon
                };
            }
        });

        // Display Forecast Data
        Object.keys(forecastDays).slice(0, 3).forEach((day) => {
            const forecast = forecastDays[day];
            forecastContainer.innerHTML += `
                <div class="forecast-item">
                    <h3>${day}</h3>
                    <img src="https://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="${forecast.weather}">
                    <p>${forecast.weather}</p>
                    <p>${forecast.temp}°C</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}
