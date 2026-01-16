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
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      console.log("No FCM token generated");
      return null;
    }

    console.log("✅ FCM Token:", token);

    // ✅ USING YOUR API UTILS
    await API.post("/notifications/register", {
      token,
      userId: user?._id || null,
      city: user?.city || "Kota",
      platform: "web",
    });

    console.log("✅ Token saved to backend");

    return token;
  } catch (error) {
    console.error("❌ FCM error:", error);
    return null;
  }
};


