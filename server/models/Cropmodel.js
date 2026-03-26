import mongoose from "mongoose";


const CropPriceSchema = new mongoose.Schema({
  mandi: { type: mongoose.Schema.Types.ObjectId, ref: "Mandi", required: true },
  crop_name: { type: String, required: true },
  price_per_kg: { type: Number, required: true },
  unit: { type: String, default: "kg" },
  date: { type: Date, default: Date.now } // timestamp for rate
});

export default mongoose.model("CropPrice", CropPriceSchema);