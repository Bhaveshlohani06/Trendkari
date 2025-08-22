// utils/hinduZodiac.js
const nakshatras = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
  "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export function getNakshatra(date) {
  const d = new Date(date);
  // Simple mock: assign nakshatra based on day of year
  const dayOfYear = Math.floor(
    (d - new Date(d.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  return nakshatras[dayOfYear % 27];
}
