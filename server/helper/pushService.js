
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

const response = await admin.messaging().sendEachForMulticast(message);

response.responses.forEach(async (resp, index) => {
  if (!resp.success) {
    const failedToken = tokens[index].token;

    console.error(
      "Invalid token:",
      failedToken,
      resp.error?.code
    );

    await NotificationToken.updateOne(
      { token: failedToken },
      { isValid: false }
    );
  }
});

console.log(
  `Push sent: ${response.successCount} success, ${response.failureCount} failed`
);

};
 