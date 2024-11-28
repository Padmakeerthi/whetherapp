import './App.css';
import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const API_KEY = '1635890035cbba097fd5c26c8ea672a1';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      const fiveDaysForecast = data.list.filter((_, index) => index % 8 === 0);
      return fiveDaysForecast.reverse();
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  };

  const handleSearch = async () => {
    if (!city) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (error) {
      setError('Error fetching weather data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!city) {
      setWeatherData([]);
    }
  }, [city]);

  return (
    <div className="weather-search-container">
      <div className="weather-search">
        <h2 className="weather-search-heading">Weather in your city</h2>
        <div className="weather-search-bar">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="weather-search-input"
          />
          <button
            onClick={handleSearch}
            className="weather-search-button"
            disabled={!city || isLoading}
          >
            Search
          </button>
          {isLoading && <div className="weather-search-spinner"></div>}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData.length > 0 && (
        <div className="forecast-container">
          {weatherData.map((weather, index) => (
            <div className="forecast-card" key={index}>
              <table className="weather-table">
                <thead>
                  <tr>
                    <th colSpan="2" style={{ backgroundColor: '#ff7f0e', color: '#fff' }}>
                      Date: {new Date(weather.dt * 1000).toLocaleDateString()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="weather-temp">Temperature</td>
                  </tr>
                  <tr className="weather-temp">
                    <td>Min</td>
                    <td>Max</td>
                  </tr>
                  <tr className="weather-temp">
                    <td>{weather?.main.temp_min?.toFixed(2)} °C</td>
                    <td>{weather?.main.temp_max?.toFixed(2)} °C</td>
                  </tr>
                  <tr>
                    <td>Pressure</td>
                    <td>{weather?.main.pressure} hPa</td>
                  </tr>
                  <tr>
                    <td>Humidity</td>
                    <td>{weather?.main.humidity}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
