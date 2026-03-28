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


import axios from "axios";
import { main } from "../config/gemini.js";
import { fetchKotaNews } from "./newsFetcher.js";
import { isDuplicate, savePost } from "../services/postServices.js";
import Category from "../models/categorymodel.js";
import User from "../models/usermodel.js";
import { uploadImageToImageKit } from "../utils/imagekUploadNews.js"; // You'll need to create this
import { generateSlug } from '../utils/slugify.js'; // You'll need to create this
import slugify from "slugify";
import postModel from "../models/postmodel.js";
import extractOgImage from "../utils/extractOgImage.js";





// Helper to fetch a real image (you can integrate with Unsplash or similar)
// const fetchRealImage = async (query) => {
//   // Option 1: Use Unsplash API
//   // Option 2: Use Pixabay API
//   // Option 3: Use a default image based on category
  
//   // For now, return a default Kota image
//   const defaultImages = [
//     "https://ik.imagekit.io/trendkari/kota-city-default.jpg",
//     "https://ik.imagekit.io/trendkari/kota-news-default.jpg",
//     "https://ik.imagekit.io/trendkari/rajasthan-news.jpg"
//   ];
  
//   return defaultImages[Math.floor(Math.random() * defaultImages.length)];
// };

export const generateHindiPost = async (news) => {
  const prompt = `
You are a hyperlocal news writer for Rajasthan (Kota, Ramganjmandi, Sangod, Jaipur).

Convert the following news into a SHORT, FACTUAL Hindi post.

Latest Original News:
Title: ${news.title}
Content: ${news.content}
Source: ${news.source}

Return ONLY valid JSON (single line, no explanation):
{
  "title": "",
  "content": "",
  "tags": [],
  "category": "news"
}

STRICT RULES:
- Title must be based on original news (DO NOT invent new topic)
- Keep title under 60 characters
- Content must summarize SAME news with location reference (no new angles, no rewriting story)
- Write 5–6 short lines only
- Use simple Hindi (mix allowed)
- Must include location reference (Kota / Sangod / Ramganjmandi etc if present)
- Do NOT generalize or exaggerate
- Tags must be directly from topic (max 3)
- Avoid duplicate phrasing like "बड़ी खबर", "चौंकाने वाला मामला" unless truly relevant
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

// const getNewsCategoryId = async () => {
//   let category = await Category.findOne({ name: "news" });
//   if (!category) {
//     category = await Category.create({ name: "news" });
//   }
//   return category._id;
// };

const getAdminUserId = async () => {
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    throw new Error("No admin user found! Create one first.");
  }
  return admin._id;
};

// Check if content is meaningful
// const hasMeaningfulContent = (content) => {
//   if (!content) return false;
//   // Remove HTML tags
//   const cleanText = content.replace(/<[^>]*>/g, '');
//   // Check if content has at least 30 characters
//   return cleanText.length >= 30;
// };

// export const runNewsPipeline = async () => {

//   console.log("🔄 Starting news pipeline...");
  
//   const newsList = await fetchKotaNews();
//   console.log(`📰 Total news fetched: ${newsList.length}`);
  
//   let savedCount = 0;
//   let duplicateCount = 0;
//   let errorCount = 0;
  
//   for (let i = 0; i < Math.min(newsList.length, 15); i++) {
//     const news = newsList[i];
    
//     try {
//       // Check if content is meaningful
//       if (!hasMeaningfulContent(news.content)) {
//         console.log(`⏭️ Skipping ${news.title.substring(0, 50)}... (content too short)`);
//         continue;
//       }
      
//       // Skip duplicates by title
//       if (await isDuplicate(news.title)) {
//         console.log(`⏭️ Duplicate: ${news.title.substring(0, 50)}...`);
//         duplicateCount++;
//         continue;
//       }
      
//       console.log(`📝 Processing: ${news.title.substring(0, 50)}...`);
      
//       // Generate Hindi content with AI
//       const aiData = await generateHindiPost(news);


//             const isValidImageUrl = (url) => {
//   if (!url) return false;

//   return (
//     url.startsWith("http") &&
//     !url.includes("google.com/url") &&
//     !url.includes("base64") &&
//     (url.endsWith(".jpg") ||
//      url.endsWith(".jpeg") ||
//      url.endsWith(".png") ||
//      url.includes("image"))
//   );
// };

// const fetchRealImage = async (query) => {
//   if (query.includes("exam") || query.includes("result")) {
//     return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//   }

//   if (query.includes("accident") || query.includes("crime")) {
//     return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//   }

//   return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
// };
      
//       // Get or create image
//       // let imageUrl = news.imageUrl;

// //       let imageUrl = news.imageUrl;



// // // Step 1: Validate
// // if (!isValidImageUrl(imageUrl)) {
// //   imageUrl = await fetchRealImage(aiData.title);
// // }

// // // Step 2: Upload to ImageKit (IMPORTANT)
// // if (imageUrl) {
// //   try {
// //     const uploaded = await uploadImageToImageKit(imageUrl);
// //     imageUrl = uploaded.url; // final CDN URL
// //   } catch (err) {
// //     console.log("⚠️ Image upload failed,   original:", err.message);
// //   }
// // }

// // let imageUrl = news.imageUrl;

// // // Step 1: Validate RSS image
// // if (!isValidImageUrl(imageUrl)) {
// //   console.log("⚠️ Invalid RSS image → using fallback");
// //   imageUrl = await fetchRealImage(aiData.title);
// // }

// // // Step 2: Try uploading (SAFE)
// // let finalImage = imageUrl;

// // try {
// //   const uploaded = await uploadImageToImageKit(imageUrl);

// //   if (uploaded && uploaded.url) {
// //     finalImage = uploaded.url;
// //     console.log("✅ Image uploaded:", finalImage);
// //   } else {
// //     console.log("⚠️ Upload failed → using fallback");
// //     finalImage = await fetchRealImage(aiData.title);
// //   }

// // } catch (err) {
// //   console.log("❌ Upload error → using fallback:", err.message);
// //   finalImage = await fetchRealImage(aiData.title);
// // }



// let imageUrl = news.imageUrl;

// // Step 1: Try OG image (BEST SOURCE)
// let ogImage = null;

// if (news.link) {
//   ogImage = await extractOgImage(news.link);
// }

// if (ogImage) {
//   console.log("✅ OG Image found");
//   imageUrl = ogImage;
// }

// // Step 2: Validate
// if (!isValidImageUrl(imageUrl)) {
//   console.log("⚠️ Invalid image → fallback");
//   imageUrl = await fetchRealImage(aiData.title);
// }

// // Step 3: Upload safely
// let finalImage = imageUrl;

// try {
//   const uploaded = await uploadImageToImageKit(imageUrl);

//   if (uploaded?.url) {
//     finalImage = uploaded.url;
//   } else {
//     finalImage = await fetchRealImage(aiData.title);
//   }

// } catch (err) {
//   finalImage = await fetchRealImage(aiData.title);
// }
      
//       // If no image from RSS, try to get from AI or use default
//       if (!imageUrl) {
//         // Option: Generate image prompt for AI image generation
//         // Or use a default image based on category
//         imageUrl = await fetchRealImage(aiData.title);
//       }
      
//       // Get category and author IDs
//       const categoryId = await getNewsCategoryId();
//       const authorId = await getAdminUserId();
      
//       // Save to database with image
//       await savePost({
//         title: aiData.title || news.title,
//         content: aiData.content,
//         tags: aiData.tags || ["कोटा", "समाचार"],
//         category: categoryId,
//         author: authorId,
//         language: "hi",
//         location: "kota",
//         image: finalImage, // This will be saved as URL
//         source: news.source,
//         originalLink: news.link
//       });
      
//       console.log(`✅ Saved: ${aiData.title.substring(0, 40)}...`);
//       savedCount++;
      
//       // Small delay to avoid rate limiting
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//     } catch (err) {
//       console.error(`❌ Error processing "${news.title?.substring(0, 50)}":`, err.message);
//       errorCount++;
//     }
//   }
  
//   console.log(`
//   📊 News Pipeline Summary:
//   ✅ Saved: ${savedCount}
//   🔄 Duplicates skipped: ${duplicateCount}
//   ❌ Errors: ${errorCount}
//   📰 Total processed: ${Math.min(newsList.length, 15)}
//   `);
  
//   return { savedCount, duplicateCount, errorCount };
// };



// const fetchRealImage = async (query) => {
//   if (query.includes("exam") || query.includes("result")) {
//     return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//   }

//   if (query.includes("accident") || query.includes("crime")) {
//     return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//   }

//   return "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
// };

const fetchRealImage = async (query) => {
  try {
    const res = await axios.get(
      "https://api.pexels.com/v1/search",
      {
        params: {
          query,
          per_page: 1,
        },
        headers: {
          Authorization: "BiQZXrIJNgrkG4ZTvb5weLMZIGoFlY1n4KvN722qNdqLWgXl9VmoTiqu",
        },
      }
    );

    const image = res.data?.photos?.[0]?.src?.large;

    return image || null;

  } catch (err) {
    console.log("❌ Pexels error:", err.message);
    return null;
  }
};

const hasMeaningfulContent = (content) => {
  if (!content) return false;
  const clean = content.replace(/<[^>]*>/g, "");
  return clean.length > 30;
};

const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);
};





