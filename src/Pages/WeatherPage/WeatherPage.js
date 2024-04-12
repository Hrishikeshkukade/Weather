import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ErrorModal from "../../UI/ErrorModal/ErrorModal"; // Import ErrorModal component
import "./WeatherPage.css";

const WeatherPage = () => {
  const { cityName } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentResponse, forecastResponse] = await Promise.all([
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ae9c2d40c9757534fa5981378d88af6e`
          ),
          axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=ae9c2d40c9757534fa5981378d88af6e`
          ),
        ]);
        setWeatherData(currentResponse.data);
        setForecastData(forecastResponse.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setErrorMessage("Error fetching weather data. Please try again later.");
      }
    };

    fetchData();
  }, [cityName]);

  // Function to convert temperature from Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1); // Round to 1 decimal place
  };

  // Function to convert temperature from Kelvin to Fahrenheit
  const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9) / 5 + 32; // Formula for conversion
  };

  // Function to toggle temperature unit
  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Function to get appropriate background image based on weather conditions
  const getBackgroundImage = () => {
    if (!weatherData) return "";
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case "clear":
        return "/clear.jpg";
      case "clouds":
        return "/cloudy.jpg";
      case "rain":
      case "drizzle":
        return "/rainy.jpg";
      case "thunderstorm":
        return "/stormy.jpg";
      case "haze":
        return "/haze.jpg";
      case "snow":
        return "/snowy.jpg";
      default:
        return "";
    }
  };

  return (
    <div
      className="weather-container"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="weather-info">
        {errorMessage ? ( // Render ErrorModal if errorMessage exists
          <ErrorModal errorMessage={errorMessage} />
        ) : (
          <>
            <h1>Weather for {cityName}</h1>
            <div className="temperature-toggle">
              <button onClick={toggleTemperatureUnit}>
                {isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius"}
              </button>
            </div>
            {weatherData && (
              <div>
                <p>
                  Temperature:{" "}
                  {isCelsius
                    ? kelvinToCelsius(weatherData.main.temp)
                    : kelvinToFahrenheit(weatherData.main.temp)}{" "}
                  {isCelsius ? "°C" : "°F"}(Kelvin: {weatherData.main.temp}K)
                </p>
                <p>Description: {weatherData.weather[0].description}</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                <p>Pressure: {weatherData.main.pressure} hPa</p>
              </div>
            )}
            {forecastData && (
              <div className="forecast-info">
                <h2>Forecast</h2>

                {forecastData.list.map((item, index) => (
                  <div key={index} className="forecast-item">
                    <p>Date/Time: {item.dt_txt}</p>
                    <p>
                      Temperature:{" "}
                      {isCelsius
                        ? kelvinToCelsius(item.main.temp)
                        : kelvinToFahrenheit(item.main.temp)}{" "}
                      {isCelsius ? "°C" : "°F"}(Kelvin: {item.main.temp}K)
                    </p>
                    <p>Description: {item.weather[0].description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;

