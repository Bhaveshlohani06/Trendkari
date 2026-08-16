import NotificationToken from "../models/NotificationToken.js";
import admin from "firebase-admin";
import Notification from "../models/Notification.js";

import { broadcastPush } from "../helper/pushService.js";
import UserNotification from "../models/userNotification.js";
import User from "../models/usermodel.js";
import postmodel from "../models/postmodel.js";

/**
 * Register or update FCM token for the AUTHENTICATED user.
 * POST /api/v1/notifications/register
 *
 * CHANGES:
 * - Route now requires `requireSignIn` (see routes file) so req.user
 *   is always present — we never trust a userId from the body.
 * - Upserts on { user, deviceId } instead of { token } alone. This
 *   means a rotated FCM token updates the SAME row for that
 *   user+device, instead of ever piling up duplicate rows.
 * - Falls back to upserting on { token } if deviceId isn't sent yet
 *   (e.g. old frontend bundle still cached) so nothing breaks.
 */
export const registerNotificationToken = async (req, res) => {
  try {
    const {
      token,
      city,
      area,
      platform = "web",
      appVersion,
      deviceId,
    } = req.body;

    if (!token || !city) {
      return res.status(400).json({
        success: false,
        message: "token and city are required",
      });
    }

    const userId = req.user?._id;
    const userAgent = req.headers["user-agent"];

    const payload = {
      token,
      user: userId,
      deviceId,
      city,
      area,
      platform,
      appVersion,
      userAgent,
      isValid: true,
      lastSeenAt: new Date(),
    };

    try {
      const filter = deviceId && userId ? { user: userId, deviceId } : { token };

      await NotificationToken.findOneAndUpdate(
        filter,
        payload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (err) {
      // Duplicate key on `token` (e.g. this exact token already exists
      // under a different user/device row — happens if a user logs
      // out/in or reinstalls). Re-point that existing row instead of
      // failing the request.
      if (err.code === 11000) {
        await NotificationToken.findOneAndUpdate(
          { token },
          payload,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } else {
        throw err;
      }
    }

    res.status(200).json({
      success: true,
      message: "Notification token registered",
    });
  } catch (err) {
    console.error("Register token error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Remove/deactivate this device's push subscription for the
 * authenticated user. Soft-delete (isValid: false) so history
 * (createdAt/lastSeenAt) is preserved for debugging.
 *
 * DELETE /api/v1/notifications/register
 * body: { deviceId } — token is not required, deviceId is enough
 * and is more reliable (token may already be gone client-side).
 */
export const unregisterNotificationToken = async (req, res) => {
  try {
    const { deviceId, token } = req.body;
    const userId = req.user?._id;

    if (!deviceId && !token) {
      return res.status(400).json({
        success: false,
        message: "deviceId or token is required",
      });
    }

    const filter = deviceId
      ? { user: userId, deviceId }
      : { user: userId, token };

    const result = await NotificationToken.findOneAndUpdate(
      filter,
      { isValid: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      removed: !!result,
    });
  } catch (err) {
    console.error("Unregister token error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Tell the frontend whether THIS device currently has an active
 * subscription for the authenticated user — this is what the
 * Sidebar toggle state is derived from on load.
 *
 * GET /api/v1/notifications/status?deviceId=xxxx
 */
export const getPushStatus = async (req, res) => {
  try {
    const { deviceId } = req.query;
    const userId = req.user?._id;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId query param is required",
      });
    }

    const existing = await NotificationToken.findOne({
      user: userId,
      deviceId,
      isValid: true,
    }).lean();

    res.status(200).json({
      success: true,
      subscribed: !!existing,
    });
  } catch (err) {
    console.error("Push status error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendTestPush = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token required",
      });
    }

    const message = {
      token,
      notification: {
        title: "🔥 Trendkari Test",
        body: "यह एक टेस्ट नोटिफिकेशन है",
      },
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          icon: "https://trendkari.in/icons/icon-192.png",
        },
        fcmOptions: {
          link: "https://trendkari.in",
        },
      },
    };

    const response = await admin.messaging().send(message);

    console.log("✅ Push sent:", response);

    res.json({ success: true, response });
  } catch (error) {
    console.error("❌ Push error:", error.code);

    // 🔥 Auto deactivate invalid token
    // FIX: was writing `isActive`, a field that doesn't exist on the
    // schema, so this never actually persisted. Now writes `isValid`,
    // matching the schema and matching broadcastPush's cleanup logic.
    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.code === "messaging/invalid-registration-token"
    ) {
      await NotificationToken.updateOne(
        { token: req.body.token },
        { isValid: false }
      );
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

export const sendBroadcastPush = async (req, res) => {
  try {
    await broadcastPush(req.body);

    res.json({
      success: true,
      message: "Broadcast sent",
    });
  } catch (error) {
    console.error("❌ Broadcast error:", error);
    res.status(500).json({ success: false });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { limit = 10, city } = req.query;

    const filter = {};

    if (city) {
      filter.city = city;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserNotifications = async (req, res) => {
  const notifications = await UserNotification.find({
    user: req.user._id,
  })
    .populate("sender", "name avatar")
    .populate("PostId", "title slug")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ success: true, notifications });
};

export const markNotificationRead = async (req, res) => {
  await UserNotification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
};

/* Mark ALL as seen (bell opened) */
export const markAllSeen = async (req, res) => {
  await UserNotification.updateMany(
    { user: req.user._id, isSeen: false },
    { isSeen: true }
  );

  res.json({ success: true });
};
