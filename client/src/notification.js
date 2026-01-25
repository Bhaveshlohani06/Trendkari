// // src/notifications.js
// import { onMessage, getToken } from "firebase/messaging";
// import { messaging } from "./firebase.js";

// export function initForegroundNotifications() {
//   onMessage(messaging, payload => {
//     const { title, body } = payload.notification || {};

//     new Notification(title || "Trendkari", {
//       body,
//       icon: "/icon-192.png"
//     });
//   });
// }


// // import { onMessage, getToken } from "firebase/messaging";
// // import API from "./utils/API";
// // import { messaging } from "./firebase.js";

// // export const requestNotificationPermission = async () => {
// //   try {
// //     if (!("Notification" in window)) {
// //       alert("Notifications not supported");
// //       return;
// //     }

// //     if (Notification.permission === "granted") {
// //       console.log("Notification already enabled");
// //       return;
// //     }

// //     const permission = await Notification.requestPermission();

// //     if (permission !== "granted") {
// //       console.log("Permission denied");
// //       return;
// //     }

// //     const token = await getToken(messaging, {
// //       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
// //     });

// //     if (token) {
// //       await API.post("/notifications/save-token", {
// //         token,
// //         platform: "web",
// //       });

// //       console.log("FCM token saved");
// //     }
// //   } catch (error) {
// //     console.error("Notification permission error:", error);
// //   }
// // };



// // import { getToken, onMessage } from "firebase/messaging";
// // import API from "./utils/api.js";         
// // import { messaging } from "./firebase.js";


// export const requestNotificationPermission = async () => {
//   try {
//     if (!("Notification" in window)) {
//       alert("Notifications not supported");
//       return;
//     }

//     if (Notification.permission === "granted") {
//       console.log("Notification already enabled");
//       return;
//     }

//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.log("Permission denied");
//       return;
//     }

//     // ✅ CORRECT WAY TO GET TOKEN
//     const token = await getToken(messaging, {
//       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
//     });

//     if (!token) {
//       console.warn("No FCM token received");
//       return;
//     }

//     await API.post("/notifications/save-token", {
//       token,
//       platform: "web",
//     });

//     console.log("FCM token saved successfully");
//   } catch (error) {
//     console.error("Notification permission error:", error);
//   }
// };



import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import API from "../utils/api.js"; // ✅ REQUIRED

/**
 * 🔔 Foreground Notifications (App is OPEN)
 */
export const initForegroundNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log("🔔 Foreground message:", payload);

    if (Notification.permission === "granted") {
      const { title, body } = payload.notification || {};

      new Notification(title || "Trendkari", {
        body: body || "New update available",
        icon: "/icon-192.png",
      });
    }
  });
};

/**
 * 🔐 Request permission + register FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return null;
    }

    if (Notification.permission === "denied") {
      console.warn("Notification permission denied");
      return null;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      console.warn("No FCM token received");
      return null;
    }

    await API.post("/notifications/save-token", {
      token,
      platform: "web",
    });

    console.log("✅ FCM token saved:", token);
    return token;

  } catch (error) {
    console.error("❌ Notification setup failed:", error);
    return null;
  }
};
