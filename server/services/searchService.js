// // backend/services/searchService.js
// import Post from '../models/postmodel.js';
// import User from '../models/usermodel.js';
// import Category from '../models/categorymodel.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// // Perform basic database search
// export const performBasicSearch = async (query) => {
//   try {
//     // Search in posts
//     const posts = await Post.find({
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { content: { $regex: query, $options: 'i' } },
//         { tags: { $regex: query, $options: 'i' } }
//       ],
//       status: 'published'
//     })
//     .populate('author', 'name avatar')
//     .populate('category', 'name')
//     .sort({ createdAt: -1 })
//     .limit(15);

//     // Search in users
//     const users = await User.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { bio: { $regex: query, $options: 'i' } }
//       ]
//     })
//     .select('name avatar bio followersCount')
//     .limit(8);

//     // Search in categories
//     const categories = await Category.find({
//       name: { $regex: query, $options: 'i' }
//     })
//     .limit(5);

//     return { posts, users, categories };
//   } catch (error) {
//     console.error('Search service error:', error);
//     throw error;
//   }
// };

// // Enhance search results with Gemini AI
// export const enhanceResults = async (query, searchResults) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
//     const prompt = `
//       Analyze this search query and results:
//       Query: "${query}"
//       Found ${searchResults.posts.length} posts, ${searchResults.users.length} users, ${searchResults.categories.length} categories
      
//       Provide insights in JSON format:
//       {
//         "summary": "Brief summary of what these results indicate",
//         "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
//         "category": "What category does this search belong to?",
//         "relevance": "How relevant are these results? (high/medium/low)"
//       }
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
    
//     try {
//       const jsonMatch = text.match(/\{[\s\S]*\}/);
//       return jsonMatch ? JSON.parse(jsonMatch[0]) : {
//         summary: "AI analysis unavailable",
//         suggestions: [],
//         category: "general",
//         relevance: "medium"
//       };
//     } catch {
//       return {
//         summary: "AI analysis unavailable",
//         suggestions: [],
//         category: "general",
//         relevance: "medium"
//       };
//     }
//   } catch (error) {
//     console.error('Enhancement error:', error);
//     return {
//       summary: "Enhancement temporarily unavailable",
//       suggestions: [],
//       category: "general",
//       relevance: "medium"
//     };
//   }
// };

// // Generate AI response for no results
// export const generateAIResponse = async (query) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
//     const prompt = `
//       User searched for: "${query}"
      
//       No results were found in our database. Please provide a helpful response.
//       Make it clear, informative, and actionable.
//       If it's a question, answer it directly.
//       If it's a topic, provide a good overview.
      
//       Keep the response under 500 words and well-structured.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error('AI response generation error:', error);
//     return "I couldn't find any results for your query. Please try rephrasing or be more specific.";
//   }
// };

// services/aiAnswerService.js
//
// Turns a set of search results into a short, sourced natural-language
// answer, streamed token-by-token. Provider-agnostic on purpose: swap
// streamAnthropicAnswer for a Gemini/OpenAI equivalent without touching
// the controller that calls it.
//
// Setup: set ANTHROPIC_API_KEY in your .env. Get one at
// https://console.anthropic.com — this is YOUR server's own key, separate
// from anything in the chat you used to generate this code. Without it,
// hasAIConfigured() returns false and the controller skips straight to
// plain search results — nothing breaks.

const AI_MODEL = process.env.AI_MODEL || "claude-haiku-4-5-20251001";
const MAX_CONTEXT_CHARS = 6000;

export const hasAIConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

/**
 * Turns raw search results into a compact, bounded context block for the
 * model. Keeps only what's needed to answer — full descriptions would blow
 * the context budget and slow the first token down for no benefit.
 */
export const buildContextForAI = (results) => {
  const parts = [];

  if (results.posts?.length) {
    parts.push(
      "NEWS POSTS:\n" +
        results.posts
          .slice(0, 6)
          .map(
            (p, i) =>
              `${i + 1}. "${p.title}" (category: ${p.category?.name || "News"}, ${new Date(
                p.createdAt
              ).toLocaleDateString()})${
                p.description ? ` — ${p.description.slice(0, 160)}` : ""
              }`
          )
          .join("\n")
    );
  }

  if (results.crops?.length) {
    parts.push(
      "MANDI CROP PRICES:\n" +
        results.crops
          .slice(0, 8)
          .map((c, i) => {
            const name = (c.crop_name || "").split("\n")[0].trim();
            const price = c.price_avg ? `₹${c.price_avg}/${c.unit || "quintal"}` : "price unavailable";
            const trend = c.trend ? ` (trend: ${c.trend})` : "";
            return `${i + 1}. ${name} at ${c.mandi?.name || "a mandi"}: ${price}${trend}`;
          })
          .join("\n")
    );
  }

  if (results.mandis?.length) {
    parts.push(
      "MANDIS:\n" +
        results.mandis
          .slice(0, 5)
          .map((m, i) => `${i + 1}. ${m.name} (${m.district || m.city || ""}, ${m.state || ""})`)
          .join("\n")
    );
  }

  if (results.categories?.length) {
    parts.push(
      "CATEGORIES:\n" + results.categories.slice(0, 6).map((c) => c.name).join(", ")
    );
  }

  if (results.users?.length) {
    parts.push(
      "USERS:\n" + results.users.slice(0, 5).map((u) => u.name).join(", ")
    );
  }

  const joined = parts.join("\n\n");
  return joined.length > MAX_CONTEXT_CHARS
    ? joined.slice(0, MAX_CONTEXT_CHARS) + "…"
    : joined;
};

const SYSTEM_PROMPT = `You are Trendkari's search assistant, covering local news and mandi (crop market) prices for Kota, Rajasthan and nearby areas.

Rules:
- Answer using ONLY the CONTEXT provided below. Never invent post titles, prices, or facts not present in it.
- Reply in the same language the user asked in — Hindi (Devanagari) if they wrote in Hindi, English if they wrote in English, or a natural mix if they mixed both.
- Be direct and short: 2–4 sentences for a general question, or a tight list for "what are the prices of X" style questions.
- If the context has crop prices, state the mandi name and price together.
- If nothing in the context actually answers the question, say so plainly in one line — do not pad with unrelated context.
- Do not mention that you were given "context" or describe your own process.`;

/**
 * Streams the answer via Anthropic's Messages API, invoking onToken(text)
 * for each text delta as it arrives. Resolves once the stream ends.
 */
export const streamAnthropicAnswer = async ({ query, context, onToken }) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const userMessage = `CONTEXT:\n${context}\n\nQUESTION: ${query}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Anthropic API error ${response.status}: ${errText.slice(0, 300)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop(); // last chunk may be incomplete, keep it for next read

    for (const evt of events) {
      const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;

      const jsonStr = dataLine.slice(5).trim();
      if (!jsonStr) continue;

      try {
        const payload = JSON.parse(jsonStr);
        if (
          payload.type === "content_block_delta" &&
          payload.delta?.type === "text_delta"
        ) {
          onToken(payload.delta.text);
        }
      } catch {
        // Ignore malformed/partial SSE chunks — the buffer above handles
        // the common case; this just guards against the rare edge case.
      }
    }
  }
};

/**
 * Non-streaming convenience wrapper — collects the full answer as one
 * string. Useful for callers (like a single JSON endpoint) that don't
 * want to deal with SSE at all.
 */
export const getAnthropicAnswer = async ({ query, context }) => {
  let full = "";
  await streamAnthropicAnswer({
    query,
    context,
    onToken: (t) => {
      full += t;
    },
  });
  return full.trim();
};