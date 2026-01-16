import express from "express";
import admin from "../config/firebase.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { token } = req.body;

    const message = {
      token,
      notification: {
        title: "🔥 Trendkari Live Test",
        body: "Backend → Firebase → Browser WORKING"
      },
      webpush: {
        notification: {
          icon: "/icons/icon-192.png"
        }
      }
    };

    const response = await admin.messaging().send(message);

    console.log("📤 Push sent:", response);

    res.json({ success: true, response });
  } catch (err) {
    console.error("❌ Push error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
