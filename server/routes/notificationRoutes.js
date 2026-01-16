import express from "express";
import { registerNotificationToken } from "../controllers/notificationController.js";
import { sendTestPush } from "../controllers/notificationController.js";
import { sendBroadcastPush } from "../controllers/notificationController.js";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

// POST /api/v1/notifications/register
router.post("/register", registerNotificationToken);
router.post("/test", sendTestPush);
router.post("/broadcast", sendBroadcastPush);

// 🔔 Fetch notifications for bell
router.get("/", getNotifications);



export default router;
