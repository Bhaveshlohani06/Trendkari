import usermodel from '../models/usermodel.js';
import { sendWhatsAppOTP } from "../utils/whatsapp.js";

//Send OTP to mobile number

export async function sendOtp(req, res) {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ error: "Mobile required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await usermodel.findOne({ mobile });

        if (!user) {
            user = await usermodel.create({ mobile });
        }

        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        await sendWhatsAppOTP(mobile, otp);

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send OTP" });
    }
}

//Verify OTP for mobile number

export async function verifyOtp(req, res) {
    try {
        const { mobile, otp } = req.body;

        const user = await usermodel.findOne({ mobile });
        if (!user) return res.status(400).json({ error: "User not found" });

        if (!user.otp || user.otp !== otp)
            return res.status(400).json({ error: "Invalid OTP" });

        if (user.otpExpiry < Date.now())
            return res.status(400).json({ error: "OTP expired" });

        user.isMobileVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.json({
            message: "OTP verified successfully",
            userId: user._id,
            token: "generate-jwt-here"
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to verify OTP" });
    }
}
