  import NotificationToken from "../models/NotificationToken.js";
  import admin from "firebase-admin";


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
    const { title, body, platform = "web" } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "title and body required",
      });
    }

    // 1️⃣ Fetch valid tokens by platform
    const tokens = await NotificationToken.find(
      { isValid: true, platform },
      { token: 1, _id: 0 }
    ).lean();

    if (tokens.length === 0) {
      return res.json({
        success: true,
        message: "No active users",
      });
    }

    // 2️⃣ Build base message
    const message = {
      tokens: tokens.map(t => t.token),
      notification: { title, body },
    };

    // 3️⃣ Platform-specific payload
    if (platform === "web") {
      message.webpush = {
        headers: { Urgency: "high" },
        notification: {
          icon: "https://trendkari.in/icons/icon-192.png",
        },
        fcmOptions: {
          link: "https://trendkari.in",
        },
      };
    }

    if (platform === "android") {
      message.android = {
        priority: "high",
        notification: {
          channelId: "default_channel",
          sound: "default",
        },
      };
    }

    // 4️⃣ Send broadcast
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log("📢 Broadcast:", response.successCount, "sent");

    // 5️⃣ Cleanup invalid tokens
    const invalidTokens = [];

    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const code = resp.error?.code;
        if (
          code === "messaging/invalid-registration-token" ||
          code === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[idx].token);
        }
      }
    });

    if (invalidTokens.length) {
      await NotificationToken.updateMany(
        { token: { $in: invalidTokens } },
        { isValid: false }
      );
    }

    res.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });

  } catch (error) {
    console.error("❌ Broadcast error:", error);
    res.status(500).json({ success: false });
  }
};
