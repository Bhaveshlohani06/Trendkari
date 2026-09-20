
//   import admin from "firebase-admin";
// import NotificationToken from "../models/NotificationToken.js";

// export const broadcastPush = async ({
//   title,
//   body,
//   platform = "web",
//   link = "https://trendkari.in",
// }) => {
//   if (!title || !body) return;

//   console.log("Broadcasting push notification:", {
//     title,
//     body,
//     platform,
//     link,
//   });

//   const tokens = await NotificationToken.find(
//     { isValid: true, platform },
//     { token: 1, _id: 0 }
//   ).lean();

//   if (!tokens.length) return;

//   const message = {
//     tokens: tokens.map(t => t.token),
//     notification: { title, body },
//     data: {
//       link,
//       type: "post",
//     },
//   };

//   if (platform === "web") {
//     message.webpush = {
//       headers: { Urgency: "high" },
//       notification: {
//         icon: "https://trendkari.in/icons/icon-192.png",
//       },
//       fcmOptions: { link },
//     };
//   }

// const response = await admin.messaging().sendEachForMulticast(message);

// response.responses.forEach(async (resp, index) => {
//   if (!resp.success) {
//     const failedToken = tokens[index].token;

//     console.error(
//       "Invalid token:",
//       failedToken,
//       resp.error?.code
//     );

//     await NotificationToken.updateOne(
//       { token: failedToken },
//       { isValid: false }
//     );
//   }
// });

// console.log(
//   `Push sent: ${response.successCount} success, ${response.failureCount} failed`
// );

// };
 

// import admin from "firebase-admin";
// import NotificationToken from "../models/NotificationToken.js";

// export const broadcastPush = async ({
//   title,
//   body,
//   slug,
//   link,
//   image,
// }) => {
//   if (!title || !body) return;

//   // Determine target URL for web and Android deep-linking
//   const targetUrl = slug
//     ? `https://www.trendkari.in/news/${slug}`
//     : link || "https://www.trendkari.in";

//   console.log("📢 Broadcasting push notification:", {
//     title,
//     body,
//     targetUrl,
//   });

//   // 1. FIX: Find ALL valid tokens across both 'web' and 'android' platforms
//   const tokenDocs = await NotificationToken.find(
//     { isValid: true },
//     { token: 1, _id: 0 }
//   ).lean();

//   if (!tokenDocs.length) {
//     console.log("⚠️ No active notification tokens found in database.");
//     return;
//   }

//   const tokens = tokenDocs.map((t) => t.token);

//   // 2. Multicast Payload compatible with both Web and Android
//   const message = {
//     tokens: tokens,
//     notification: {
//       title,
//       body,
//       imageUrl: image || undefined,
//     },
//     data: {
//       title,
//       body,
//       // FIX: Matches intent.getStringExtra("target_url") in your MainActivity.java
//       target_url: targetUrl, 
//       link: targetUrl,
//       type: "post",
//     },
//     // Webpush configuration
//     webpush: {
//       headers: { Urgency: "high" },
//       notification: {
//         icon: "https://www.trendkari.in/icons/icon-192.png",
//       },
//       fcmOptions: { link: targetUrl },
//     },
//     // Android configuration
//     android: {
//       priority: "high",
//       notification: {
//         sound: "default",
//         channelId: "default_channel_id",
//       },
//     },
//   };

//   // 3. Send Multicast
//   try {
//     const response = await admin.messaging().sendEachForMulticast(message);

//     // 4. Batch cleanup for invalid/expired tokens
//     if (response.failureCount > 0) {
//       const invalidTokens = [];

//       response.responses.forEach((resp, index) => {
//         if (!resp.success) {
//           const errorCode = resp.error?.code;
//           console.error(`❌ Failed token [${tokens[index]}]:`, errorCode);

//           if (
//             errorCode === "messaging/invalid-registration-token" ||
//             errorCode === "messaging/registration-token-not-registered"
//           ) {
//             invalidTokens.push(tokens[index]);
//           }
//         }
//       });

//       if (invalidTokens.length > 0) {
//         await NotificationToken.updateMany(
//           { token: { $in: invalidTokens } },
//           { isValid: false }
//         );
//         console.log(`🧹 Marked ${invalidTokens.length} expired tokens as invalid.`);
//       }
//     }

//     console.log(
//       `✅ Push sent: ${response.successCount} success, ${response.failureCount} failed`
//     );
//   } catch (error) {
//     console.error("❌ Critical error during broadcastPush execution:", error);
//   }
// };



import admin from "firebase-admin";
import NotificationToken from "../models/NotificationToken.js";

export const broadcastPush = async ({ title, body, slug, link, image }) => {
  if (!title || !body) return;

  const targetUrl = slug
    ? `https://www.trendkari.in/news/${slug}`
    : link || "https://www.trendkari.in";

  // Query all active devices across both Android & Web
  const tokenDocs = await NotificationToken.find(
    { isValid: true },
    { token: 1, _id: 0 }
  ).lean();

  if (!tokenDocs.length) {
    console.log("⚠️ No active tokens found in database.");
    return;
  }

  const tokens = tokenDocs.map((t) => t.token);

  const message = {
    tokens: tokens,
    notification: {
      title,
      body,
      imageUrl: image || undefined,
    },
    data: {
      title,
      body,
      target_url: targetUrl,
      type: "post",
    },
    android: {
      priority: "high",
      notification: {
        sound: "default",
        channelId: "default_channel_id",
      },
    },
    webpush: {
      headers: { Urgency: "high" },
      fcmOptions: { link: targetUrl },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ Push sent: ${response.successCount} success, ${response.failureCount} failed`);

    // Only mark tokens invalid if FCM explicitly responds with uninstalled/dead token codes
    if (response.failureCount > 0) {
      const deadTokens = [];

      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === "messaging/invalid-registration-token" ||
            errCode === "messaging/registration-token-not-registered"
          ) {
            deadTokens.push(tokens[index]);
          }
        }
      });

      if (deadTokens.length > 0) {
        await NotificationToken.updateMany(
          { token: { $in: deadTokens } },
          { $set: { isValid: false } }
        );
        console.log(`🧹 Marked ${deadTokens.length} uninstalled tokens as invalid.`);
      }
    }
  } catch (err) {
    console.error("❌ Broadcast Push Error:", err);
  }
};