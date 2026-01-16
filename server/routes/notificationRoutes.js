import express from "express";
import { registerNotificationToken } from "../controllers/notification.js";
import { sendTestPush } from "../controllers/notification.js";

const router = express.Router();

// POST /api/v1/notifications/register
router.post("/register", registerNotificationToken);
router.post("/test", sendTestPush);


export default router;
