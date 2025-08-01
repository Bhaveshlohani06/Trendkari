import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, 
            lowercase: true,
        },
        password: {
            type: String,
            required: false,
            minlenght: 6,
        },
        googleId: {
            type: String,
            required: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        bio: {
            type: String,
            trim: true,
            default: '',
        },
        avatar: {
            type: String, 
            default: '', 
        },
        isSubscribed: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },

        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },


    },
    { timestamps: true }
);

export default mongoose.model('user', userSchema);
