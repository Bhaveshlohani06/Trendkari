// utils/rashiFromName.js
const rashiMap = {
  mesh: { english: "Aries", hindi: "मेष" },
  vrishabh: { english: "Taurus", hindi: "वृषभ" },
  mithun: { english: "Gemini", hindi: "मिथुन" },
  kark: { english: "Cancer", hindi: "कर्क" },
  singh: { english: "Leo", hindi: "सिंह" },
  kanya: { english: "Virgo", hindi: "कन्या" },
  tula: { english: "Libra", hindi: "तुला" },
  vrishchik: { english: "Scorpio", hindi: "वृश्चिक" },
  dhanu: { english: "Sagittarius", hindi: "धनु" },
  makar: { english: "Capricorn", hindi: "मकर" },
  kumbh: { english: "Aquarius", hindi: "कुंभ" },
  meen: { english: "Pisces", hindi: "मीन" }
};

const nameToRashi = {
  a: "mesh", l: "mesh", e: "mesh", // Aries
  b: "dhanu", d: "mesh", f: "dhanu", h: "dhanu", // Sagittarius
  c: "mithun", j: "mithun", t: "mithun",
  k: "kark", q: "kark",
  s: "singh",
  v: "kanya",
  r: "tula",
  n: "vrishchik",
  g: "makar",
  o: "kumbh",
  m: "meen"
};

// export function getRashiFromName(name) {
//   if (!name) return null;
//   const firstLetter = name[0].toLowerCase();
//   const rashiKey = nameToRashi[firstLetter];
//   return rashiMap[rashiKey] || null;
// }

export function getRashiFromName(name) {
  if (!name) return { english: "General", hindi: "सामान्य" };

  const firstLetter = name.trim()[0].toLowerCase();
  const rashiKey = nameToRashi[firstLetter];

  if (rashiKey && rashiMap[rashiKey]) {
    return rashiMap[rashiKey];
  }

  // fallback so it never breaks
  return { english: "General", hindi: "सामान्य" };
}
