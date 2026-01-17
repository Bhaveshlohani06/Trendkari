// import React from 'react';
// import Layout from '../Layout/Layout';

// const AboutUs = () => {
//   return (
//     <Layout>
//       <div
//         className="container py-5"
//         style={{ maxWidth: "800px" }}
//       >
//         <h1 className="fw-bold mb-3">About Trendkari</h1>

//         <p className="text-muted">
//           Trendkari is a <strong>hyperlocal content platform</strong> built to
//           bring you news, stories, and updates that matter — from your city,
//           your area, and your people.
//         </p>

//         <p>
//           In a world flooded with global news, we focus on what’s happening
//           <strong> around you</strong>. From local news and city updates to
//           trending topics, events, and community stories — Trendkari keeps you
//           informed, fast.
//         </p>

//         <h3 className="mt-4 fw-semibold">Our Mission</h3>
//         <p>
//           To create a trusted hyperlocal platform where people can easily
//           discover, read, and share content based on their
//           <strong> location, language, and interests</strong>.
//         </p>

//         <h3 className="mt-4 fw-semibold">What You’ll Find on Trendkari</h3>
//         <ul>
//           <li>📍 City & area-wise news and updates</li>
//           <li>🗞️ Local stories that don’t make national headlines</li>
//           <li>🔥 Trending topics from your neighborhood</li>
//           <li>🗣️ Community voices & regional creators</li>
//           <li>🌐 Content in your preferred language</li>
//         </ul>

//         <h3 className="mt-4 fw-semibold">Why Trendkari?</h3>
//         <p>
//           Because local matters. We believe every city, town, and neighborhood
//           has stories worth telling. Trendkari is designed to surface those
//           stories — simply, cleanly, and without noise.
//         </p>

//         <h3 className="mt-4 fw-semibold">Built for People, Not Just Pageviews</h3>
//         <p>
//           Trendkari is built with a reader-first mindset. No clutter, no fake
//           virality — just relevant content that helps you stay connected with
//           what’s happening nearby.
//         </p>

//         <h3 className="mt-4 fw-semibold">Join the Trendkari Community</h3>
//         <p>
//           Whether you’re a reader, a local writer, or a community contributor —
//           Trendkari is open for you.  
//           Have a story, update, or idea to share?
//         </p>

//         <p>
//           📩 Reach us at{" "}
//           <a href="mailto:contact@trendkari.com">
//             contact@trendkari.com
//           </a>
//         </p>

//         <p className="text-muted mt-4">
//           Trendkari — <strong>Local stories. Real voices. Your city.</strong>
//         </p>
//       </div>
//     </Layout>
//   );
// };

// export default AboutUs;


import React from "react";
import Layout from "../Layout/Layout";
import { useTheme } from "../context/ThemeContext";

const AboutUs = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout>
      <div
        className="container py-5"
        style={{ maxWidth: "800px" }}
      >
        {/* Heading + Dark Mode */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="fw-bold">Trendkari के बारे में</h1>

          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-outline-secondary"
          >
            {theme === "dark" ? "🌞 दिन मोड" : "🌙 रात मोड"}
          </button>
        </div>

        <p className="text-muted">
          Trendkari एक <strong>हाइपरलोकल डिजिटल प्लेटफॉर्म</strong> है —
          जो आपके शहर, आपके क्षेत्र और आपके आसपास की खबरों को
          सीधे आप तक पहुँचाने के लिए बनाया गया है।
        </p>

        <p>
          आज के समय में जब हर जगह केवल बड़ी और दूर की खबरें दिखाई जाती हैं,
          Trendkari उन खबरों पर ध्यान देता है जो
          <strong> आपके जीवन से जुड़ी होती हैं</strong> —
          आपकी गली, आपका मोहल्ला, आपका शहर।
        </p>

        <h3 className="mt-4 fw-semibold">हमारा उद्देश्य</h3>
        <p>
          हमारा उद्देश्य एक ऐसा भरोसेमंद मंच बनाना है जहाँ लोग
          <strong> अपने क्षेत्र, भाषा और रुचि</strong> के अनुसार
          सटीक और उपयोगी जानकारी प्राप्त कर सकें।
        </p>

        <h3 className="mt-4 fw-semibold">Trendkari पर आपको क्या मिलेगा</h3>
        <ul>
          <li>📍 शहर और क्षेत्र अनुसार खबरें</li>
          <li>🗞️ स्थानीय घटनाएँ और सच्ची ज़मीनी कहानियाँ</li>
          <li>🔥 आपके आसपास के ट्रेंड और चर्चाएँ</li>
          <li>🗣️ आम लोगों और स्थानीय रचनाकारों की आवाज़</li>
          <li>🕉️ संस्कृति, परंपरा और सामाजिक गतिविधियों से जुड़ा कंटेंट</li>
        </ul>

        <h3 className="mt-4 fw-semibold">Trendkari क्यों?</h3>
        <p>
          क्योंकि हम मानते हैं कि <strong>स्थानीय ही असली है</strong>।
          भारत की हर गली, हर कस्बा और हर शहर की अपनी एक पहचान होती है।
          Trendkari उसी पहचान को सामने लाने का प्रयास है।
        </p>

        <h3 className="mt-4 fw-semibold">
          भारतीय सोच, स्थानीय आत्मा
        </h3>
        <p>
          Trendkari भारतीय मूल्यों, सामाजिक जिम्मेदारी और
          <strong> “नर सेवा ही नारायण सेवा”</strong> की भावना से प्रेरित है।
          यहाँ कंटेंट केवल पढ़ने के लिए नहीं,
          बल्कि समाज को जोड़ने के लिए बनाया जाता है।
        </p>

        <h3 className="mt-4 fw-semibold">Trendkari समुदाय से जुड़िए</h3>
        <p>
          चाहे आप एक पाठक हों, स्थानीय लेखक हों,
          या अपने क्षेत्र की बात रखने वाला कोई भी नागरिक —
          Trendkari आपका मंच है।
        </p>

        <p>
          📩 संपर्क करें:{" "}
          <a href="mailto:contact@trendkari.com">
            contact@trendkari.com
          </a>
        </p>

        <p className="text-muted mt-4">
          Trendkari — <strong>आपका शहर। आपकी आवाज़। आपकी खबर।</strong>
        </p>
      </div>
    </Layout>
  );
};

export default AboutUs;