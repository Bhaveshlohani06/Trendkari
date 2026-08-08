// // // controllers/searchController.js
// // import Post from '../models/postmodel.js';
// // import User from '../models/usermodel.js';
// // import Category from '../models/categorymodel.js';
// // import { GoogleGenerativeAI } from '@google/generative-ai';


// // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// // export const searchController = {
// //   // Basic search function
// //   basicSearch: async (req, res) => {
// //     try {
// //       const { query } = req.query;
      
// //       if (!query) {
// //         return res.status(400).json({ error: 'Search query is required' });
// //       }

// //       // Search in posts
// //       const posts = await Post.find({
// //         $or: [
// //           { title: { $regex: query, $options: 'i' } },
// //           { content: { $regex: query, $options: 'i' } },
// //           { tags: { $regex: query, $options: 'i' } }
// //         ],
// //         status: 'published'
// //       }).populate('author', 'name avatar')
// //         .populate('category', 'name')
// //         .sort({ createdAt: -1 })
// //         .limit(20);

// //       // Search in users
// //       const users = await User.find({
// //         $or: [
// //           { name: { $regex: query, $options: 'i' } },
// //           { bio: { $regex: query, $options: 'i' } }
// //         ]
// //       }).select('name avatar bio followersCount')
// //         .limit(10);

// //       // Search in categories
// //       const categories = await Category.find({
// //         name: { $regex: query, $options: 'i' }
// //       }).limit(5);

// //       res.json({
// //         success: true,
// //         results: {
// //           posts,
// //           users,
// //           categories
// //         }
// //       });
// //     } catch (error) {
// //       console.error('Search error:', error);
// //       res.status(500).json({ error: 'Internal server error' });
// //     }
// //   },

// //   // Advanced search with Gemini AI
// //   advancedSearch: async (req, res) => {
// //     try {
// //       const { query } = req.query;
      
// //       if (!query) {
// //         return res.status(400).json({ error: 'Search query is required' });
// //       }

// //       // First, perform basic search
// //       const basicResults = await searchController.performBasicSearch(query);
      
// //       // Then, enhance with Gemini AI
// //       const enhancedResults = await searchController.enhanceWithGemini(query, basicResults);
      
// //       res.json({
// //         success: true,
// //         query,
// //         results: enhancedResults
// //       });
// //     } catch (error) {
// //       console.error('Advanced search error:', error);
// //       res.status(500).json({ error: 'Internal server error' });
// //     }
// //   },

// //   // Perform basic search
// //   performBasicSearch: async (query) => {
// //     // Search in posts
// //     const posts = await Post.find({
// //       $or: [
// //         { title: { $regex: query, $options: 'i' } },
// //         { content: { $regex: query, $options: 'i' } },
// //         { tags: { $regex: query, $options: 'i' } }
// //       ],
// //       status: 'published'
// //     }).populate('author', 'name avatar')
// //       .populate('category', 'name')
// //       .sort({ createdAt: -1 })
// //       .limit(15);

// //     // Search in users
// //     const users = await User.find({
// //       $or: [
// //         { name: { $regex: query, $options: 'i' } },
// //         { bio: { $regex: query, $options: 'i' } }
// //       ]
// //     }).select('name avatar bio followersCount')
// //       .limit(8);

// //     // Search in categories
// //     const categories = await Category.find({
// //       name: { $regex: query, $options: 'i' }
// //     }).limit(5);

// //     return { posts, users, categories };
// //   },

// //   // Enhance search results with Gemini AI
// //   enhanceWithGemini: async (query, searchResults) => {
// //     try {
// //       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
// //       const prompt = `
// //         Analyze the following search query and search results, then provide:
// //         1. A brief summary of what the user might be looking for
// //         2. Suggestions for related searches
// //         3. Categorization of the search intent (e.g., informational, navigational, transactional)
// //         4. Any additional insights about the query
        
// //         Search Query: "${query}"
        
// //         Search Results:
// //         - Posts found: ${searchResults.posts.length}
// //         - Users found: ${searchResults.users.length}
// //         - Categories found: ${searchResults.categories.length}
        
