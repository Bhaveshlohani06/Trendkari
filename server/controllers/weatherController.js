import axios from "axios";
import Weather from "../models/weather.js";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_KEY;

/**
 * Allowed city mapping
 * Frontend value  -> OpenWeather city name
 */
const CITY_MAP = {
  kota: "Kota",
  ramganjmandi: "Ramganj Mandi",
  sangod: "Sangod",
  ladpura: "Kota",
  "kota-rural": "Kota",
};

export async function getWeather(req, res) {
  try {
    const cityKey = (req.query.city || "ramganjmandi").toLowerCase();

    // ❌ Invalid city
    if (!CITY_MAP[cityKey]) {
      return res.status(400).json({
        error: "Invalid city",
        allowedCities: Object.keys(CITY_MAP),
      });
    }

    const cityName = CITY_MAP[cityKey];

    // ✅ Cache check (30 minutes)
    const cached = await Weather.findOne({ city: cityName }).sort({ updatedAt: -1 });

    if (cached && Date.now() - cached.updatedAt.getTime() < 30 * 60 * 1000) {
      return res.json(cached);
    }

    // 🌤 Fetch from OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${API_KEY}&units=metric`;

    const { data } = await axios.get(url);

    const weather = {
      city: cityName,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed,
      updatedAt: new Date(),
    };

    // 💾 Save fresh data
    const saved = await Weather.create(weather);

    return res.json(saved);
  } catch (error) {
    console.error("Weather API error:", error.message);
    return res.status(500).json({ error: "Failed to fetch weather" });
  }
}
  