// models/Horoscope.js
import mongoose from "mongoose";

const LocalizedStringSchema = new mongoose.Schema(
  {
    english: { type: String, default: "" },
    hindi: { type: String, default: "" },
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "" },
    text: {
      english: { type: String, default: "" },
      hindi: { type: String, default: "" }
    }
  },
  { _id: false }
);


const HoroscopeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    // bilingual rashi/zodiac (optional but recommended)
    zodiac: { type: LocalizedStringSchema, default: () => ({}) },

    // keep a single title (or make it LocalizedStringSchema if you want bilingual titles too)
    title: { type: String, default: "" },

    // bilingual summary
    summary: { type: LocalizedStringSchema, default: () => ({}) },

    // sections with bilingual text
       sections: [SectionSchema],


    // lucky fields
    lucky: {
      color: { type: String, default: "" },
      number: { type: Number, default: 0 },
    },

    tags: [{ type: String }],
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },

    generatedAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

export default mongoose.model("Horoscope", HoroscopeSchema);
