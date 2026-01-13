import slugify from "slugify";
import {transliterate} from "transliteration";

// export const generateSlug = (text) => {
//   return slugify(text, {
//     lower: true,
//     strict: true,
//     locale: "en",
//     trim: true
//   });
// };



export const generateSlug = (text) => {
  if (!text) return "";

  return transliterate(text)       // convert Hindi → roman
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")  // non-alphanum → dash
    .replace(/(^-|-$)/g, "");     // trim extra dashes
};




export const hindiToRoman = (text) => {
  return transliterate(text, "hi", "en");
};
