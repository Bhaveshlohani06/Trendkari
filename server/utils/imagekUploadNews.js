// utils/imageUpload.js
import fs from "fs";
import { imagekit }  from "../config/imaegkit.js";

// export const uploadImageToImageKit = async (imagePath, fileName) => {
//   try {
//     const fileBuffer = fs.readFileSync(imagePath);
//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: fileName,
//       folder: "/posts/news",
//     });
    
//     return imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { quality: "auto" },
//         { format: "webp" },
//         { width: "1280" },
//       ],
//     });
//   } catch (error) {
//     console.error("Image upload error:", error);
//     return null;
//   }
// };

// export const uploadImageToImageKit = async (imageUrl) => {

//   const response = await fetch(imageUrl);
//   const buffer = await response.arrayBuffer();

//   const uploadResponse = await imagekit.upload({
//     file: Buffer.from(buffer),
//     fileName: `news-${Date.now()}.jpg`,
//   });

//   return uploadResponse;
// };



export const uploadImageToImageKit = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    // 🔴 CRITICAL CHECK
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    // 🔴 Ensure it's actually an image
    if (!contentType || !contentType.startsWith("image")) {
      throw new Error("URL is not an image");
    }

    const buffer = await response.arrayBuffer();

    // 🔴 Avoid uploading tiny/broken files
    if (buffer.byteLength < 5000) {
      throw new Error("Image too small / corrupted");
    }

    const uploadResponse = await imagekit.upload({
      file: Buffer.from(buffer),
      fileName: `news-${Date.now()}.jpg`,
    });

    return uploadResponse;

  } catch (error) {
    console.error("❌ Image upload failed:", error.message);
    return null;
  }
};