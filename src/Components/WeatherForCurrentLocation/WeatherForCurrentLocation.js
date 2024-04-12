import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherForCurrentLocation.css"; // Import CSS file for component styling

const WeatherForCurrentLocation = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Get user's current location using Geolocation API
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch weather data using latitude and longitude
          const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ae9c2d40c9757534fa5981378d88af6e`
          );
          setWeatherData(weatherResponse.data);
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="weather-container">
      {weatherData ? (
        <div className="weather-info">
          <h1>Weather for Your Current Location</h1>
          <p className="location">Location: {weatherData.name}</p>
          <p className="temperature">Temperature: {weatherData.main.temp}°C</p>
          <p className="description">Description: {weatherData.weather[0].description}</p>
          <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
          <p className="wind">Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default WeatherForCurrentLocation;



