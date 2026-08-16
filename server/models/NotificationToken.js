import mongoose from "mongoose";

/**
 * CHANGES FROM YOUR EXISTING MODEL:
 * - Added `user` (ObjectId ref) — subscriptions must be tied to an
 *   authenticated user so the Sidebar can ask "is push on for me".
 * - Added `deviceId` — a stable per-browser id (generated client-side,
 *   stored in localStorage) so the same user can have one active
 *   subscription per device/browser without collisions, and so a
 *   rotated FCM token updates the SAME row instead of creating a new one.
 * - Kept `isValid` as the single source of truth for active/inactive
 *   (your controller was writing to a nonexistent `isActive` field —
 *   fixed in the controller instead of adding a duplicate field here).
 */
const NotificationTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },

    // Client-generated persistent id (crypto.randomUUID, stored in
    // localStorage) identifying this specific browser/device.
    deviceId: { type: String, index: true },

    platform: {
      type: String,
      enum: ["web", "android"],
      required: true,
      default: "web",
    },

    city: String,
    area: String,
    appVersion: String,
    userAgent: String,

    isValid: { type: Boolean, default: true },
    lastSeenAt: Date,
  },
  { timestamps: true }
);

// Fast lookup for "does this user+device have an active subscription".
NotificationTokenSchema.index({ user: 1, deviceId: 1 });
NotificationTokenSchema.index({ user: 1, isValid: 1 });

export default mongoose.model("NotificationToken", NotificationTokenSchema);
