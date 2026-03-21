import dotenv from "dotenv";
//import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
 

dotenv.config();

//const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
//const model = genAI.getGenerativeModel({ model: "models/gemini-pro" }); 

//const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const models = await ai.models.list();

// Get today's date in a nice format
function getTodayDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// async function main(prompt) {
//   try {
//     const result = await model.generateContent(prompt);

//     // const text = result.response.candidates[0].content.parts[0].text;
//        const text = await result.response.text();

//     console.log("Generated content:", text);
//     return text || "";
//   } catch (err) {
//     console.error("Error in Gemini main():", err);
//     return "";
//   }
// }

// async function main(prompt) {
//   try {
//     const result = await model.generateContent(prompt);

//     console.log("Full Gemini response:", JSON.stringify(result, null, 2));

//     let text = "";

//     // Try modern method
//     if (result?.response?.text) {
//       text = await result.response.text();
//     }

//     // Fallback to old structure
//     if (!text && result?.response?.candidates?.length > 0) {
//       text = result.response.candidates[0]?.content?.parts
//         ?.map(p => p.text)
//         ?.join("") || "";
//     }

//     if (!text) {
//       console.error("No text generated from Gemini response");
//     }

//     return text;

//   } catch (err) {
//     console.error("Error in Gemini main():", err);
//     return "";
//   }
// }


// export async function main(prompt) {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-1.5-flash", // this WILL work here
//       contents: prompt,
//     });

//     console.log("Gemini response:", response.text);

//     return response.text || "";
//   } catch (err) {
//     console.error("Gemini ERROR:", err);
//     return "";
//   }
// }

export async function main(prompt) {
  try {

    // console.dir(models, { depth: null });

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    console.log("TEXT:", response.text);
    
    return response.text || "";
  } catch (err) {
    console.error("Gemini ERROR:", err);
    return "";
  }
}

export async function generatePersonalPost({ name, prefs, zodiacSign, extraContext = "" }) {
    const todayDate = getTodayDate();

  const prompt = `
आप एक अनुभवी ज्योतिषी हैं जो वैदिक ज्योतिष और आधुनिक दृष्टिकोण को मिलाकर भविष्यवाणी करते हैं।

${name} (राशि: ${zodiacSign}) के लिए "${todayDate}" का दैनिक राशिफल तैयार करें।

नियम:
- कुल कंटेंट 80–120 शब्दों के बीच रखें
- भाषा सरल,सकारात्मक, स्पष्ट और प्रभावशाली हो
- सामान्य बातें (जैसे “आज आपका दिन अच्छा रहेगा”) से बचें
- आज के ग्रह/ऊर्जा का हल्का संदर्भ दें (जैसे चंद्रमा, ग्रह स्थिति)
- एक खास और थोड़ा अलग/चौंकाने वाला insight शामिल करें

आउटपुट में शामिल करें:
1. 2–3 लाइन का सार (summary)
2. एक मुख्य सलाह (advice)
3. एक महत्वपूर्ण संकेत (insight – प्यार/करियर/पैसा/स्वास्थ्य में से कोई)
4. लकी रंग और लकी नंबर
5. टोन थोड़ा रहस्यमयी लेकिन व्यावहारिक रखें।

सिर्फ JSON में उत्तर दें:

{
  "summary": string,
  "advice": string,
  "insight": string,
  "lucky": {
    "color": string,
    "number": number
  }
}
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
