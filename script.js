const apiKey = '50705cb548e0d8c158898c1c708027e3';

const weatherResult = document.getElementById("weather-result");
const forecastSection = document.getElementById("forecast");
const loader = document.getElementById("loader");

// Weather icon mapping
const iconMap = {
  Clear: "wi-day-sunny",
  Clouds: "wi-cloudy",
  Rain: "wi-rain",
  Drizzle: "wi-sprinkle",
  Thunderstorm: "wi-thunderstorm",
  Snow: "wi-snow",
  Mist: "wi-fog",
  Smoke: "wi-smoke",
  Haze: "wi-day-haze",
  Dust: "wi-dust",
  Fog: "wi-fog",
  Sand: "wi-sandstorm",
  Ash: "wi-volcano",
  Squall: "wi-strong-wind",
  Tornado: "wi-tornado"
};

// Toggle Theme (optional)
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

// Main handler
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeather(city);
  fetchForecast(city);
}

// Attach event listener
document.getElementById("search-button").addEventListener("click", getWeather);

// Fetch current weather
function fetchWeather(city) {
  loader.style.display = "block";
  weatherResult.innerHTML = "";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error("Weather Error: ${response.status}");
      return response.json();
    })
    .then(data => {
      const { name, sys, main, weather, wind } = data;
      const iconClass = iconMap[weather?.[0]?.main] || "wi-na";

      weatherResult.innerHTML = `
        <h3>${name}, ${sys.country}</h3>
        <i class="wi ${iconClass} weather-icon"></i>
        <p><i class="fas fa-temperature-high"></i> Temperature: ${main.temp}°C</p>
        <p><i class="fas fa-cloud"></i> Condition: ${weather[0].description}</p>
        <p><i class="fas fa-wind"></i> Wind Speed: ${wind.speed} m/s</p>
        <p><i class="fas fa-tint"></i> Humidity: ${main.humidity}%</p>
      `;
    })
    .catch(err => {
      weatherResult.innerHTML = '<p class="error">Unable to fetch weather: ${err.message}</p>';
    })
    .finally(() => {
      loader.style.display = "none";
    });
}

// Fetch 5-day forecast
function fetchForecast(city) {
  forecastSection.innerHTML = "";

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error("Forecast Error: ${response.status}");
      return response.json();
    })
    .then(data => {
      const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      dailyForecasts.forEach(day => {
        const date = new Date(day.dt_txt);
        const iconClass = iconMap[day.weather?.[0]?.main] || "wi-na";

        forecastSection.innerHTML += `
          <div class="forecast-day">
            <p>${date.toDateString()}</p>
            <i class="wi ${iconClass}"></i>
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      forecastSection.innerHTML = '<p class="error">Unable to fetch forecast: ${err.message}</p>';
    });
}