const detectLocation = (text) => {
  const content = text.toLowerCase();

  if (content.includes("ramganj mandi") || content.includes("ramganjmandi")) {
    return "ramganjmandi";
  }

  if (content.includes("sangod")) {
    return "sangod";
  }

  if (content.includes("ladpura")) {
    return "ladpura";
  }

  if (content.includes("kaithoon")) {
    return "kaithoon";
  }

  if (content.includes("modak")) {
    return "modak";
  }

  if (content.includes("kota rural") || content.includes("ग्रामीण")) {
    return "rural-kota";
  }

  if (content.includes("kota") || content.includes("कोटा")) {
    return "kota";
  }

  return "kota"; // fallback
};





export const runNewsPipeline = async () => {
  console.log("🚀 Starting pipeline...");

  const newsList = await fetchKotaNews();

  let saved = 0;
  let duplicate = 0;
  let errors = 0;

  for (let i = 0; i < Math.min(newsList.length, 15); i++) {
    const news = newsList[i];

    try {
      if (!hasMeaningfulContent(news.content)) continue;

      if (await isDuplicate(news.title)) {
        duplicate++;
        continue;
      }

      console.log("📝 Processing:", news.title);


      const aiData = await generateHindiPost(news);


      //===========SLUGIFY ===========

          const baseSlug = generateSlug(aiData.title || news.title);
          if (!baseSlug) {
            return res.status(400).json({ message: "Slug generation failed" });
          }
      
          let slug = baseSlug;
          let count = 1;
          while (await postModel.exists({ slug })) {
            slug = `${baseSlug}-${count++}`;
          }

          console.log("🔗 Generated slug:", slug);
      // ================= IMAGE LOGIC =================

//       let imageUrl = news.imageUrl;
//       let ogImage = null;

//       // Try OG image (skip blocked sites if needed)
//       if (news.link && !news.source.includes("Bhaskar")) {
//         try {
//           ogImage = await withTimeout(
//             extractOgImage(news.link),
//             5000
//           );
//         } catch {}
//       }

//       if (ogImage) {
//         console.log("✅ OG image found");
//         imageUrl = ogImage;
//       }

//       // Validate
//       if (!isValidImageUrl(imageUrl)) {
//         console.log("⚠️ Invalid image → fallback");
//         imageUrl = await fetchRealImage(aiData.title);
//       }

// let finalImage = imageUrl;

// // 🔥 Skip upload if already ImageKit (fallback or existing)
// if (imageUrl.includes("ik.imagekit.io")) {
//   console.log("⚠️ Skipping upload (already hosted)");
//   finalImage = imageUrl;

// } else {
//   try {
//     const uploaded = await uploadImageToImageKit(imageUrl);

//     if (uploaded?.url) {
//       finalImage = uploaded.url;
//       console.log("✅ Uploaded to ImageKit");
//     } else {
//       console.log("⚠️ Upload failed → fallback");
//       finalImage = await fetchRealImage(aiData.title);
//     }
//   } catch (err) {
//     console.log("❌ Upload error → fallback");
//     finalImage = await fetchRealImage(aiData.title);
//   }
// }

// ✅ TEMP FIX: Always use fallback image
// const FALLBACK_IMAGE = "https://ik.imagekit.io/f4dxqg3tf/posts/kotabanner.png";
const FALLBACK_IMAGE = "https://ik.imagekit.io/f4dxqg3tf/ChatGPT%20Image%20Mar%2026,%202026,%2011_07_59%20PM.png";
// const FALLBACK_IMAGE = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";


// let finalImage = FALLBACK_IMAGE;

// console.log("🖼️ Using fallback image");


// let imageUrl = news.imageUrl;
let ogImage = null;


const finalImage = await getFinalImage(news, aiData);



console.log("🔗 Article:", news.link);
console.log("🖼️ OG Image:", ogImage);
console.log("🖼️ RSS Image:", news.imageUrl);
      // ================= SAVE =================

      // const categoryId = await getNewsCategoryId();
const CATEGORY_IDS = {
  NEWS: "689847d0742b6b7e04acc6b6",
  POLITICS: "6889a68b80d92ae54acdcd52"
};
      const authorId = await getAdminUserId();

      const detectedLocation = detectLocation(
  `${news.title} ${news.content} ${aiData.title}`
);

      await savePost({
        title: aiData.title,
        content: aiData.content,
        tags: aiData.tags,
        category: CATEGORY_IDS.NEWS,
        author: authorId,
        language: "hi",
        location: detectedLocation,
        slug: slug,
        image: finalImage,
        source: news.source,
        originalLink: news.link,
      });

      console.log("✅ Saved:", aiData.title);
      saved++;

      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.log("❌ Error:", err.message);
      errors++;
    }
  }

  console.log(`
📊 RESULT:
Saved: ${saved}
Duplicate: ${duplicate}
Errors: ${errors}
`);

  return { saved, duplicate, errors };
};








