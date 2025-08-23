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

// More accurate mapping with Hindi phonetics
const nameToRashi = {
  // Aries (मेष) – अ, च, ल
  a: "mesh", aa: "mesh", i: "mesh", e: "mesh", o: "mesh", u: "mesh", "च": "mesh", "ल": "mesh",

  // Taurus (वृषभ) – ब, व, उ
  "ब": "vrishabh", "व": "vrishabh", b: "vrishabh", v: "vrishabh",

  // Gemini (मिथुन) – क, घ
  "क": "mithun", "घ": "mithun", k: "mithun", g: "mithun",

  // Cancer (कर्क) – ड, ह
  "ड": "kark", "ह": "kark", d: "kark", h: "kark",

  // Leo (सिंह) – म, ट
  "म": "singh", "ट": "singh", m: "singh", t: "singh",

  // Virgo (कन्या) – प, ठ, ण
  "प": "kanya", "ठ": "kanya", "ण": "kanya", p: "kanya", n: "kanya",

  // Libra (तुला) – र, त
  "र": "tula", "त": "tula", r: "tula",

  // Scorpio (वृश्चिक) – न, य
  "न": "vrishchik", "य": "vrishchik", n: "vrishchik", y: "vrishchik",

  // Sagittarius (धनु) – भ, फ, ध
  "भ": "dhanu", "फ": "dhanu", "ध": "dhanu", bh: "dhanu", ph: "dhanu", dh: "dhanu",

  // Capricorn (मकर) – ख, ज
  "ख": "makar", "ज": "makar", kh: "makar", j: "makar",

  // Aquarius (कुंभ) – ग, स, श
  "ग": "kumbh", "स": "kumbh", "श": "kumbh", g: "kumbh", s: "kumbh",

  // Pisces (मीन) – द, च, थ, ञ
  "द": "meen", "च": "meen", "थ": "meen", "ञ": "meen", d: "meen"
};



export function getRashiFromName(name) {
  if (!name) return { english: "General", hindi: "सामान्य" };

  const cleanName = name.trim();
  if (!cleanName) return { english: "General", hindi: "सामान्य" };

  // 1️⃣ Detect if Hindi/Devanagari
  const firstChar = cleanName[0];
  const isHindi = /[\u0900-\u097F]/.test(firstChar);

  let rashiKey = null;

  if (isHindi) {
    // direct Hindi mapping
    rashiKey = nameToRashi[firstChar];
  } else {
    // 2️⃣ Handle English phonetics (check 2 letters first)
    const firstTwo = cleanName.slice(0, 2).toLowerCase();
    if (nameToRashi[firstTwo]) {
      rashiKey = nameToRashi[firstTwo];
    } else {
      // fallback: single letter
      const firstLetter = cleanName[0].toLowerCase();
      rashiKey = nameToRashi[firstLetter];
    }
  }

  if (rashiKey && rashiMap[rashiKey]) {
    return rashiMap[rashiKey];
  }

  // fallback so it never breaks
  return { english: "General", hindi: "सामान्य" };
}





