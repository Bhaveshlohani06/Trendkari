// import mongoose from "mongoose";

// const MandiSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   district: { type: String },
//   state: { type: String },
//   lat: { type: Number, required: true },
//   lng: { type: Number, required: true },
//   khetiwadi_id: { type: String } // ID to fetch data from KhetiWadi
// });

// export default mongoose.model("Mandi", MandiSchema);

// models/Mandimodel.js
import mongoose from "mongoose";

const MandiSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  district: { type: String },
  state: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  khetiwadi_id: { type: String }, // ID to fetch data from KhetiWadi
  lastUpdated: { type: Date },
  lastFetchStatus: { type: String, enum: ["success", "error"] },
  lastError: { type: String },
});

export default mongoose.model("Mandi", MandiSchema);