// //         Sample Post Titles: ${searchResults.posts.slice(0, 3).map(p => p.title).join(', ')}
// //         Sample User Names: ${searchResults.users.slice(0, 3).map(u => u.name).join(', ')}
// //         Category Names: ${searchResults.categories.map(c => c.name).join(', ')}
        
// //         Please respond in JSON format with this structure:
// //         {
// //           "summary": "brief summary",
// //           "searchIntent": "categorization",
// //           "relatedSearches": ["suggestion1", "suggestion2", "suggestion3"],
// //           "insights": "additional insights"
// //         }
// //       `;

// //       const result = await model.generateContent(prompt);
// //       const response = await result.response;
// //       const text = response.text();
      
// //       // Parse the JSON response from Gemini
// //       let geminiAnalysis;
// //       try {
// //         // Extract JSON from the response (Gemini might add markdown formatting)
// //         const jsonMatch = text.match(/\{[\s\S]*\}/);
// //         if (jsonMatch) {
// //           geminiAnalysis = JSON.parse(jsonMatch[0]);
// //         } else {
// //           geminiAnalysis = {
// //             summary: "AI analysis unavailable",
// //             searchIntent: "unknown",
// //             relatedSearches: [],
// //             insights: "Could not parse AI response"
// //           };
// //         }
// //       } catch (parseError) {
// //         console.error('Error parsing Gemini response:', parseError);
// //         geminiAnalysis = {
// //           summary: "AI analysis unavailable",
// //           searchIntent: "unknown",
// //           relatedSearches: [],
// //           insights: "Error processing AI response"
// //         };
// //       }

// //       return {
// //         ...searchResults,
// //         aiAnalysis: geminiAnalysis
// //       };
// //     } catch (error) {
// //       console.error('Gemini enhancement error:', error);
// //       // Return basic results if Gemini fails
// //       return {
// //         ...searchResults,
// //         aiAnalysis: {
// //           summary: "AI-enhanced search temporarily unavailable",
// //           searchIntent: "unknown",
// //           relatedSearches: [],
// //           insights: "Try refining your search terms"
// //         }
// //       };
// //     }
// //   },

// //   // Autocomplete suggestions
// //   autocomplete: async (req, res) => {
// //     try {
// //       const { q } = req.query;
      
// //       if (!q || q.length < 2) {
// //         return res.json({ suggestions: [] });
// //       }

// //       // Get suggestions from posts
// //       const postSuggestions = await Post.find({
// //         title: { $regex: q, $options: 'i' },
// //         status: 'published'
// //       }).select('title')
// //         .limit(5);

// //       // Get suggestions from users
// //       const userSuggestions = await User.find({
// //         name: { $regex: q, $options: 'i' }
// //       }).select('name')
// //         .limit(5);

// //       // Get suggestions from categories
// //       const categorySuggestions = await Category.find({
// //         name: { $regex: q, $options: 'i' }
// //       }).select('name')
// //         .limit(5);

// //       // Combine and format suggestions
// //       const suggestions = [
// //         ...postSuggestions.map(p => ({ type: 'post', text: p.title })),
// //         ...userSuggestions.map(u => ({ type: 'user', text: u.name })),
// //         ...categorySuggestions.map(c => ({ type: 'category', text: c.name }))
// //       ];

// //       res.json({ suggestions });
// //     } catch (error) {
// //       console.error('Autocomplete error:', error);
// //       res.status(500).json({ error: 'Internal server error' });
// //     }
// //   }
// // };






// // // controllers/searchController.js
// // import Post from '../models/postmodel.js';
// // import User from '../models/usermodel.js';
// // import Category from '../models/categorymodel.js';
// // // import { searchController } from "./searchController.js";
// // import { detectIntent } from "../utils/aiIntent.js";

// // export const advancedSmartSearch = async (req, res) => {
// //   try {
// //     const { query } = req.body;

// //     if (!query) {
// //       return res.status(400).json({ error: "Query required" });
// //     }

// //     // 🔥 STEP 1: Detect intent using Gemini
// //     const intentData = await detectIntent(query);

// //     console.log("🧠 AI Intent:", intentData);

// //     // 🔥 STEP 2: Route based on intent
// //     if (intentData.intent === "horoscope") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/horoscope",
// //         message: "Opening your horoscope 🔮",
// //         meta: intentData
// //       });
// //     }

