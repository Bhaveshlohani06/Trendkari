// src/notifications.js
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase.js";

export function initForegroundNotifications() {
  onMessage(messaging, payload => {
    const { title, body } = payload.notification || {};

    new Notification(title || "Trendkari", {
      body,
      icon: "/icon-192.png"
    });
  });
}
