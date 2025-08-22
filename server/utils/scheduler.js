import cron from "node-cron";
import UserPreferences from "../models/UserPreferences.js";
import { generatePersonalPost } from "../services/geminiService.js";
import DailyPost from "../models/DailyPost.js";

/**
 * Run this after server starts. For testing use a cron like "*
 */

export function startScheduler() {
  // Example: every day at 06:00 server time
  cron.schedule("0 6 * * *", async () => {
    const users = await UserPreferences.find({ frequency: "daily" });
    for (const u of users) {
      try {
        const json = await generatePersonalPost({ name: u.name || "friend", prefs: u });
        await DailyPost.create({ userId: u.userId, ...json, generatedAt: new Date() });
      } catch (e) { console.error("job error", e); }
    }
  });
}
