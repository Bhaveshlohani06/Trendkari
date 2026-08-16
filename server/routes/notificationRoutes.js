// routes/notificationRoutes.js
import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";

import {
  registerNotificationToken,
  unregisterNotificationToken,
  getPushStatus,
  sendTestPush,
  sendBroadcastPush,

  getUserNotifications,
  markNotificationRead,
  markAllSeen,
} from "../controllers/notificationController.js";

const router = express.Router();

/* ================= PUSH (FCM) ================= */
// CHANGE: /register now requires sign-in so the subscription is tied
// to req.user, not a blindly-trusted body field. Same endpoint you
// already had — just authenticated + upserts per user+device now.
router.post("/register", requireSignIn, registerNotificationToken);

// NEW: disable/remove push for this device.
router.delete("/register", requireSignIn, unregisterNotificationToken);

// NEW: used by the Sidebar on load to know whether THIS browser is
// currently subscribed for the logged-in user.
router.get("/status", requireSignIn, getPushStatus);

router.post("/test", sendTestPush);
router.post("/broadcast", sendBroadcastPush);

/* ================= IN-APP (BELL) ============== */
router.get("/", requireSignIn, getUserNotifications);
router.patch("/read/:id", requireSignIn, markNotificationRead);
router.patch("/seen-all", requireSignIn, markAllSeen);

export default router;