const FALLBACK_IMAGE =
  "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";


  const isBadSourceImage = (url) => {
  return (
    url.includes("googleusercontent.com") ||
    url.includes("gstatic.com") ||
    url.includes("ytimg.com")
  );
};

const isGoodImage = (url) => {
  if (!url) return false;

  const badPatterns = [
    "logo",
    "icon",
    "default",
    "placeholder",
    "sprite",
    "ads",
    "base64",
  ];

  return (
    url.startsWith("http") &&
    !url.includes("news.google.com") &&
    !badPatterns.some((p) => url.toLowerCase().includes(p))
  );
};




const resolveUrl = async (url) => {
  if (!url.includes("news.google.com")) return url;

  try {
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);

    // 🔥 Get actual article link
    const realLink = $("a[href^='http']")
      .map((i, el) => $(el).attr("href"))
      .get()
      .find((link) => !link.includes("google.com"));

    return realLink || url;

  } catch {
    return url;
  }
};


  const getFinalImage = async (news, aiData) => {
  let image = null;

  // STEP 1: Resolve real article URL
  const articleUrl = await resolveUrl(news.link);

  // STEP 2: Try RSS image
  if (isGoodImage(news.imageUrl)) {
    console.log("✅ RSS image");
    image = news.imageUrl;
  }

  // STEP 3: Try OG image
  if (!image && articleUrl) {
    try {
      const og = await extractOgImage(articleUrl);

    //   if (isGoodImage(og)) {
    //     console.log("✅ OG image");
    //     image = og;
    //   }
    // } catch {
    //   console.log("⚠️ OG failed");
    // }

      if (isGoodImage(og) && !isBadSourceImage(og)) {
        console.log("✅ OG image (valid)");
        image = og;
      }
    } catch {
      console.log("⚠️ OG failed low quality or blocked source");
    }
  }

  // STEP 4: Try search-based image (YOUR EXISTING FUNCTION)
  if (!image) {
    try {
      const query = aiData?.title || news.title;
      const searched = await fetchRealImage(query);

      if (isGoodImage(searched)) {
        console.log("🔥 Search image");
        image = searched;
      }

      console.log("🔍 Search Debug:", {
  query,
  searched,
  valid: isGoodImage(searched),
});

    } catch {
      console.log("⚠️ Search failed");
    }
  }

  // STEP 5: Fallback
  if (!image) {
    console.log("⚠️ Fallback");
    image = FALLBACK_IMAGE;
  }


  console.log({
  rss: news.imageUrl,
  resolved: articleUrl,
  final: image,
});

  // STEP 6: Upload once (final step only)
  if (!image.includes("ik.imagekit.io")) {
    try {
      const uploaded = await uploadImageToImageKit(image);

      if (uploaded?.url) {
        console.log("✅ Uploaded");
        return uploaded.url;
      } 
    } catch {
      console.log("⚠️ Upload failed");
    }
  }

  return image;
};  









