export const generateSlug = (title) => {
  if (!title || typeof title !== "string") return null;

  let slug = title
    .normalize("NFC") // ✅ PRESERVE Hindi characters
    .trim()
    // replace spaces with hyphen
    .replace(/\s+/g, "-")
    // remove only unsafe chars, KEEP Hindi + matras
    .replace(/[^\p{Letter}\p{Mark}\p{Number}-]+/gu, "")
    // remove multiple hyphens
    .replace(/-+/g, "-")
    // trim hyphens
    .replace(/^-+|-+$/g, "");

  // FINAL SAFETY
  if (!slug) {
    slug = `article-${Date.now()}`;
  }

  return slug;
};
