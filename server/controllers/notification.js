  import NotificationToken from "../models/NotificationToken.js";
  import admin from "firebase-admin";

  import { broadcastPush } from "../helper/pushService.js";
  /**
   * Register or update FCM token
   * POST /api/v1/notifications/register
   */
  // export const registerNotificationToken = async (req, res) => {
  //   try {
  //     console.log("📥 Incoming notification register request");

  //     const { token, city, area } = req.body;

  //     // 1️⃣ Basic validation
  //     if (!token || !city) {
  //       console.log("❌ Missing token or city");
  //       return res.status(400).json({
  //         success: false,
  //         message: "token and city are required"
  //       });
  //     }

  //     // 2️⃣ Save or update token
  //     await NotificationToken.findOneAndUpdate(
  //       { token },
  //       {
  //         token,
  //         city,
  //         area,
  //         isActive: true,
  //         lastUsedAt: new Date()
  //       },
  //       { upsert: true }
  //     );

  //     console.log("✅ Notification token saved");

  //     // 3️⃣ Response
  //     res.status(200).json({
  //       success: true,
  //       message: "Notification token registered"
  //     });
  //   } catch (error) {
  //     console.error("🔥 Register token error:", error.message);

  //     res.status(500).json({
  //       success: false,
  //       message: "Internal server error"
  //     });
  //   }
  // };



export const registerNotificationToken = async (req, res) => {
  try {
    const { token, city, area, platform = "web", appVersion } = req.body;

    if (!token || !city) {
      return res.status(400).json({ success: false });
    }

    await NotificationToken.findOneAndUpdate(
      { token },
      {
        token,
        city,
        area,
        platform,
        appVersion,
        isValid: true,
        lastSeenAt: new Date(),
      },
      { upsert: true }
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Register token error:", err);
    res.status(500).json({ success: false });
  }
};



  // export const sendTestPush = async (req, res) => {
  //   try {
  //     const message = {
  //       token : req.body.token,
  //       notification: {
  //         title: "🔥 Trendkari Test",
  //         body: "This is a test push notification"
  //       },
  //       webpush: {
  //         notification: {
  //           title: "🔥 Trendkari Test",
  //           body: "This is a test push notification",
  //           icon: "/icon-192.png"
  //         }
  //       }
  //     };

  //     const response = await admin.messaging().send(message);

  //     console.log("✅ Push sent:", response);
  //     res.json({ success: true, response });

  //   } catch (error) {
  //     console.error("❌ Push error:", error);
  //     res.status(500).json({ success: false, error: error.message });
  //   }
  // };


  export const sendTestPush = async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "FCM token required"
        });
      }

    const message = {
  token,
  notification: {
    title: "🔥 Trendkari Test",
    body: "यह एक टेस्ट नोटिफिकेशन है"
  },
  webpush: {
    headers: { Urgency: "high" },
    notification: {
      icon: "https://trendkari.in/icons/icon-192.png",
    },
    fcmOptions: {
      link: "https://trendkari.in"
    }
  }
};


      const response = await admin.messaging().send(message);

      console.log("✅ Push sent:", response);

      res.json({ success: true, response });

    } catch (error) {
      console.error("❌ Push error:", error.code);

      // 🔥 Auto deactivate invalid token
      if (
        error.code === "messaging/registration-token-not-registered" ||
        error.code === "messaging/invalid-registration-token"
      ) {
        await NotificationToken.updateOne(
          { token: req.body.token },
          { isActive: false }
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
