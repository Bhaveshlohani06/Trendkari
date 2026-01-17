import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/usermodel.js";
import { sendEmail } from "../utils/emailService.js";
import { getRashiFromName } from "../utils/zodiacsign.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || "Google User",
            email: profile.emails?.[0]?.value || "",
            avatar: profile.photos?.[0]?.value || "",
            zodiacSign: getRashiFromName(profile.displayName || "User"),
          });

          if (user.email) {
            await sendEmail(
              user.email,
              "🎉 Welcome to Trendkari!",
              `<h3>Welcome ${user.name} 👋</h3><p>Thanks for joining Trendkari 🚀</p>`
            );
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
