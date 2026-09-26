// import mongoose from "mongoose";


// const CropPriceSchema = new mongoose.Schema({
//   mandi: { type: mongoose.Schema.Types.ObjectId, ref: "Mandi", required: true },
//   crop_name: { type: String, required: true },
//   price_per_kg: { type: Number, required: true },
//   unit: { type: String, default: "kg" },
//   date: { type: Date, default: Date.now } // timestamp for rate
// });

// export default mongoose.model("CropPrice", CropPriceSchema);

// models/Cropmodel.js
import mongoose from "mongoose";

const CropPriceSchema = new mongoose.Schema({
  mandi: { type: mongoose.Schema.Types.ObjectId, ref: "Mandi", required: true },
  crop_name: { type: String, required: true },
  price_min: { type: Number },
  price_max: { type: Number },
  price_avg: { type: Number, required: true },
  price_yesterday: { type: Number },
  trend: { type: String, enum: ["up", "down", "stable"], default: "stable" },
  quality: { type: String },
  unit: { type: String, default: "quintal" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("CropPrice", CropPriceSchema);