import mongoose from "mongoose";

const horoscopeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  zodiacSign: String,
  language: { type: String, enum: ["english", "hindi"] },
  title: String,
  summary: String,
  sections: [{ heading: String, text: String }],
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String
  },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Horoscope", horoscopeSchema);
