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

        // Fetch 3-Day Forecast Data (API-based)
        getForecast(cityInput.value);

        // Simulated forecast using geolocation
        const location = getUserLocation(); // Task 3
        const simulatedForecast = generateWeatherForecast(cityInput.value, location.latitude, location.longitude); // Task 2
        console.log(`\nSimulated 3-Day Forecast for ${cityInput.value}`);
        simulatedForecast.forEach(day => {
            console.log(`Date: ${day.date}`);
            console.log(`Lat: ${day.latitude}, Lon: ${day.longitude}`);
            console.log(`Condition: ${day.condition}`);
            console.log(`Temperature: ${day.temperature}°C`);
            console.log(`Humidity: ${day.humidity}%`);
            console.log('---------------------------');
        });

    } catch (error) {
        errorMessage.textContent = 'Error: ' + error.message;
        errorMessage.style.display = 'block';
        weatherInfo.style.display = 'none';
    }
}

// Fetch 3-Day Forecast Data (real API)
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

// ✅ Task 1: Simulate Geolocation
function getUserLocation() {
    return {
        latitude: 40.7128,
        longitude: -74.0060 // New York
    };
}

// ✅ Task 2: Generate Forecast from Simulated Location
function generateWeatherForecast(city, latitude, longitude) {
    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const forecast = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
        const date = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        const temperature = (Math.random() * 45 - 10).toFixed(1); // Range -10 to 35 °C
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const humidity = Math.floor(Math.random() * 100);

        forecast.push({
            date,
            temperature,
            condition,
            humidity,
            latitude,
            longitude
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return forecast;
}