// //     if (intentData.intent === "market") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/market",
// //         message: `Showing mandi rates ${intentData.city || ""} 🌾`,
// //         meta: intentData
// //       });
// //     }

// //     if (intentData.intent === "weather") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/weather",
// //         message: `Fetching weather ${intentData.city || ""} ☀️`,
// //         meta: intentData
// //       });
// //     }

// //     if (intentData.intent === "news") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/news",
// //         message: `Latest news ${intentData.city || ""} 📰`,
// //         meta: intentData
// //       });
// //     }

// //     // 🔥 STEP 3: fallback → your existing search + Gemini enhancement
// //     const basicResults = await searchController.performBasicSearch(query);
// //     const enhancedResults = await searchController.enhanceWithGemini(query, basicResults);

// //     return res.json({
// //       type: "search",
// //       query,
// //       intent: intentData,
// //       results: enhancedResults
// //     });

// //   } catch (err) {
// //     console.error("❌ Advanced search error:", err);
// //     res.status(500).json({ error: "Advanced search failed" });
// //   }
// // };





// // export const searchController = {
// //   basicSearch: async (req, res) => {
// //     try {
// //       const { query } = req.query;
      
// //       if (!query) {
// //         return res.status(400).json({ error: 'Search query is required' });
// //       }

// //       // Search in posts
// //       const posts = await Post.find({
// //         $or: [
// //           { title: { $regex: query, $options: 'i' } },
// //           { content: { $regex: query, $options: 'i' } },
// //           { tags: { $regex: query, $options: 'i' } }
// //         ],
// //         status: 'published'
// //       }).populate('author', 'name avatar')
// //         .populate('category', 'name')
// //         .sort({ createdAt: -1 })
// //         .limit(20);

// //       // Search in users
// //       const users = await User.find({
// //         $or: [
// //           { name: { $regex: query, $options: 'i' } },
// //           { bio: { $regex: query, $options: 'i' } }
// //         ]
// //       }).select('name avatar bio followersCount')
// //         .limit(10);

// //       // Search in categories
// //       const categories = await Category.find({
// //         name: { $regex: query, $options: 'i' }
// //       }).limit(5);

// //       res.json({
// //         success: true,
// //         results: {
// //           posts,
// //           users,
// //           categories
// //         }
// //       });
// //     } catch (error) {
// //       console.error('Search error:', error);
// //       res.status(500).json({ error: 'Internal server error' });
// //     }
// //   }
// // };






// // import { detectIntent } from "../utils/aiIntent.js";
// // import { performBasicSearch } from "../services/searchService.js";
// // import { enhanceResults } from "../services/searchService.js";

// // export const advancedSmartSearch = async (req, res) => {
// //   try {
// //     const { query } = req.body;

// //     if (!query) {
// //       return res.status(400).json({ error: "Query required" });
// //     }

// //     // 🔥 STEP 1: AI Intent
// //     const intentData = await detectIntent(query);

// //     console.log("🧠 AI Intent:", intentData);

// //     // 🔥 STEP 2: Routing
// //     if (intentData.intent === "horoscope") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/horoscope",
// //         message: "Opening horoscope 🔮",
// //         meta: intentData
// //       });
// //     }

// //     if (intentData.intent === "market") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/market",
// //         message: `Showing mandi rates ${intentData.city || ""} 🌾`,
// //         meta: intentData
// //       });
// //     }

// //     if (intentData.intent === "weather") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/weather",
// //         message: `Fetching weather ${intentData.city || ""} ☀️`,
// //         meta: intentData
// //       });
// //     }

// //     if (intentData.intent === "news") {
// //       return res.json({
// //         type: "redirect",
// //         route: "/news",
// //         message: `Showing news ${intentData.city || ""} 📰`,
// //         meta: intentData
// //       });
// //     }

// //     // 🔥 STEP 3: Search
// //     const basicResults = await performBasicSearch(query);

// //     // 🔥 STEP 4: AI Enhancement
// //     const enhancedResults = await enhanceResults(query, basicResults);

// //     return res.json({
// //       type: "search",
// //       query,
// //       intent: intentData,
// //       results: enhancedResults
// //     });

// //   } catch (err) {
// //     console.error("❌ Advanced search error:", err);
// //     res.status(500).json({ error: "Advanced search failed" });
// //   }
// // };



