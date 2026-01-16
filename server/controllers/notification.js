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
    console.log("📥 Register token hit");

    const { token, city, area, platform = "web" } = req.body;

    if (!token || !city) {
      return res.status(400).json({
        success: false,
        message: "token and city are required"
      });
    }

    await NotificationToken.findOneAndUpdate(
      { token },
      {
        token,
        city,
        area,
        platform,
        isActive: true,
        lastUsedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log("✅ Token saved:", token.slice(0, 25));

// 🧪 HARD SAVE FOR TESTING

    const doc = new NotificationToken({
  token,
  city,
  area,
  platform
});

await doc.save();

console.log("🧪 HARD SAVE DONE");

    res.status(200).json({
      success: true,
      message: "Notification token registered"
    });

  } catch (error) {
    console.error("🔥 Register token error:", error);
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
        notification: {
          icon: "https://trendkari.in/icons/icon-192.png",
          badge: "https://trendkari.in/icons/icon-192.png"
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
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "title and body required"
      });
    }

    // 1️⃣ Fetch all active tokens
    const tokensData = await NotificationToken.find(
      { isActive: true },
      { token: 1, _id: 0 }
    );

    const tokens = tokensData.map(t => t.token);

    if (tokens.length === 0) {
      return res.json({
        success: true,
        message: "No active users"
      });
    }

    // 2️⃣ Create multicast message
    const message = {
      tokens,
      notification: {
        title,
        body
      },
      webpush: {
        notification: {
          icon: "https://trendkari.in/icons/icon-192.png",
          badge: "https://trendkari.in/icons/icon-192.png",
          requireInteraction: true
        },
        fcmOptions: {
          link: "https://trendkari.in"
        }
      }
    };

    // 3️⃣ Send push
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log("📢 Broadcast result:", response.successCount);

    // 4️⃣ Cleanup invalid tokens
    response.responses.forEach(async (resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;

        if (
          errorCode === "messaging/invalid-registration-token" ||
          errorCode === "messaging/registration-token-not-registered"
        ) {
          await NotificationToken.updateOne(
            { token: tokens[idx] },
            { isActive: false }
          );
        }
      }
    });

    res.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount
    });

  } catch (error) {
    console.error("❌ Broadcast error:", error);
    res.status(500).json({ success: false });
  }
};