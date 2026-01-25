// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// import { getMessaging, onMessage } from "firebase/messaging";

// import React from "react";
// import { toast as showToast } from "react-hot-toast";

// firebase.initializeApp({
//  apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
//   authDomain: "trendkari-22b1a.firebaseapp.com",
//   projectId: "trendkari-22b1a",
//   storageBucket: "trendkari-22b1a.firebasestorage.app",
//   messagingSenderId: "610336192946",
//   appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
//   measurementId: "G-HMS0TBEYNP"
// });

// // const messaging = firebase.messaging();

// // messaging.onBackgroundMessage(payload => {
// //   const title = payload.notification?.title || "Trendkari";

// //   self.registration.showNotification(title, {
// //     body: payload.notification?.body || "New update",
// //     icon: "/icon-192.png",
// //     data: payload.data || {},
// //     requireInteraction: true
// //   });
// // });


// export const messaging = getMessaging(firebaseApp);

// onMessage(messaging, (payload) => {
//   console.log("🔔 Foreground message:", payload);

//   // Show custom notification
//   showToastNotification(
//     payload.notification?.title,
//     payload.notification?.body
//   );
// });



// self.addEventListener("notificationclick", event => {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow(event.notification.data?.link || "/")
//   );
// });




// const showToastNotification = (title, body) => {
//   toast(
//     <div>
//       <strong>{title}</strong>
//       <p>{body}</p>
//     </div>
//   );
// };





/* firebase-messaging-sw.js */

importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
  authDomain: "trendkari-22b1a.firebaseapp.com",
  projectId: "trendkari-22b1a",
  storageBucket: "trendkari-22b1a.firebasestorage.app",
  messagingSenderId: "610336192946",
  appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
});

const messaging = firebase.messaging();

/**
 * 🔔 BACKGROUND NOTIFICATIONS
 */
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Background message:", payload);

  const notificationTitle =
    payload.notification?.title || "Trendkari";

  const notificationOptions = {
    body: payload.notification?.body || "New update",
    icon: "/icon-192.png",
    data: payload.data || {},
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

/**
 * 👉 Notification click handling
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = event.notification.data?.link || "/";

  event.waitUntil(
    clients.openWindow(link)
  );
});
