// File: pages/advertise.jsx
import React from "react";
import Layout from "../Layout/Layout";

const advertiseOptions = [
  { title: "Single Post", price: "₹499", description: "One post on Trendkari for 24 hours." },
  { title: "Banner - 1 Week", price: "₹2,000", description: "Banner display on homepage for one week." },
  { title: "Banner - 1 Month", price: "₹4,000", description: "Banner display on homepage for one month." },
];

const benefits = [
  "Reach hyperlocal audience in Kota & nearby areas.",
  "Push notifications to users for instant reach.",
  "Email marketing to subscribers.",
  "Dedicated WhatsApp support for your campaign.",
  "Flexible ad placement options.",
];

const Advertise = () => {
  const whatsappLink =
    "https://api.whatsapp.com/send?phone=918696105184&text=Hello%20TrendKari,%20I%20want%20to%20advertise%20my%20business.";

  return (
    <Layout>
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Advertise Your Local Business</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Reach thousands of local users in Kota & nearby areas through posts, banners, and push notifications.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
        >
          Contact Us on WhatsApp
        </a>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Advertising Plans</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
          {advertiseOptions.map((option, idx) => (
            <div
              key={idx}
              className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-2">{option.title}</h3>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">{option.price}</p>
              <p className="mb-6">{option.description}</p>
              <a
                href={whatsappLink}
                target="_blank"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition transform"
              >
                Advertise Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Advertise With Us?</h2>
        <ul className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 bg-white dark:bg-gray-700 p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl mt-1">✓</span>
              <span className="text-left">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Business?</h2>
        <p className="mb-8 text-lg md:text-xl max-w-2xl mx-auto">
          Connect with thousands of potential customers in Kota instantly. Get your advertisement live today.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          Contact Us on WhatsApp
        </a>
      </section>

      {/* Fixed WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition transform z-50"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48a11.83 11.83 0 00-16.68 0c-4.64 4.63-4.64 12.13 0 16.76L1 23l2.8-5.12a11.83 11.83 0 0016.68 0c4.63-4.63 4.63-12.13 0-16.76zm-1.41 15.34a9.76 9.76 0 01-13.78 0 9.76 9.76 0 010-13.78 9.76 9.76 0 0113.78 0 9.76 9.76 0 010 13.78z" />
        </svg>
      </a>

      {/* Footer */}
      <footer className="py-8 bg-gray-200 dark:bg-gray-900 text-center text-gray-700 dark:text-gray-300 transition">
        &copy; {new Date().getFullYear()} TrendKari.in | Connecting Local Businesses to Kota
      </footer>
    </div>
    </Layout>
  );
};

export default Advertise;