// // Step 0: Get real URL if Google News
// let realLink = news.link;
// if (news.link.includes("news.google.com")) {
//   realLink = await extractRealUrlFromGoogle(news.link);
// }

// // Step 1: Try OG image (only safe sources)
// // if (
// //   realLink &&
// //   !news.source.toLowerCase().includes("bhaskar") &&
// //   !news.source.toLowerCase().includes("patrika")
// // ) {
// //   try {
// //     ogImage = await withTimeout(
// //       extractOgImage(realLink),
// //       5000
// //     );
// //   } catch {}
// // }

// // // Step 2: Prefer OG
// // if (ogImage) {
// //   console.log("✅ OG image found");
// //   imageUrl = ogImage;
// // }

// // Step 3: Force fallback for junk images
// if (
//   !isValidImageUrl(imageUrl) ||
//   imageUrl.includes("trendkari") ||
//   imageUrl.includes("default")
// ) {
//   console.log("⚠️ Using fallback image");
//   imageUrl = await fetchRealImage(aiData.title);
// }

// // Step 4: Upload only external images
// let finalImage = imageUrl;

// if (!imageUrl.includes("ik.imagekit.io")) {
//   try {
//     const uploaded = await uploadImageToImageKit(imageUrl);
//     if (uploaded?.url) {
//       finalImage = uploaded.url;
//       console.log("✅ Uploaded");
//     }
//   } catch {
//     finalImage = await fetchRealImage(aiData.title);
//   }
// } else {
//   console.log("⚠️ Already hosted, skipping upload");
// }