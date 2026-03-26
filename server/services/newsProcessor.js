// import { main } from "../config/gemini.js";
// import { fetchKotaNews } from "./newsFetcher.js";
// import { isDuplicate } from "../services/postServices.js";
// import { savePost } from "../services/postServices.js";

// import Category from "../models/categoryModel.js";
// import User from "../models/usermodel.js";



// export const generateHindiPost = async (news) => {
//   const prompt =  `
// Convert this into a structured Hindi hyperlocal news post.

// Title: ${news.title}
// Content: ${news.content}

// Also suggest an image for this post that represents the news. Return a URL to a relevant image or a descriptive prompt that can be used to generate one.

// Return JSON format: **single line, compact format**, no backticks, no extra spaces.
// {
//   "title": "...",
//   "content": "...",
//   "tags": ["tag1", "tag2"],
//   "image_url": "https://..."   // AI suggested image
// }

// Rules:
// - Hindi language
// - 2-3 lines content
// - Relevant tags only
// `;

//   const result = await main(prompt);

//   return result.trim();
// };





// const getNewsCategoryId = async () => {
//   let category = await Category.findOne({ name: "news" });
//   if (!category) {
//     category = await Category.create({ name: "news" });
//   }
//   return category._id;
// };




// const getAdminUserId = async () => {
//   const admin = await User.findOne({ role: "admin" });
//   if (!admin) {
//     throw new Error("No admin user found! Create one first.");
//   }
//   return admin._id;
// };



// export const runNewsPipeline = async () => {
//   const newsList = await fetchKotaNews();

//   for (const news of newsList.slice(0, 5)) {
//     try {
//       // Skip duplicates by title
//       if (await isDuplicate(news.title)) continue;

//       const aiDataStr = await generateHindiPost(news);
//       if (!aiDataStr) continue;

//       // Clean AI response before parsing
//       const cleanStr = aiDataStr
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .trim();

//       const normalizedStr = cleanStr.replace(/\s+/g, " ");

//       let aiData;
//       try {
//         aiData = JSON.parse(normalizedStr);
//       } catch (err) {
//         console.error("❌ Failed to parse AI response:", aiDataStr);
//         continue;
//       }

//       const suggestedImage = aiData.image_url || null;
//       if (suggestedImage && !suggestedImage.startsWith("http")) {
//   suggestedImage = null; // reset, will generate image
// }

//       const categoryId = await getNewsCategoryId();
//         const authorId = await getAdminUserId();

//       // Save to MongoDB
//       await savePost({
//         title: aiData.title || news.title,
//         content: aiData.content,
//         tags: aiData.tags || [],
//         category: categoryId, // ObjectId
//         author: authorId,          // ObjectId
//         language: "hi",               // Enum value
//         location: "kota",
//         image: suggestedImage,
//         // source: news.link
//       });

//       console.log("✅ Saved:", aiData.title);

//     } catch (err) {
//       console.error("❌ Error:", err.message);
//     }
//   }
// };



import { main } from "../config/gemini.js";
import { fetchKotaNews } from "./newsFetcher.js";
import { isDuplicate, savePost } from "../services/postServices.js";
import Category from "../models/categoryModel.js";
import User from "../models/usermodel.js";
import { uploadImageToImageKit } from "../utils/imagekUploadNews.js"; // You'll need to create this



// Helper to fetch a real image (you can integrate with Unsplash or similar)
const fetchRealImage = async (query) => {
  // Option 1: Use Unsplash API
  // Option 2: Use Pixabay API
  // Option 3: Use a default image based on category
  
  // For now, return a default Kota image
  const defaultImages = [
    "https://ik.imagekit.io/trendkari/kota-city-default.jpg",
    "https://ik.imagekit.io/trendkari/kota-news-default.jpg",
    "https://ik.imagekit.io/trendkari/rajasthan-news.jpg"
  ];
  
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

export const generateHindiPost = async (news) => {
  const prompt = `
You are a hyperlocal news writer for Kota, Ramganjmandi. Convert this news into a short, engaging Hindi post.

Original News:
Title: ${news.title}
Content: ${news.content}
Source: ${news.source}

Create a JSON response (single line, no backticks):
{
  "title": "Catchy Hindi title (max 60 chars)",
  "content": "2-3 line Hindi summary with key details",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "news"
}

Rules:
- Write in simple Hindi (mix of Hindi and simple words)
- Keep content crisp and informative
- Add relevant tags (max 3)
- Focus on Kota/Rajasthan relevance
`;

  try {
    const result = await main(prompt);
    // Clean the response
    let cleanResult = result.trim()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\s+/g, " ");
    
    return JSON.parse(cleanResult);
  } catch (error) {
    console.error("❌ AI generation failed:", error.message);
    // Fallback to original with Hindi translation
    return {
      title: news.title.substring(0, 60),
      content: news.content?.substring(0, 200) || "कोटा की महत्वपूर्ण खबर पढ़ें",
      tags: ["कोटा", "समाचार"],
      category: "news"
    };
  }
};

