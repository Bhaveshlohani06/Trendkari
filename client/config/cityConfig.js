export const CITY_CONFIG = {
  kota: {
    slug: "kota",
    label: "कोटा शहर",
    parent: null, // top-level city
    theme: {
      color: "#1E3A8A",
    },
    copy: {
      headline: "कोटा शहर की ताज़ा और भरोसेमंद खबरें",
    },
  },

  kota_rural: {
    slug: "kota-rural",
    label: "कोटा ग्रामीण",
    parent: "kota",
    theme: {
      color: "#2563EB",
    },
    copy: {
      headline: "कोटा ग्रामीण क्षेत्र की ज़मीनी खबरें",
    },
  },

  ladpura: {
    slug: "ladpura",
    label: "लाडपुरा",
    parent: "kota",
    theme: {
      color: "#0EA5E9",
    },
    copy: {
      headline: "लाडपुरा क्षेत्र की स्थानीय अपडेट्स",
    },
  },

  ramganjmandi: {
    slug: "ramganjmandi",
    label: "रामगंजमंडी",
    parent: null,
    theme: {
      color: "#059669",
    },
    copy: {
      headline: "रामगंजमंडी की ज़मीनी खबरें",
    },
  },

  sangod: {
    slug: "sangod",
    label: "सांगोद",
    parent: null,
    theme: {
      color: "#7C3AED",
    },
    copy: {
      headline: "सांगोद की लोकल अपडेट्स",
    },
  },
};

export default CITY_CONFIG;
