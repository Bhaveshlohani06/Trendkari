import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temp: Number,
  feelsLike: Number,
  humidity: Number,
  condition: String,   // e.g., "Cloudy"
  windSpeed: Number,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Weather", weatherSchema);
