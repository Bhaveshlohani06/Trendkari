import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
        },

        password: {
            type: String,
            minlength: 6,
        },

        googleId: { type: String },

        mobile: {
            type: String,
            unique: true,
            sparse: true,
        },

        otp: { type: String },
        otpExpiry: { type: Date },
        isMobileVerified: { type: Boolean, default: false },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        bio: { type: String, default: '' },
        avatar: { type: String, default: '' },
        isSubscribed: { type: Boolean, default: false },

        resetPasswordToken: String,
        resetPasswordExpires: Date,

        preferences: {
            language: { type: String, default: 'english' },
            tone: { type: String, default: 'friendly' },
            categories: { type: [String], default: ['general'] },
            wordCount: { type: Number, default: 350 },
            timezone: { type: String, default: 'Asia/Kolkata' },
            frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
            dob: { type: Date },
            zodiacSign: { type: String },
        },

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
    { timestamps: true }
);

export default mongoose.model('user', userSchema);
