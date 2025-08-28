// controllers/searchController.js
import Post from '../models/postmodel.js';
import User from '../models/usermodel.js';
import Category from '../models/categorymodel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const searchController = {
  // Basic search function
  basicSearch: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // Search in posts
      const posts = await Post.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ],
        status: 'published'
      }).populate('author', 'name avatar')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(20);

      // Search in users
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } }
        ]
      }).select('name avatar bio followersCount')
        .limit(10);

      // Search in categories
      const categories = await Category.find({
        name: { $regex: query, $options: 'i' }
      }).limit(5);

      res.json({
        success: true,
        results: {
          posts,
          users,
          categories
        }
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Advanced search with Gemini AI
  advancedSearch: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // First, perform basic search
      const basicResults = await searchController.performBasicSearch(query);
      
      // Then, enhance with Gemini AI
      const enhancedResults = await searchController.enhanceWithGemini(query, basicResults);
      
      res.json({
        success: true,
        query,
        results: enhancedResults
      });
    } catch (error) {
      console.error('Advanced search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Perform basic search
  performBasicSearch: async (query) => {
    // Search in posts
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      status: 'published'
    }).populate('author', 'name avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(15);

    // Search in users
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    }).select('name avatar bio followersCount')
      .limit(8);

    // Search in categories
    const categories = await Category.find({
      name: { $regex: query, $options: 'i' }
    }).limit(5);

    return { posts, users, categories };
  },

  // Enhance search results with Gemini AI
  enhanceWithGemini: async (query, searchResults) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        Analyze the following search query and search results, then provide:
        1. A brief summary of what the user might be looking for
        2. Suggestions for related searches
        3. Categorization of the search intent (e.g., informational, navigational, transactional)
        4. Any additional insights about the query
        
        Search Query: "${query}"
        
        Search Results:
        - Posts found: ${searchResults.posts.length}
        - Users found: ${searchResults.users.length}
        - Categories found: ${searchResults.categories.length}
        
        Sample Post Titles: ${searchResults.posts.slice(0, 3).map(p => p.title).join(', ')}
        Sample User Names: ${searchResults.users.slice(0, 3).map(u => u.name).join(', ')}
        Category Names: ${searchResults.categories.map(c => c.name).join(', ')}
        
        Please respond in JSON format with this structure:
        {
          "summary": "brief summary",
          "searchIntent": "categorization",
          "relatedSearches": ["suggestion1", "suggestion2", "suggestion3"],
          "insights": "additional insights"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      let geminiAnalysis;
      try {
        // Extract JSON from the response (Gemini might add markdown formatting)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          geminiAnalysis = JSON.parse(jsonMatch[0]);
        } else {
          geminiAnalysis = {
            summary: "AI analysis unavailable",
            searchIntent: "unknown",
            relatedSearches: [],
            insights: "Could not parse AI response"
          };
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        geminiAnalysis = {
          summary: "AI analysis unavailable",
          searchIntent: "unknown",
          relatedSearches: [],
          insights: "Error processing AI response"
        };
      }

      return {
        ...searchResults,
        aiAnalysis: geminiAnalysis
      };
    } catch (error) {
      console.error('Gemini enhancement error:', error);
      // Return basic results if Gemini fails
      return {
        ...searchResults,
        aiAnalysis: {
          summary: "AI-enhanced search temporarily unavailable",
          searchIntent: "unknown",
          relatedSearches: [],
          insights: "Try refining your search terms"
        }
      };
    }
  },

  // Autocomplete suggestions
  autocomplete: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || q.length < 2) {
        return res.json({ suggestions: [] });
      }

      // Get suggestions from posts
      const postSuggestions = await Post.find({
        title: { $regex: q, $options: 'i' },
        status: 'published'
      }).select('title')
        .limit(5);

      // Get suggestions from users
      const userSuggestions = await User.find({
        name: { $regex: q, $options: 'i' }
      }).select('name')
        .limit(5);

      // Get suggestions from categories
      const categorySuggestions = await Category.find({
        name: { $regex: q, $options: 'i' }
      }).select('name')
        .limit(5);

      // Combine and format suggestions
      const suggestions = [
        ...postSuggestions.map(p => ({ type: 'post', text: p.title })),
        ...userSuggestions.map(u => ({ type: 'user', text: u.name })),
        ...categorySuggestions.map(c => ({ type: 'category', text: c.name }))
      ];

      res.json({ suggestions });
    } catch (error) {
      console.error('Autocomplete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};