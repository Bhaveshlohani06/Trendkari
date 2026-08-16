// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { getMessaging, getToken } from "firebase/messaging";
// import API from "../utils/api";


// const firebaseConfig = {
//   apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
//   authDomain: "trendkari-22b1a.firebaseapp.com",
//   projectId: "trendkari-22b1a",
//   storageBucket: "trendkari-22b1a.firebasestorage.app",
//   messagingSenderId: "610336192946",
//   appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
//   measurementId: "G-HMS0TBEYNP"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// // CAPTCHA (required by Firebase)
// export const setUpRecaptcha = (number) => {
//   const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
//     size: "invisible",
//   });

//   return signInWithPhoneNumber(auth, number, recaptcha);
// };



// // Initialize Firebase Cloud Messaging
// export const messaging = getMessaging(app);


// export const requestNotificationPermission = async (user) => {
//   try {
//     if (!("Notification" in window)) return null;

//     if (Notification.permission === "denied") {
//       console.warn("Notifications denied — guide user to settings");
//       return null;
//     }

//     if (Notification.permission === "default") {
//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
//     });

//     if (!token) return null;

//     await API.post("/notifications/register", {
//       token,
//       city: user?.city || "Kota",
//       platform: "web",
//       appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
//     });

//     return token;

//   } catch (err) {
//     console.error("FCM error:", err);
//     return null;
//   }
// };



// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import {
//   getMessaging,
//   getToken,
//   deleteToken,
//   isSupported,
// } from "firebase/messaging";
// import API from "../utils/api";
 
// const firebaseConfig = {
//   apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
//   authDomain: "trendkari-22b1a.firebaseapp.com",
//   projectId: "trendkari-22b1a",
//   storageBucket: "trendkari-22b1a.firebasestorage.app",
//   messagingSenderId: "610336192946",
//   appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
//   measurementId: "G-HMS0TBEYNP",
// };
 
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
 
// // CAPTCHA (required by Firebase)
// export const setUpRecaptcha = (number) => {
//   const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
//     size: "invisible",
//   });
 
//   return signInWithPhoneNumber(auth, number, recaptcha);
// };
 
// /* =====================================================================
//  * PUSH NOTIFICATIONS
//  * ===================================================================== */
 
// // FIX: getMessaging(app) used to run unconditionally at module load.
// // On any browser without FCM/service-worker support this throws
// // immediately on import — and since `auth` (OTP login) lives in this
// // same file, that could take down phone login too. Now it's lazy and
// // guarded by isSupported().
// let _messaging = null;
// let _messagingChecked = false;
 
// async function getMessagingInstance() {
//   if (_messagingChecked) return _messaging;
//   _messagingChecked = true;
 
//   try {
//     const supported = await isSupported();
//     if (!supported) return null;
//     _messaging = getMessaging(app);
//     return _messaging;
//   } catch (err) {
//     console.warn("FCM not supported in this environment:", err);
//     return null;
//   }
// }
 
// /**
//  * Stable per-browser id. Generated once, persisted in localStorage,
//  * used to tie a push subscription to "this device" for a user so we
//  * can support multiple devices per user and know which one to
//  * enable/disable from the Sidebar.
//  */
// export function getDeviceId() {
//   const KEY = "tk_device_id";
//   let id = localStorage.getItem(KEY);
//   if (!id) {
//     id =
//       crypto.randomUUID?.() ??
//       `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
//     localStorage.setItem(KEY, id);
//   }
//   return id;
// }
 
// export function isPushSupported() {
//   return (
//     "Notification" in window &&
//     "serviceWorker" in navigator &&
//     "PushManager" in window
//   );
// }
 
// export function getPermissionState() {
//   if (!("Notification" in window)) return "unsupported";
//   return Notification.permission; // 'granted' | 'denied' | 'default'
// }
 
// /**
//  * Registers the FCM service worker explicitly (rather than relying on
//  * firebase's implicit auto-registration), so we always know exactly
//  * which registration getToken() is using.
//  */
// async function registerServiceWorker() {
//   return navigator.serviceWorker.register("/firebase-messaging-sw.js");
// }
 
// /**
//  * Full enable flow: permission -> service worker -> FCM token ->
//  * backend. Call this from the Sidebar's "Enable Notifications" button.
//  *
//  * @param {{ city?: string }} user
//  * @returns {Promise<{ success: boolean, reason?: string }>}
//  */
// export async function subscribeToPush(user) {
//   if (!isPushSupported()) {
//     return { success: false, reason: "unsupported" };
//   }
 