const getNewsCategoryId = async () => {
  let category = await Category.findOne({ name: "news" });
  if (!category) {
    category = await Category.create({ name: "news" });
  }
  return category._id;
};

const getAdminUserId = async () => {
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    throw new Error("No admin user found! Create one first.");
  }
  return admin._id;
};

// Check if content is meaningful
const hasMeaningfulContent = (content) => {
  if (!content) return false;
  // Remove HTML tags
  const cleanText = content.replace(/<[^>]*>/g, '');
  // Check if content has at least 30 characters
  return cleanText.length >= 30;
};

export const runNewsPipeline = async () => {
  console.log("🔄 Starting news pipeline...");
  
  const newsList = await fetchKotaNews();
  console.log(`📰 Total news fetched: ${newsList.length}`);
  
  let savedCount = 0;
  let duplicateCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < Math.min(newsList.length, 15); i++) {
    const news = newsList[i];
    
    try {
      // Check if content is meaningful
      if (!hasMeaningfulContent(news.content)) {
        console.log(`⏭️ Skipping ${news.title.substring(0, 50)}... (content too short)`);
        continue;
      }
      
      // Skip duplicates by title
      if (await isDuplicate(news.title)) {
        console.log(`⏭️ Duplicate: ${news.title.substring(0, 50)}...`);
        duplicateCount++;
        continue;
      }
      
      console.log(`📝 Processing: ${news.title.substring(0, 50)}...`);
      
      // Generate Hindi content with AI
      const aiData = await generateHindiPost(news);


            const isValidImageUrl = (url) => {
  if (!url) return false;

  return (
    url.startsWith("http") &&
    !url.includes("google.com/url") &&
    !url.includes("base64") &&
    (url.endsWith(".jpg") ||
     url.endsWith(".jpeg") ||
     url.endsWith(".png") ||
     url.includes("image"))
  );
};

const fetchRealImage = async (query) => {
  if (query.includes("exam") || query.includes("result")) {
    return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
  }

  if (query.includes("accident") || query.includes("crime")) {
    return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
  }

  return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
};
      
      // Get or create image
      // let imageUrl = news.imageUrl;

      let imageUrl = news.imageUrl;



// Step 1: Validate
if (!isValidImageUrl(imageUrl)) {
  imageUrl = await fetchRealImage(aiData.title);
}

// Step 2: Upload to ImageKit (IMPORTANT)
if (imageUrl) {
  try {
    const uploaded = await uploadImageToImageKit(imageUrl);
    imageUrl = uploaded.url; // final CDN URL
  } catch (err) {
    console.log("⚠️ Image upload failed, using original:", err.message);
  }
}
      
      // If no image from RSS, try to get from AI or use default
      if (!imageUrl) {
        // Option: Generate image prompt for AI image generation
        // Or use a default image based on category
        imageUrl = await fetchRealImage(aiData.title);
      }
      
      // Get category and author IDs
      const categoryId = await getNewsCategoryId();
      const authorId = await getAdminUserId();
      
      // Save to database with image
      await savePost({
        title: aiData.title || news.title,
        content: aiData.content,
        tags: aiData.tags || ["कोटा", "समाचार"],
        category: categoryId,
        author: authorId,
        language: "hi",
        location: "kota",
        image: imageUrl, // This will be saved as URL
        source: news.source,
        originalLink: news.link
      });
      
      console.log(`✅ Saved: ${aiData.title.substring(0, 40)}...`);
      savedCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error(`❌ Error processing "${news.title?.substring(0, 50)}":`, err.message);
      errorCount++;
    }
  }
  
  console.log(`
  📊 News Pipeline Summary:
  ✅ Saved: ${savedCount}
  🔄 Duplicates skipped: ${duplicateCount}
  ❌ Errors: ${errorCount}
  📰 Total processed: ${Math.min(newsList.length, 15)}
  `);
  
  return { savedCount, duplicateCount, errorCount };
};