// // controllers/searchController.js
// import Post from '../models/postmodel.js';
// import User from '../models/usermodel.js';
// import Category from '../models/categorymodel.js';
// import { performBasicSearch } from "../services/searchService.js";
// import { enhanceResults } from "../services/searchService.js";
// import { detectIntent } from "../utils/aiIntent.js";
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// // ✅ BASIC SEARCH CONTROLLER
// export const basicSearch = async (req, res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({ error: "Query required" });
//     }

//     const results = await performBasicSearch(query);

//     res.json({
//       success: true,
//       results
//     });

//   } catch (err) {
//     console.error("Basic search error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // ✅ AUTOCOMPLETE
// export const autocomplete = async (req, res) => {
//   try {
//     const { q } = req.query;

//     if (!q || q.length < 2) {
//       return res.json({ suggestions: [] });
//     }

//     const results = await performBasicSearch(q);

//     const suggestions = [
//       ...results.posts.map(p => ({ type: "post", text: p.title })),
//       ...results.users.map(u => ({ type: "user", text: u.name })),
//       ...results.categories.map(c => ({ type: "category", text: c.name }))
//     ];

//     res.json({ suggestions });

//   } catch (err) {
//     console.error("Autocomplete error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // ✅ ADVANCED SEARCH (AI enhanced but no routing)
// export const advancedSearch = async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query) {
//       return res.status(400).json({ error: "Query required" });
//     }

//     const intentData = await detectIntent(query);
//     const basic = await performBasicSearch(query);
//     const enhanced = await enhanceResults(query, basic);

//     res.json({
//       success: true,
//       results: enhanced
//     });

//   } catch (err) {
//     console.error("Advanced search error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // 🚀 AI SEARCH WITH FALLBACK TO GEMINI
// export const aiSearch = async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query) {
//       return res.status(400).json({ error: "Query required" });
//     }

//     // STEP 1: Try to find results in database
//     const dbResults = await performBasicSearch(query);
    
//     // Check if we have meaningful results
//     const hasResults = 
//       dbResults.posts.length > 0 || 
//       dbResults.users.length > 0 || 
//       dbResults.categories.length > 0;

//     // STEP 2: If we have results, return them with AI enhancement
//     if (hasResults) {
//       const enhanced = await enhanceResults(query, dbResults);
      
//       return res.json({
//         success: true,
//         source: 'database',
//         results: enhanced,
//         message: `Found ${dbResults.posts.length} posts, ${dbResults.users.length} users, and ${dbResults.categories.length} categories`
//       });
//     }

//     // STEP 3: No results found - Use Gemini AI to generate answer
//     console.log('🔍 No results found, using AI to answer...');
    
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
//     const prompt = `
//       The user searched for: "${query}"
      
//       No results were found in our database for this query.
      
//       Please provide a helpful, informative response based on your knowledge. 
//       Format your response as a complete answer that directly addresses the query.
      
//       If the query is about a specific topic, provide general information.
//       If it's a question, answer it to the best of your ability.
//       If it's a request for recommendations, provide thoughtful suggestions.
      
//       Keep your response clear, well-structured, and conversational.
//       Include relevant points and insights.
      
//       Make sure to be helpful and provide value even though no database results exist.
//     `;

//     const result = await model.generateContent(prompt);
//     const aiResponse = await result.response;
//     const text = aiResponse.text();

//     // Also detect intent for routing
//     const intentData = await detectIntent(query);

//     // Check if it's a routing intent
//     if (intentData.intent === "horoscope") {
//       return res.json({
//         type: "redirect",
//         route: "/horoscope",
//         message: "Opening horoscope 🔮",
//         meta: intentData
//       });
//     }

//     if (intentData.intent === "market") {
//       return res.json({
//         type: "redirect",
//         route: "/market",
//         message: `Showing mandi rates ${intentData.city || ""} 🌾`,
//         meta: intentData
//       });
//     }

//     if (intentData.intent === "weather") {
//       return res.json({
//         type: "redirect",
//         route: "/weather",
//         message: `Fetching weather ${intentData.city || ""} ☀️`,
//         meta: intentData
//       });
//     }

