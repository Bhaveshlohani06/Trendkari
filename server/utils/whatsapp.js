import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendWhatsAppOTP(mobile, otp) {
    try {
        const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

        await axios.post(
            url,
            {
                messaging_product: "whatsapp",
                to: `91${mobile}`,
                type: "text",
                text: { body: `Your Trendkari OTP is ${otp}` }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("OTP sent via WhatsApp");
        return true;

    } catch (error) {
        console.error("WhatsApp OTP error:", error.response?.data || error.message);
        return false;
    }
}
