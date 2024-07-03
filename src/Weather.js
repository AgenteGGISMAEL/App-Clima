import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [cities, setCities] = useState(['Quito']);
  const [weatherData, setWeatherData] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const dataPromises = cities.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=56f722a92ab16b7610b232e6198aacd8`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error fetching weather for ${city}`);
              }
              return response.json();
            })
        );
        const data = await Promise.all(dataPromises);
        setWeatherData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (cities.length) {
      fetchWeather();
    }
  }, [cities]);

  const handleCityChange = (e) => {
    setNewCity(e.target.value);
  };

  const handleAddCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities([...cities, newCity.trim()]);
      setNewCity('');
    }
  };

  return (
    <div>
      <h1>App Clima </h1>
      <p>IsmaelGG</p>
      <div>
        <input
          type="text"
          value={newCity}
          onChange={handleCityChange}
          placeholder="Enter city name"
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div>
        {weatherData.map(data => (
          <div key={data.id}>
            <h2>Clima en {data.name}</h2>
            <p>Temperatura: {(data.main.temp - 273.15).toFixed(2)}°C</p>
            <p>Clima: {data.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
