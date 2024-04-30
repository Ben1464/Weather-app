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


// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const cityName = cityInput.value.trim();
    
    if (cityName) {
        const weatherData = await fetchWeather(cityName);
        updateWeatherDisplay(weatherData);

        cityInput.value='';
    } else {
        alert('Please enter a city name.');
    }
});
