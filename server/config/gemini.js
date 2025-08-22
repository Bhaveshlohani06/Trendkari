
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
You are an expert astrologer and content writer. 
Create a personalized today's horoscope for ${name} (Zodiac Sign: ${zodiacSign}).

Output MUST be valid JSON only with the following keys:
{
  "title": string,
  "summary": string,
  "sections": [
    {"heading": string, "text": string}
  ],
  "tags": [string],
  "seo": {
    "metaTitle": string,
    "metaDescription": string
  }
}

Tone: ${prefs.tone}. 
Language: ["english", "hindi"]. 
Max words: ${prefs.wordCount}. 
  
User interests: ${prefs.categories.join(", ")}.
Extra context: ${extraContext}.

Return only JSON (no commentary).
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
    return { title: "Preview", summary: text, sections: [{heading:"", text}], tags: [], seo:{} };
  }
}


export default main;

