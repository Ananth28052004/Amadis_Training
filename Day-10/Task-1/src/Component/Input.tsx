import { useState } from "react";
import "../Css/Input.css";

function Input() {
  const apiId = "ac043a52a40774b5d31a592fc1446261";
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [print, setPrint] = useState(false);

  async function getWeather() {
    if (city === "") {
      alert("enter city");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiId}&units=metric`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setPrint(true);
      } else {
        setPrint(false);
        alert("Please Enter Correct City");
      }
    } catch {
      setPrint(false);
      alert("Error");
    }
  }
  return (
    <>
    <div className="main">
      <div className="container">
        <h1>Weather App</h1>
        <label>City Name: </label>
        <input type="text"placeholder="type here"onChange={(e) => setCity(e.target.value.trim())}/>
        <button onClick={getWeather}>Search</button>
      </div>
      {print && (
        <div className="weather-card">
          <h2>City: {weather.name}</h2>
          <h3>Temperature: {weather.main.temp} °C</h3>
          <h3>Humidity: {weather.main.humidity}%</h3>
          <h3>Weather: {weather.weather[0].main}</h3>
          <h3>Wind Speed: {weather.wind.speed} m/s</h3>
          <h3>Country: {weather.sys.country}</h3>
        </div>
      )}
      </div>
    </>
  );
}
export default Input;