//     if (intentData.intent === "news") {
//       return res.json({
//         type: "redirect",
//         route: "/news",
//         message: `Showing news ${intentData.city || ""} 📰`,
//         meta: intentData
//       });
//     }

//     // Return AI-generated response
//     return res.json({
//       success: true,
//       source: 'ai',
//       query,
//       aiResponse: text,
//       intent: intentData,
//       message: 'No database results found. Here\'s what I know about this topic.'
//     });

//   } catch (err) {
//     console.error("AI Search error:", err);
//     res.status(500).json({ 
//       error: "Internal server error",
//       message: "AI search failed. Please try again."
//     });
//   }
// };

// // 🚀 SMART SEARCH (Combines everything - your main feature)
// export const advancedSmartSearch = async (req, res) => {
//   try {
//     const { query } = req.body;

//     if (!query) {
//       return res.status(400).json({ error: "Query required" });
//     }

//     // STEP 1: Detect intent
//     const intentData = await detectIntent(query);

//     // STEP 2: Check for routing intents first
//     if (intentData.intent === "horoscope") {
//       return res.json({ 
//         type: "redirect", 
//         route: "/horoscope",
//         message: "Opening horoscope 🔮",
//         meta: intentData
//       });
//     }

//     if (intentData.intent === "market") {
//       return res.json({ 
//         type: "redirect", 
//         route: "/market",
//         message: `Showing mandi rates ${intentData.city || ""} 🌾`,
//         meta: intentData
//       });
//     }

//     if (intentData.intent === "weather") {
//       return res.json({ 
//         type: "redirect", 
//         route: "/weather",
//         message: `Fetching weather ${intentData.city || ""} ☀️`,
//         meta: intentData
//       });
//     }

//     if (intentData.intent === "news") {
//       return res.json({ 
//         type: "redirect", 
//         route: "/news",
//         message: `Showing news ${intentData.city || ""} 📰`,
//         meta: intentData
//       });
//     }

//     // STEP 3: Perform database search
//     const dbResults = await performBasicSearch(query);
//     const hasResults = 
//       dbResults.posts.length > 0 || 
//       dbResults.users.length > 0 || 
//       dbResults.categories.length > 0;

//     // STEP 4: If we have results, enhance them with AI
//     if (hasResults) {
//       const enhanced = await enhanceResults(query, dbResults);
      
//       return res.json({
//         type: "search",
//         source: "database",
//         query,
//         results: enhanced,
//         intent: intentData,
//         message: `Found ${dbResults.posts.length} posts, ${dbResults.users.length} users, and ${dbResults.categories.length} categories`
//       });
//     }

//     // STEP 5: No results - Use Gemini AI for answer
//     console.log('🤖 No results, generating AI response...');
    
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
//     const prompt = `
//       The user searched for: "${query}"
      
//       This is a general knowledge query with no matching results in our database.
      
//       Please provide a comprehensive, helpful response. Be conversational and informative.
      
//       Guidelines:
//       - If it's a question, answer it directly and thoroughly
//       - If it's a topic, provide a good overview with key points
//       - If it's a request, fulfill it to the best of your ability
//       - If it's a comparison, provide balanced analysis
//       - Make it actionable and useful
      
//       Structure your response with:
//       1. A brief introduction
//       2. Main content with key points
//       3. A helpful conclusion or next steps
      
//       Keep the tone friendly and helpful.
//     `;

//     const result = await model.generateContent(prompt);
//     const aiResponse = await result.response;
//     const text = aiResponse.text();

//     return res.json({
//       type: "ai_response",
//       source: "ai",
//       query,
//       response: text,
//       intent: intentData,
//       message: "No database results found. Here's what I can tell you about this topic."
//     });

//   } catch (err) {
//     console.error("Smart search error:", err);
//     res.status(500).json({ 
//       error: "Internal server error",
//       message: "Search failed. Please try again."
//     });
//   }
// };

// // ✅ SEARCH WITH AI FALLBACK (Simplified version)
// export const searchWithFallback = async (req, res) => {
//   try {
//     const { query } = req.body || req.query;

//     if (!query) {
//       return res.status(400).json({ error: "Query required" });
//     }

