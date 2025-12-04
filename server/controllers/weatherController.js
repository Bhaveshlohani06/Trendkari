import axios from "axios";
import Weather from "../models/weather.js";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENWEATHER_KEY;

export async function getWeather(req, res) {
  try {
     const city = req.query.city || "Ramganj Mandi"; // default fallback

    // Try cache (last 30 min)
    const cached = await Weather.findOne({ city }).sort({ updatedAt: -1 });
    if (cached && (Date.now() - cached.updatedAt.getTime()) < 30*60*1000) {
      return res.json(cached);
    }

    // Fetch from API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const { data } = await axios.get(url);

    const weather = {
      city: data.name,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed,
      updatedAt: new Date()
    };

    // Save to DB
    const saved = await Weather.create(weather);
    res.json(saved);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
}


