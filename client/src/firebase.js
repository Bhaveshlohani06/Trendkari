import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
  authDomain: "trendkari-22b1a.firebaseapp.com",
  projectId: "trendkari-22b1a",
  storageBucket: "trendkari-22b1a.firebasestorage.app",
  messagingSenderId: "610336192946",
  appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
  measurementId: "G-HMS0TBEYNP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// CAPTCHA (required by Firebase)
export const setUpRecaptcha = (number) => {
  const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  return signInWithPhoneNumber(auth, number, recaptcha);
};



// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

// Ask permission & get token
// export const requestNotificationPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.log("Notification permission denied");
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: "import.meta.env.VITE_FIREBASE_VAPID_KEY",
//     });

//     console.log(
//   "VAPID KEY VALUE:",
//   import.meta.env.VITE_FIREBASE_VAPID_KEY,
//   typeof import.meta.env.VITE_FIREBASE_VAPID_KEY,
//   import.meta.env.VITE_FIREBASE_VAPID_KEY?.length
// );

//     console.log("FCM Token:", token);
//     return token;
//   } catch (error) {
//     console.error("FCM error:", error);
//     return null;
//   }
// };


// Ask permission & get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    console.log(
      "VAPID KEY VALUE:",
      import.meta.env.VITE_FIREBASE_VAPID_KEY,
      typeof import.meta.env.VITE_FIREBASE_VAPID_KEY,
      import.meta.env.VITE_FIREBASE_VAPID_KEY?.length
    );

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    console.log("✅ FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ FCM error:", error);
    return null;
  }
};