//     // Try to find in database
//     const dbResults = await performBasicSearch(query);
//     const hasResults = 
//       dbResults.posts.length > 0 || 
//       dbResults.users.length > 0 || 
//       dbResults.categories.length > 0;

//     if (hasResults) {
//       // Return database results
//       const enhanced = await enhanceResults(query, dbResults);
//       return res.json({
//         success: true,
//         source: 'database',
//         results: enhanced
//       });
//     }

//     // Fallback to AI
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const prompt = `Answer this query concisely and helpfully: ${query}`;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return res.json({
//       success: true,
//       source: 'ai',
//       query,
//       answer: text
//     });

//   } catch (err) {
//     console.error("Search with fallback error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



import Post from '../models/postmodel.js';
import User from '../models/usermodel.js';
import Category from '../models/categorymodel.js';
import { detectIntent } from "../utils/aiIntent.js";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// 🔍 HELPER FUNCTION: Queries MongoDB across Posts, Users, & Categories
export const performBasicSearch = async (query) => {
  const searchTerm = (query || "").trim();
  if (!searchTerm) return { posts: [], users: [], categories: [] };

  // Search Posts (Title & Tags)
  const posts = await Post.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } }
    ]
  })
    .populate('author', 'name avatar')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  // Search Users
  const users = await User.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { bio: { $regex: searchTerm, $options: 'i' } }
    ]
  })
    .select('name avatar bio followersCount')
    .limit(10);

  // Search Categories
  const categories = await Category.find({
    name: { $regex: searchTerm, $options: 'i' }
  }).limit(5);

  return { posts, users, categories };
};

// ✅ BASIC SEARCH (GET /api/v1/search/basic?query=...)
export const basicSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    const results = await performBasicSearch(query);

    return res.json({
      success: true,
      results
    });
  } catch (err) {
    console.error("Basic search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ AUTOCOMPLETE (GET /api/v1/search/autocomplete?q=...)
export const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const results = await performBasicSearch(q);

    const suggestions = [
      ...results.posts.map((p) => ({ type: "post", text: p.title })),
      ...results.users.map((u) => ({ type: "user", text: u.name })),
      ...results.categories.map((c) => ({ type: "category", text: c.name }))
    ];

    return res.json({ suggestions });
  } catch (err) {
    console.error("Autocomplete error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ ADVANCED SEARCH (GET / POST)
export const advancedSearch = async (req, res) => {
  try {
    const query = req.body?.query || req.query?.query;

    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    const results = await performBasicSearch(query);

    return res.json({
      success: true,
      results
    });
  } catch (err) {
    console.error("Advanced search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 🚀 ADVANCED SMART SEARCH (AI Intent Routing + DB Search + AI Fallback)
export const advancedSmartSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    // STEP 1: Detect AI Intent
    let intentData = { intent: "general" };
    try {
      intentData = await detectIntent(query);
    } catch (e) {
      console.warn("Intent detection failed, defaulting to general:", e.message);
    }

    // STEP 2: Handle Route Redirect Intents
    if (["horoscope", "market", "weather", "news"].includes(intentData.intent)) {
      return res.json({
        type: "redirect",
        route: `/${intentData.intent}`,
        message: `Navigating to ${intentData.intent}`,
        meta: intentData
      });
    }

    // STEP 3: Execute Database Search
    const dbResults = await performBasicSearch(query);
    const hasResults =
      dbResults.posts.length > 0 ||
      dbResults.users.length > 0 ||
      dbResults.categories.length > 0;

    // STEP 4: Return DB Results if found
    if (hasResults) {
      return res.json({
        type: "search",
        source: "database",
        query,
        results: dbResults,
        intent: intentData,
        message: `Found ${dbResults.posts.length} posts, ${dbResults.users.length} users, and ${dbResults.categories.length} categories`
      });
    }

    // STEP 5: AI Fallback if Database is empty
    console.log("🤖 No database records found. Generating Gemini response...");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `The user searched for: "${query}". Provide a clear, helpful overview addressing this topic.`;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response.text();

    return res.json({
      type: "ai_response",
      source: "ai",
      query,
      response: aiResponse,
      intent: intentData,
      message: "No database results found. Here's information generated for your query."
    });
  } catch (err) {
    console.error("Smart search error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: "Search failed. Please try again."
    });
  }
};