// Import required modules
import passport from 'passport';
import dotenv from 'dotenv';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/usermodel.js'; 
import { sendEmail } from '../utils/emailService.js';

// Load environment variables
dotenv.config();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,

},


async (accessToken, refreshToken, profile, done) => {    

    try {
        // Find user in database by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
            });

            await user.save();

             
        }

        return done(null, user); // Log in user
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize user (for session)
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
