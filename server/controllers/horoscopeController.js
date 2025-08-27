import User from "../models/usermodel.js";
import DailyPost from "../models/Horoscope.js";
import { generatePersonalPost } from "../config/gemini.js";
import { getRashiFromName } from "../utils/zodiacsign.js";


/**
 * Generate a new horoscope immediately for a user (manual/admin use)
 * Expects: userId in req.body or req.params
 */
  export const generateNow = async (req, res) => {
    try {
      const userId = req.body.userId || req.params.userId;
      if (!userId) return res.status(400).json({ error: "userId is required" });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Calculate Nakshatra / Zodiac
      const zodiac = getRashiFromName(user.name);
      if (!zodiac) {
    zodiac = { english: "General", hindi: "सामान्य" }; 
  }

      // Generate horoscope text/content via Gemini/OpenAI
      const json = await generatePersonalPost({
        name: user.name,
        zodiacSign: zodiac.english,
        prefs: user.preferences || {
          tone: "friendly",
          language: "english",
          wordCount: 250,
          categories: ["love", "career", "health"]
        }
      });

      // Save in DB
      const post = await DailyPost.create({
        userId: user._id,
        zodiac,
              summary: json.summary,
  sections: json.sections,
  lucky: json.lucky,
  title: json.title,
  seo: json.seo,
  tags: json.tags,
        generatedAt: new Date()
      });

      res.json({ ok: true, post });
    } catch (err) {
      console.error("Error in generateNow:", err);
      res.status(500).json({ error: err.message });
    }
  };

/*  *
 * Get today's horoscope for the logged-in user
 * If not found, it generates one automatically
 */
export const getTodaysHoroscope = async (req, res) => {
  try {
    const userId = req.user?._id; 
    if (!userId) return res.status(400).json({ error: "User not logged in" });

    // Define UTC safe range for today
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Try fetching today's post
    let post = await DailyPost.findOne({
      userId,
      generatedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!post) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const zodiac = getRashiFromName(user.name);

      const json = await generatePersonalPost({
        name: user.name,
        zodiacSign: zodiac.english,
        prefs: user.preferences || {
          tone: "friendly",
          language: "english",
          wordCount: 250,
          categories: ["love", "career", "health"]
        }
      });

      post = await DailyPost.create({
        userId,
        zodiac,
        summary: json.summary,
  sections: json.sections,
  lucky: json.lucky,
  title: json.title,
  seo: json.seo,
  tags: json.tags,
        generatedAt: new Date()
      });
    }

    res.json(post);
  } catch (err) {
    console.error("Error in getTodaysHoroscope:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all horoscopes for a user (admin/debug use)
 * Useful if you want to show history of daily posts
 */
export const getUserHoroscopes = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const posts = await DailyPost.find({ userId }).sort({ generatedAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error in getUserHoroscopes:", err);
    res.status(500).json({ error: err.message });
  }
};
