import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  const API_KEY = "b9943bef89cc03dc8a3668db9ad43f16"; // Replace with your OpenWeather API key

  async function getWeather() {
    if (city.trim() === "") {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError(data.message);
      }
    } catch (err) {
      setWeather(null);
      setError("Something went wrong.");
      console.log(err);
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌦 Weather App</h1>

      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>Search</button>

      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {weather && (
        <div
          style={{
            border: "1px solid black",
            width: "300px",
            margin: "20px auto",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{weather.name}</h2>
          <h3>🌡 Temperature: {weather.main.temp} °C</h3>
          <h3>☁ Weather: {weather.weather[0].main}</h3>
          <h3>📝 Description: {weather.weather[0].description}</h3>
          <h3>💧 Humidity: {weather.main.humidity}%</h3>
          <h3>💨 Wind Speed: {weather.wind.speed} m/s</h3>
          <h3>🌡 Feels Like: {weather.main.feels_like} °C</h3>
          <h3>📈 Max Temp: {weather.main.temp_max} °C</h3>
          <h3>📉 Min Temp: {weather.main.temp_min} °C</h3>
        </div>
      )}
    </div>
  );
}

export default App;