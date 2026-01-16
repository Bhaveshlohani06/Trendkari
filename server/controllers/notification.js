import NotificationToken from "../models/NotificationToken.js";
import admin from "firebase-admin";


/**
 * Register or update FCM token
 * POST /api/v1/notifications/register
 */
export const registerNotificationToken = async (req, res) => {
  try {
    console.log("📥 Incoming notification register request");

    const { token, city, area } = req.body;

    // 1️⃣ Basic validation
    if (!token || !city) {
      console.log("❌ Missing token or city");
      return res.status(400).json({
        success: false,
        message: "token and city are required"
      });
    }

    // 2️⃣ Save or update token
    await NotificationToken.findOneAndUpdate(
      { token },
      {
        token,
        city,
        area,
        isActive: true,
        lastUsedAt: new Date()
      },
      { upsert: true }
    );

    console.log("✅ Notification token saved");

    // 3️⃣ Response
    res.status(200).json({
      success: true,
      message: "Notification token registered"
    });
  } catch (error) {
    console.error("🔥 Register token error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



export const sendTestPush = async (req, res) => {
  try {
    const message = {
      token: "cAMHv21L099QrR2cX6BMCj:APA91bFQXyhAhjuLDUSdHyXY7u8whs4jjGC310iwXqm93pys8uc_F9ELqdmlF3dG2Ad_ajZfGGRXiOaEJphwt_NxPJZ4J9PGn7VulF36WhAdkpP604i3sX4",
      notification: {
        title: "🔥 Trendkari Test",
        body: "This is a test push notification"
      },
      webpush: {
        notification: {
          title: "🔥 Trendkari Test",
          body: "This is a test push notification",
          icon: "/icon-192.png"
        }
      }
    };

    const response = await admin.messaging().send(message);

    console.log("✅ Push sent:", response);
    res.json({ success: true, response });

  } catch (error) {
    console.error("❌ Push error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
