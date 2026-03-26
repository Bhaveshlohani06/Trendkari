import Mandi from "../models/Mandimodel.js";
import { fetchMandiRates } from "../services/mandiService.js";


export const getMandiRates = async (req, res) => {
  try {
    const mandi = await Mandi.findById(req.params.mandi);
    if (!mandi) {
      return res.status(404).json({ error: "Mandi not found" });
    }

    await fetchMandiRates(mandi);
    res.json({ message: "Rates updated successfully" });
  } catch (err) {
    console.error("Error fetching mandi rates:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
