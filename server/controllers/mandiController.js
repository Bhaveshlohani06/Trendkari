// import Mandi from "../models/Mandimodel.js";
// import { fetchMandiRates } from "../services/mandiService.js";


// export const getMandiRates = async (req, res) => {
//   try {
//     const mandi = await Mandi.findById(req.params.mandi);
//     if (!mandi) {
//       return res.status(404).json({ error: "Mandi not found" });
//     }

//     await fetchMandiRates(mandi);
//     res.json({ message: "Rates updated successfully" });
//   } catch (err) {
//     console.error("Error fetching mandi rates:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// controllers/marketController.js
import Mandi from "../models/Mandimodel.js";
import CropPrice from "../models/Cropmodel.js";

// GET /api/market/:khetiwadiId
// Returns the mandi plus the latest known price for every crop tracked there.
export const getMandiPrices = async (req, res) => {
  try {
    const { khetiwadiId } = req.params;

    const mandi = await Mandi.findOne({ khetiwadi_id: khetiwadiId });
    if (!mandi) {
      return res.status(404).json({ message: "Mandi not found" });
    }

    // Your scheduler upserts a fresh CropPrice doc per crop on every run, so
    // there can be several dated rows per crop. Group by crop_name and keep
    // only the most recent one.
    const latestPrices = await CropPrice.aggregate([
      { $match: { mandi: mandi._id } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$crop_name",
          price_min: { $first: "$price_min" },
          price_max: { $first: "$price_max" },
          price_avg: { $first: "$price_avg" },
          price_yesterday: { $first: "$price_yesterday" },
          trend: { $first: "$trend" },
          quality: { $first: "$quality" },
          unit: { $first: "$unit" },
          date: { $first: "$date" },
        },
      },
    ]);

    const crops = latestPrices.map((p) => ({
      crop_name: p._id,
      price_min: p.price_min,
      price_max: p.price_max,
      price_avg: p.price_avg,
      price_yesterday: p.price_yesterday,
      trend: p.trend,
      quality: p.quality,
      unit: p.unit,
      date: p.date,
    }));

    res.json({
      mandi: {
        name: mandi.name,
        district: mandi.district,
        state: mandi.state,
        khetiwadi_id: mandi.khetiwadi_id,
        lastUpdated: mandi.lastUpdated,
        lastFetchStatus: mandi.lastFetchStatus,
      },
      crops,
    });
  } catch (err) {
    console.error("❌ getMandiPrices error:", err.message);
    res.status(500).json({ message: "Failed to fetch mandi prices" });
  }
};

// GET /api/mandis
// Small helper endpoint — lets the frontend list mandis without hardcoding them.
export const listMandis = async (_req, res) => {
  try {
    const mandis = await Mandi.find(
      {},
      "name district state khetiwadi_id lastUpdated lastFetchStatus"
    );
    res.json(mandis);
  } catch (err) {
    console.error("❌ listMandis error:", err.message);
    res.status(500).json({ message: "Failed to fetch mandis" });
  }
};