//   try {
//     if (Notification.permission === "denied") {
//       return { success: false, reason: "denied" };
//     }
 
//     if (Notification.permission === "default") {
//       const permission = await Notification.requestPermission();
//       if (permission !== "granted") {
//         return {
//           success: false,
//           reason: permission === "denied" ? "denied" : "dismissed",
//         };
//       }
//     }
 
//     const messaging = await getMessagingInstance();
//     if (!messaging) return { success: false, reason: "unsupported" };
 
//     const swRegistration = await registerServiceWorker();
 
//     const token = await getToken(messaging, {
//       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
//       serviceWorkerRegistration: swRegistration,
//     });
 
//     if (!token) return { success: false, reason: "no-token" };
 
//     await API.post("/notifications/register", {
//       token,
//       deviceId: getDeviceId(),
//       city: user?.city || "Kota",
//       platform: "web",
//       appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
//     });
 
//     return { success: true };
//   } catch (err) {
//     console.error("subscribeToPush error:", err);
//     return { success: false, reason: "error" };
//   }
// }
 
// /**
//  * Full disable flow: revoke the FCM token client-side, then tell the
//  * backend to deactivate this device's subscription. Runs both steps
//  * even if one fails, and reports back so the UI doesn't get stuck in
//  * an inconsistent state.
//  */
// export async function unsubscribeFromPush() {
//   let clientOk = true;
//   let serverOk = true;
 
//   try {
//     const messaging = await getMessagingInstance();
//     if (messaging) {
//       await deleteToken(messaging);
//     }
//   } catch (err) {
//     console.warn("Could not delete client-side FCM token:", err);
//     clientOk = false;
//   }
 
//   try {
//     await API.delete("/notifications/register", {
//       data: { deviceId: getDeviceId() },
//     });
//   } catch (err) {
//     console.warn("Could not deactivate subscription on server:", err);
//     serverOk = false;
//   }
 
//   return { success: clientOk && serverOk, clientOk, serverOk };
// }
 
// /**
//  * Reconciles local + server state. Called on app startup / login and
//  * whenever the Sidebar mounts, so the toggle reflects reality instead
//  * of stale local state.
//  */
// export async function getPushSyncState() {
//   if (!isPushSupported()) {
//     return { supported: false, permission: "unsupported", subscribed: false };
//   }
 
//   const permission = Notification.permission;
 
//   if (permission !== "granted") {
//     // Permission denied or not yet asked — nothing to reconcile,
//     // and we must NOT re-prompt automatically.
//     return { supported: true, permission, subscribed: false };
//   }
 
//   try {
//     const { data } = await API.get("/notifications/status", {
//       params: { deviceId: getDeviceId() },
//     });
//     return { supported: true, permission, subscribed: !!data?.subscribed };
//   } catch (err) {
//     console.warn("getPushSyncState: status check failed:", err);
//     return { supported: true, permission, subscribed: false, error: true };
//   }
// }
 
// /**
//  * Backward-compat alias — your old `requestNotificationPermission(user)`
//  * export may still be called elsewhere (e.g. right after login). Search
//  * your codebase for that name; anywhere it's called, it now goes
//  * through the same guarded, service-worker-explicit flow as the
//  * Sidebar button.
//  */
// export const requestNotificationPermission = subscribeToPush;



import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {
  getMessaging,
  getToken,
  deleteToken,
  isSupported,
} from "firebase/messaging";
import API from "../utils/api";
 
