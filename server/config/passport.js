// Import required modules
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/usermodel.js";
import { sendEmail } from "../utils/emailService.js";
import { getRashiFromName } from "../utils/zodiacsign.js";

// Load environment variables
dotenv.config();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 🔍 Check existing user
        let user = await User.findOne({ googleId: profile.id });

        // 🆕 Create user if not exists
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || "Google User",
            email: profile.emails?.[0]?.value || "",
            avatar: profile.photos?.[0]?.value || "",
            zodiacSign: getRashiFromName(profile.displayName || "User"),
          });

          // 📧 Welcome Email
          const subject = "🎉 Welcome to Trendkari!";
          const html = `
            <h2>Hello ${user.name},</h2>
            <p>Welcome to <strong>Trendkari</strong> – Your daily dose of viral trends 🚀</p>
            <p>We’re thrilled to have you on board!</p>
            <p>Explore trends, share what you love, and stay ahead in pop culture.</p>
            <br>
            <p>Cheers,</p>
            <p><strong>Team Trendkari</strong></p>
          `;

          if (user.email) {
            await sendEmail(user.email, subject, html);
          }
        }

        // ✅ Success
        return done(null, user);
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
