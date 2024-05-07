const cityInput = document.getElementById('city');
const searchButton = document.getElementById('search-button');
const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const windSpeedDisplay = document.getElementById('wind-speed');
const rainRateDisplay = document.getElementById('rain-rate');
const forecastTableBody = document.querySelector('#forecast-table tbody');

// Function to fetch weather data from the API
async function fetchWeather(cityName) {
    const apiKey = 'c3d99244a5a084ac7d31e5a7344b44f7';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const weatherData = {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                rainingPossibility: data.rain ? (data.rain['1h'] || 0) : 0
            };
            return weatherData;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return null;
    }
}

// Function to fetch forecast data from the API for the next 12 hours
async function fetchForecast(cityName) {
    const apiKey = 'c3d99244a5a084ac7d31e5a7344b44f7';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            // Filter forecast data for the next 12 hours
            const currentTime = new Date().getTime() / 1000; // Convert milliseconds to seconds
            const twelveHoursLater = currentTime + 12 * 60 * 60; // Add 12 hours in seconds
            const forecastData = data.list.filter(item => item.dt <= twelveHoursLater);

            return forecastData;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
        return null;
    }
}

// Function to calculate the average of forecast data
function calculateAverageForecast(forecastData) {
    if (!forecastData || forecastData.length === 0) {
        return null;
    }

    let totalTemperature = 0;
    let totalHumidity = 0;
    let totalWindSpeed = 0;
    let totalRainingPossibility = 0;

    forecastData.forEach(item => {
        totalTemperature += item.main.temp;
        totalHumidity += item.main.humidity;
        totalWindSpeed += item.wind.speed;
        totalRainingPossibility += item.rain ? (item.rain['1h'] || 0) : 0;
    });

    const averageTemperature = totalTemperature / forecastData.length;
    const averageHumidity = totalHumidity / forecastData.length;
    const averageWindSpeed = totalWindSpeed / forecastData.length;
    const averageRainingPossibility = totalRainingPossibility / forecastData.length;

    return {
        temperature: averageTemperature,
        humidity: averageHumidity,
        windSpeed: averageWindSpeed,
        rainingPossibility: averageRainingPossibility
    };
}

// Function to update the weather information on the page
function updateWeatherDisplay(weatherData) {
    if (weatherData) {
        temperatureDisplay.innerHTML = `<img src="./icons/sun_869869.png" alt="sun"> Temperature: ${weatherData.temperature}°C`;
        humidityDisplay.innerHTML = `<img src="./icons/clouds_414927.png" alt="clouds"> Humidity: ${weatherData.humidity}%`;
        windSpeedDisplay.innerHTML = `<img src="./icons/wind.png" alt="wind"> Wind Speed: ${weatherData.windSpeed} m/s`;
        rainRateDisplay.innerHTML = `<img src="./icons/rain.png" alt="rain"> Rain Rate: ${weatherData.rainingPossibility} mm/h`;
    } else {
        temperatureDisplay.innerHTML = `<img src="./icons/sun_869869.png" alt="sun"> Temperature: N/A`;
        humidityDisplay.innerHTML = `<img src="./icons/clouds_414927.png" alt="clouds"> Humidity: N/A`;
        windSpeedDisplay.innerHTML = `<img src="./icons/wind.png" alt="wind"> Wind Speed: N/A`;
        rainRateDisplay.innerHTML = `<img src="./icons/rain.png" alt="rain"> Rain Rate: N/A`;
    }
}

// Function to update the forecast table with forecast data
function updateForecastTable(forecastData) {
    forecastTableBody.innerHTML = ''; // Clear existing data

    // Iterate through forecast data and populate table rows
    forecastData.forEach(item => {
        const row = document.createElement('tr');
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
        row.innerHTML = `
            <td>${time}</td>
            <td>${item.main.temp.toFixed(1)}</td>
            <td>${item.main.humidity.toFixed(1)}</td>
            <td>${item.wind.speed.toFixed(1)}</td>
            <td>${item.rain ? (item.rain['1h'] || 0).toFixed(1) : '0'}</td>
        `;
        forecastTableBody.appendChild(row);
    });
}

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const cityName = cityInput.value.trim();

    if (cityName) {
        const weatherData = await fetchWeather(cityName);
        updateWeatherDisplay(weatherData);

        const forecastData = await fetchForecast(cityName);
        updateForecastTable(forecastData);

        cityInput.value = '';
    } else {
        alert('Please enter a city name.');
    }
});