const firebaseConfig = {
  apiKey: "AIzaSyAlmRM9AlAFrWUw7fAp1UrXyUiu8iUjet8",
  authDomain: "trendkari-22b1a.firebaseapp.com",
  projectId: "trendkari-22b1a",
  storageBucket: "trendkari-22b1a.firebasestorage.app",
  messagingSenderId: "610336192946",
  appId: "1:610336192946:web:423f3b1eedbeed7f498cab",
  measurementId: "G-HMS0TBEYNP",
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
 
/* =====================================================================
 * PUSH NOTIFICATIONS
 * ===================================================================== */
 
// FIX: getMessaging(app) used to run unconditionally at module load.
// On any browser without FCM/service-worker support this throws
// immediately on import — and since `auth` (OTP login) lives in this
// same file, that could take down phone login too. Now it's lazy and
// guarded by isSupported().
let _messaging = null;
let _messagingChecked = false;
 
async function getMessagingInstance() {
  if (_messagingChecked) return _messaging;
  _messagingChecked = true;
 
  try {
    const supported = await isSupported();
    if (!supported) return null;
    _messaging = getMessaging(app);
    return _messaging;
  } catch (err) {
    console.warn("FCM not supported in this environment:", err);
    return null;
  }
}
 
// Exported so other files (e.g. notification.js) can get the same
// guarded, singleton messaging instance instead of importing a raw
// `messaging` object that might throw on unsupported browsers.
export { getMessagingInstance };
 
/**
 * Stable per-browser id. Generated once, persisted in localStorage,
 * used to tie a push subscription to "this device" for a user so we
 * can support multiple devices per user and know which one to
 * enable/disable from the Sidebar.
 */
export function getDeviceId() {
  const KEY = "tk_device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      crypto.randomUUID?.() ??
      `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
 
export function isPushSupported() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}
 
export function getPermissionState() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission; // 'granted' | 'denied' | 'default'
}
 
/**
 * Registers the FCM service worker explicitly (rather than relying on
 * firebase's implicit auto-registration), so we always know exactly
 * which registration getToken() is using.
 */
async function registerServiceWorker() {
  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}
 
/**
 * Full enable flow: permission -> service worker -> FCM token ->
 * backend. Call this from the Sidebar's "Enable Notifications" button.
 *
 * @param {{ city?: string }} user
 * @returns {Promise<{ success: boolean, reason?: string }>}
 */
export async function subscribeToPush(user) {
  if (!isPushSupported()) {
    return { success: false, reason: "unsupported" };
  }
 
  try {
    if (Notification.permission === "denied") {
      return { success: false, reason: "denied" };
    }
 
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return {
          success: false,
          reason: permission === "denied" ? "denied" : "dismissed",
        };
      }
    }
 
    const messaging = await getMessagingInstance();
    if (!messaging) return { success: false, reason: "unsupported" };
 
    const swRegistration = await registerServiceWorker();
 
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });
 
    if (!token) return { success: false, reason: "no-token" };
 
    await API.post("/notifications/register", {
      token,
      deviceId: getDeviceId(),
      city: user?.city || "Kota",
      platform: "web",
      appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
    });
 
    return { success: true };
  } catch (err) {
    console.error("subscribeToPush error:", err);
    return { success: false, reason: "error" };
  }
}
 
/**
 * Full disable flow: revoke the FCM token client-side, then tell the
 * backend to deactivate this device's subscription. Runs both steps
 * even if one fails, and reports back so the UI doesn't get stuck in
 * an inconsistent state.
 */
export async function unsubscribeFromPush() {
  let clientOk = true;
  let serverOk = true;
 
  try {
    const messaging = await getMessagingInstance();
    if (messaging) {
      await deleteToken(messaging);
    }
  } catch (err) {
    console.warn("Could not delete client-side FCM token:", err);
    clientOk = false;
  }
 
  try {
    await API.delete("/notifications/register", {
      data: { deviceId: getDeviceId() },
    });
  } catch (err) {
    console.warn("Could not deactivate subscription on server:", err);
    serverOk = false;
  }
 
  return { success: clientOk && serverOk, clientOk, serverOk };
}
 
/**
 * Reconciles local + server state. Called on app startup / login and
 * whenever the Sidebar mounts, so the toggle reflects reality instead
 * of stale local state.
 */
export async function getPushSyncState() {
  if (!isPushSupported()) {
    return { supported: false, permission: "unsupported", subscribed: false };
  }
 
  const permission = Notification.permission;
 
  if (permission !== "granted") {
    // Permission denied or not yet asked — nothing to reconcile,
    // and we must NOT re-prompt automatically.
    return { supported: true, permission, subscribed: false };
  }
 
  try {
    const { data } = await API.get("/notifications/status", {
      params: { deviceId: getDeviceId() },
    });
    return { supported: true, permission, subscribed: !!data?.subscribed };
  } catch (err) {
    console.warn("getPushSyncState: status check failed:", err);
    return { supported: true, permission, subscribed: false, error: true };
  }
}
 
/**
 * Backward-compat alias — your old `requestNotificationPermission(user)`
 * export may still be called elsewhere (e.g. right after login). Search
 * your codebase for that name; anywhere it's called, it now goes
 * through the same guarded, service-worker-explicit flow as the
 * Sidebar button.
 */
export const requestNotificationPermission = subscribeToPush;