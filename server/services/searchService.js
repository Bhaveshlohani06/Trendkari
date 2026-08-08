// backend/services/searchService.js
import Post from '../models/postmodel.js';
import User from '../models/usermodel.js';
import Category from '../models/categorymodel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Perform basic database search
export const performBasicSearch = async (query) => {
  try {
    // Search in posts
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      status: 'published'
    })
    .populate('author', 'name avatar')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(15);

    // Search in users
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name avatar bio followersCount')
    .limit(8);

    // Search in categories
    const categories = await Category.find({
      name: { $regex: query, $options: 'i' }
    })
    .limit(5);

    return { posts, users, categories };
  } catch (error) {
    console.error('Search service error:', error);
    throw error;
  }
};

// Enhance search results with Gemini AI
export const enhanceResults = async (query, searchResults) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Analyze this search query and results:
      Query: "${query}"
      Found ${searchResults.posts.length} posts, ${searchResults.users.length} users, ${searchResults.categories.length} categories
      
      Provide insights in JSON format:
      {
        "summary": "Brief summary of what these results indicate",
        "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
        "category": "What category does this search belong to?",
        "relevance": "How relevant are these results? (high/medium/low)"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {
        summary: "AI analysis unavailable",
        suggestions: [],
        category: "general",
        relevance: "medium"
      };
    } catch {
      return {
        summary: "AI analysis unavailable",
        suggestions: [],
        category: "general",
        relevance: "medium"
      };
    }
  } catch (error) {
    console.error('Enhancement error:', error);
    return {
      summary: "Enhancement temporarily unavailable",
      suggestions: [],
      category: "general",
      relevance: "medium"
    };
  }
};

// Generate AI response for no results
export const generateAIResponse = async (query) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      User searched for: "${query}"
      
      No results were found in our database. Please provide a helpful response.
      Make it clear, informative, and actionable.
      If it's a question, answer it directly.
      If it's a topic, provide a good overview.
      
      Keep the response under 500 words and well-structured.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI response generation error:', error);
    return "I couldn't find any results for your query. Please try rephrasing or be more specific.";
  }
};