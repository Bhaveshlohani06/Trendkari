
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

async function main(prompt) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", // fallback to supported model
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.text; // Check if this works, may vary by version
    console.log("Generated content:", text);
    return text || '';
    
  } catch (err) {
    console.error("Error in Gemini main():", err);
    return '';
  }
}




/**
 * Generate a personalized daily blog post as structured JSON.
 * The prompt instructs Gemini to return JSON only so parsing is easy.
 */
export async function   generatePersonalPost({ name, prefs, zodiacSign, extraContext = "" }) {
   const prompt = `
You are an expert astrologer.
Generate today's personalized horoscope for ${name} (Zodiac: ${zodiacSign}).

Output STRICT valid JSON with this shape:

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



  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash", // choose model appropriate for cost/quality
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });

  // response.text usually contains the model output
  const text = resp?.text || resp;
  // Try to parse JSON safely
  try {
    return JSON.parse(text);
  } catch (err) {
    // attempt to extract JSON substring if model wrapped in markdown or text
    const m = text.match(/(\{[\s\S]*\})/m);
    if (m) return JSON.parse(m[1]);
    // fallback: return plain text inside content
return {
  title: "Preview",
  summary: { english: text, hindi: "" },
  sections: [{ heading: "", text: { english: "", hindi: "" } }],
  tags: [],
  seo: {}
};  }
}






export default main;

