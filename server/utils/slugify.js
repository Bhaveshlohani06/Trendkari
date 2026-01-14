import Sanscript from "@indic-transliteration/sanscript";

export const generateSlug = (text) => {
  if (!text) return "";

  // Hindi → IAST (roman)
const roman = Sanscript.t(text, "devanagari", "itrans");

  return roman
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
