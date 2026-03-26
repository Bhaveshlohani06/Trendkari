import express from "express";
import { getMandiRates } from "../controllers/mandiController.js";

const router = express.Router();    

router.get("/:mandi", getMandiRates);

export default router;