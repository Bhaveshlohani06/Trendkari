// import Post from "../models/postModel.js";
// import slugify from "slugify";

// export const isDuplicate = async (title) => {
//   const existing = await Post.findOne({ title });
//   return !!existing;
// };




// export const savePost = async (news, content) => {
//   const slug = slugify(news.title, { lower: true });

//   return await Post.create({
//     title: news.title,
//     slug,
//     content,
//     source: news.link,
//     category: "hyperlocal",
//     status: "pending", // admin approval
//     createdAt: new Date()
//   });
// };

// import postModel from "../models/postmodel.js";
// import slugify from "slugify";

// export const savePost = async (data) => {
//   if (!data.title || !data.content) {
//     throw new Error("Title and content are required to save post");
//   }

//   // generate slug
//   const slug = slugify(data.title, { lower: true });

//   // prepare post data
//   const normalizedPost = {
//     title: data.title,
//     content: data.content,
//     tags: data.tags || [],
//     category: data.category,  // ObjectId from getNewsCategoryId()
//     author: data.author,      // ObjectId from getAdminUserId()
//     language: data.language === "hindi" ? "hi" : "en",
//     location: data.location,
//     slug,
//     status: "pending",
//     isPublished: false,
//     image: data.image || null,
//     source: data.source || null,
//   };

//   // save to DB
//   return await postModel.create(normalizedPost);
// };






// import postModel from "../models/postmodel.js";
// import slugify from "slugify";

// export const savePost = async (data) => {
//   if (!data.title || !data.content) {
//     throw new Error("Title and content are required to save post");
//   }

//   // generate base slug
//   let baseSlug = slugify(data.title, { lower: true, strict: true });

//   let slug = baseSlug;
//   let count = 1;

//   // check for duplicates in DB
//   while (await postModel.exists({ slug })) {
//     slug = `${baseSlug}-${count++}`; // append counter until unique
//   }

//   // prepare post data
//   const normalizedPost = {
//     title: data.title,
//     content: data.content,
//     tags: data.tags || [],
//     category: data.category,
//     author: data.author,
//     language: data.language === "hindi" ? "hi" : "en",
//     location: data.location,
//     slug,
//     status: "pending",
//     isPublished: false,
//     image: data.image || null,
//     source: data.source || null,
//   };

//   // save to DB
//   return await postModel.create(normalizedPost);
// };



// export const isDuplicate = async (title) => {
//   const existing = await postModel.findOne({ title });
//   return !!existing;
// };




import postModel from "../models/postmodel.js";
import slugify from "slugify";
import { generateSlug } from "../utils/slugify.js"; 


export const savePost = async (data) => {
  if (!data.title || !data.content) {
    throw new Error("Title and content are required to save post");
  }


  const baseSlug = generateSlug(data.title);
  if (!baseSlug) {
    return res.status(400).json({ message: "Slug generation failed" });
  }

  let slug = baseSlug;
  let count = 1;
  while (await postModel.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  // Prepare post data - ensure image is a URL string
  const normalizedPost = {
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    category: data.category,
    author: data.author,
    language: data.language === "hindi" ? "hi" : "en",
    location: data.location,
    slug: slug,
    status: "pending",
    isPublished: false,
    image: data.image || null, // This should be a URL string
    source: data.source || null,
    originalLink: data.originalLink || null,
  };

  // Save to DB
  return await postModel.create(normalizedPost);
};

export const isDuplicate = async (title) => {
  const existing = await postModel.findOne({ title });
  return !!existing;
};

// Check duplicate by link as well
export const isDuplicateByLink = async (link) => {
  const existing = await postModel.findOne({ originalLink: link });
  return !!existing;
};