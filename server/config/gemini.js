import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

//const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    

// Get today's date in a nice format
function getTodayDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

async function main(prompt) {
  try {
    const result = await model.generateContent(prompt);

    // const text = result.response.candidates[0].content.parts[0].text;
       const text = await result.response.text();

    console.log("Generated content:", text);
    return text || "";
  } catch (err) {
    console.error("Error in Gemini main():", err);
    return "";
  }
}

export async function generatePersonalPost({ name, prefs, zodiacSign, extraContext = "" }) {
    const todayDate = getTodayDate();

  const prompt = `
You are an expert astrologer with deep knowledge of Vedic + Western astrology, numerology, and planetary transits.
Your task is to generate today's **unique, personalized, and authentic horoscope** for ${name} (Zodiac: ${zodiacSign}) "${todayDate}".

👉 STRICT DATE: Use "${todayDate}" as today's date. Do NOT use any other date.

⚡ CONTENT RULES:
- Horoscope must feel POSITIVE, NEW and DIFFERENT every day (avoid repetition).
- Incorporate **planetary influences, moon phases, lucky alignments, warnings, and hidden opportunities** for today.
- Provide **1 shocking/unexpected insight** about love, career, health, or money.
- Keep tone mystical, yet practical, giving actionable advice.
- Avoid generic filler like "you will feel happy" — instead, give **specific scenarios**.
- Each section should vary in depth, not copy-paste.

📑 OUTPUT FORMAT (STRICT JSON ONLY):

{
  "title": string,
  "summary": {
    "english": string,
    "hindi": string
  },
  "sections": [
    {
      "heading": string,
      "text": {
        "english": string,
        "hindi": string
      }
    }
  ],
  "tags": [string],
  "lucky": {
    "color": string,
    "number": number
  },
  "seo": {
    "metaTitle": string,
    "metaDescription": string
  }
}

Language: English + Hindi.
No commentary, only JSON.
`;

  const resp = await main(prompt);

  try {
    return JSON.parse(resp);
  } catch (err) {
    const m = resp.match(/(\{[\s\S]*\})/m);
    if (m) return JSON.parse(m[1]);
    return {
      title: "Error generating horoscope",
      summary: { english: "Failed to fetch from Gemini", hindi: "" },
      sections: [],
      tags: [],
      seo: {}
    };
  }
}

export default main;
