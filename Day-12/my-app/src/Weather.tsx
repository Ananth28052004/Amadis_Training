import React, { useState } from "react";
const API_KEY = "ac043a52a40774b5d31a592fc1446261";

type Props = {
  username: string;
  onLogout: () => void;
};

function Weather({ username, onLogout }: Props) {
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInputChange(text: string) {
    setCityInput(text);
    setSelectedCity(null);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    setSuggestions(data);
  }

  function pickCity(city: any) {
    setSelectedCity(city);
    setCityInput(`${city.name}, ${city.country}`);
    setSuggestions([]);
  }

  async function handleSearch() {
    setError("");
    setWeather(null);

    if (!selectedCity) {
      setError("Please type a city and pick one from the list.");
      return;
    }

    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    setWeather(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 p-5">
      <div className="w-80 mx-auto mb-4 flex justify-between items-center text-white">
        <span>Welcome, {username}</span>
        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-md border border-slate-600 text-sm hover:bg-slate-800"
        >
          Log out
        </button>
      </div>

      <div className="w-80 mx-auto bg-slate-800 rounded-xl p-6 text-white">
        <h1 className="text-xl font-semibold text-center mb-4">Weather Search</h1>

        <div className="flex gap-2">
          <input
            type="text"
            value={cityInput}
            placeholder="Enter a city name..."
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1 p-2.5 rounded-md border border-slate-600 bg-slate-900 text-white text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 rounded-md bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="mt-2 bg-slate-900 border border-slate-600 rounded-md overflow-hidden">
            {suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => pickCity(city)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-700"
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {weather && (
          <div className="mt-5 text-center bg-slate-900 rounded-lg p-5">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="w-16 h-16 mx-auto"
            />
            <h2 className="text-3xl font-bold mt-1">{Math.round(weather.main.temp)}°C</h2>
            <p className="text-slate-400 capitalize">{weather.weather[0].description}</p>
            <p className="text-sm mt-2">Humidity: {weather.main.humidity}%</p>
            <p className="text-sm">Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;