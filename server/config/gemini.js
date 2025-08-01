// import { GoogleGenAI } from "@google/genai";

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GEMINI_API_KEY});

// async function main(prompt) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });
//   console.log(response.text);
// }

// export default main;


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

export default main;

