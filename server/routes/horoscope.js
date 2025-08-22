import express from "express";
import { generateNow, getTodaysHoroscope, getUserHoroscopes } from "../controllers/horoscopeController.js";
import {requireSignIn} from '../middleware/authMiddleware.js'
const router = express.Router();

// Logged-in user fetches their daily horoscope
router.get("/me",requireSignIn, getTodaysHoroscope);

// Admin/manual trigger: generate immediately
router.post("/generate/:userId", generateNow);

// Fetch all posts for a user (history)
router.get("/user/:userId", getUserHoroscopes);

export default router;
