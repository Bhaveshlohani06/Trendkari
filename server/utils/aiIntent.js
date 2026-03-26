import main from "../config/gemini.js"; 

export const detectIntent = async (query) => {
  const prompt = `
You are an AI intent classifier for a content app.

Classify the user's query into one of these intents:
- "horoscope"
- "market"
- "weather"
- "news"
- "search"

Also extract city if present.

Query: "${query}"

Respond ONLY in JSON:

{
  "intent": "one of the above",
  "city": "city name or null"
}
`;

  const resp = await main(prompt);

  try {
    const json = JSON.parse(resp);
    return json;
  } catch (err) {
    const match = resp.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);

    return { intent: "search", city: null };
  }
};