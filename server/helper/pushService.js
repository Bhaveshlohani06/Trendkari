
  import admin from "firebase-admin";
import NotificationToken from "../models/NotificationToken.js";

export const broadcastPush = async ({
  title,
  body,
  platform = "web",
  link = "https://trendkari.in",
}) => {
  if (!title || !body) return;

  console.log("Broadcasting push notification:", {
    title,
    body,
    platform,
    link,
  });

  const tokens = await NotificationToken.find(
    { isValid: true, platform },
    { token: 1, _id: 0 }
  ).lean();

  if (!tokens.length) return;

  const message = {
    tokens: tokens.map(t => t.token),
    notification: { title, body },
    data: {
      link,
      type: "post",
    },
  };

  if (platform === "web") {
    message.webpush = {
      headers: { Urgency: "high" },
      notification: {
        icon: "https://trendkari.in/icons/icon-192.png",
      },
      fcmOptions: { link },
    };
  }

  return admin.messaging().sendEachForMulticast(message);
};
 