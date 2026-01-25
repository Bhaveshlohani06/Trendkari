import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import API from "../utils/api";


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


export const requestNotificationPermission = async (user) => {
  try {
    if (!("Notification" in window)) return null;

    if (Notification.permission === "denied") {
      console.warn("Notifications denied — guide user to settings");
      return null;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) return null;

    await API.post("/notifications/register", {
      token,
      city: user?.city || "Kota",
      platform: "web",
      appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
    });

    return token;

  } catch (err) {
    console.error("FCM error:", err);
    return null;
  }
};


