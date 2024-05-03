// Define variables for elements in the HTML
const cityInput = document.getElementById('city');
const searchButton = document.getElementById('search-button');
const temperatureDisplay = document.getElementById('temperature');
const humidityDisplay = document.getElementById('humidity');
const windSpeedDisplay = document.getElementById('wind-speed');

// Function to fetch weather data from the API
async function fetchWeather(cityName) {
    const apiKey = 'c3d99244a5a084ac7d31e5a7344b44f7'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (response.ok) {
            return {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed
            };
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return null;
    }
}

// Function to fetch forecast data from the API
async function fetchForecast(cityName) {
    const apiKey = 'c3d99244a5a084ac7d31e5a7344b44f7'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (response.ok) {
            return data.list; // Return the list of forecast items
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
    
    // Sum up the values of each parameter
    forecastData.forEach(item => {
        totalTemperature += item.main.temp;
        totalHumidity += item.main.humidity;
        totalWindSpeed += item.wind.speed;
    });
    
    // Calculate the average values
    const averageTemperature = totalTemperature / forecastData.length;
    const averageHumidity = totalHumidity / forecastData.length;
    const averageWindSpeed = totalWindSpeed / forecastData.length;
    
    return {
        temperature: averageTemperature,
        humidity: averageHumidity,
        windSpeed: averageWindSpeed
    };
}

// Function to update the weather information on the page
function updateWeatherDisplay(weatherData) {
    if (weatherData) {
        temperatureDisplay.innerHTML = `<img src="./icons/sun_869869.png" alt="sun"> Temperature: ${weatherData.temperature}°C`;
        humidityDisplay.innerHTML = `<img src="./icons/clouds_414927.png" alt="clouds"> Humidity: ${weatherData.humidity}%`;
        windSpeedDisplay.innerHTML = `<img src="./icons/wind.png" alt="wind"> Wind Speed: ${weatherData.windSpeed} m/s`;
    } else {
        temperatureDisplay.innerHTML = `<img src="./icons/sun_869869.png" alt="sun"> Temperature: N/A`;
        humidityDisplay.innerHTML = `<img src="./icons/clouds_414927.png" alt="clouds"> Humidity: N/A`;
        windSpeedDisplay.innerHTML = `<img src="./icons/wind.png" alt="wind"> Wind Speed: N/A`;
    }
}

// Function to update the forecast table with average values
function updateForecastTable(forecastData) {
    const tableBody = document.querySelector('#forecast-table tbody');
    tableBody.innerHTML = ''; // Clear existing data
    
    const averageForecast = calculateAverageForecast(forecastData);
    
    if (averageForecast) {
        // Create a single row for average forecast
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Average</td>
            <td>${averageForecast.temperature.toFixed(1)}</td>
            <td>${averageForecast.humidity.toFixed(1)}</td>
            <td>${averageForecast.windSpeed.toFixed(1)}</td>
        `;
        
        // Append the row to the table body
        tableBody.appendChild(row);
    } else {
        // If no forecast data available
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4">No forecast data available</td>';
        tableBody.appendChild(row);
    }
}

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const cityName = cityInput.value.trim();
    
    if (cityName) {
        const weatherData = await fetchWeather(cityName);
        updateWeatherDisplay(weatherData);
        
        const forecastData = await fetchForecast(cityName); // Fetch forecast data
        updateForecastTable(forecastData); // Update the forecast table
        
        cityInput.value = '';
    } else {
        alert('Please enter a city name.');
    }
});
