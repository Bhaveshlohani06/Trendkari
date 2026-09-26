// import express from "express";
// import { getMandiRates } from "../controllers/mandiController.js";

// const router = express.Router();    

// router.get("/:mandi", getMandiRates);

// export default router;

import express from "express";
import { getMandiPrices, listMandis } from "../controllers/mandiController.js";
 
const router = express.Router();
 
router.get("/mandis", listMandis);
router.get("/:khetiwadiId", getMandiPrices);
 
export default router;
 