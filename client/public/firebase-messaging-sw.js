importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
 apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
  authDomain: "trendkari-22b1a.firebaseapp.com",
  projectId: "trendkari-22b1a",
  storageBucket: "trendkari-22b1a.firebasestorage.app",
  messagingSenderId: "610336192946",
  appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
  measurementId: "G-HMS0TBEYNP"
});

    

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) { 
//   console.log("Background message received:", payload);

//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/logo.png",
//   });
// });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const title = payload.notification?.title || "Trendkari";
  const options = {
    body: payload.notification?.body || "New update",
    icon: payload.notification?.icon || "/icon-192.png",
    requireInteraction: true
  };

  self.registration.showNotification(title, options);
});
