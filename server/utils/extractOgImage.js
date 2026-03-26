import axios from "axios";
import * as cheerio from "cheerio";

// export const extractOgImage = async (url) => {
//   try {
//     const { data } = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//       },
//       timeout: 10000,
//     });

//     const $ = cheerio.load(data);

//     // ✅ Primary: og:image
//     const ogImage = $('meta[property="og:image"]').attr("content");
//     if (ogImage) return ogImage;

//     // ✅ Secondary: twitter:image
//     const twitterImage = $('meta[name="twitter:image"]').attr("content");
//     if (twitterImage) return twitterImage;

//     // ✅ Fallback: first <img>
//     const firstImg = $("img").first().attr("src");
//     if (firstImg && firstImg.startsWith("http")) return firstImg;

//     return null;

//   } catch (error) {
//     console.log("❌ OG image extraction failed:", error.message);
//     return null;
//   }
// };


const extractOgImage = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(res.data);

    // Priority order
    
    // ✅ Primary: og:image
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) return ogImage;

    // ✅ Secondary: twitter:image
    const twitterImage = $('meta[name="twitter:image"]').attr("content");
    if (twitterImage) return twitterImage;

    // ✅ Fallback: first <img>
    const firstImg = $("img").first().attr("src");
    if (firstImg && firstImg.startsWith("http")) return firstImg;

    return (
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[property="og:image:url"]').attr("content") ||
      null
    );

  } catch (err) {
    return null;
  }
};