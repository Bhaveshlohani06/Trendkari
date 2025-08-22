import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Layout from "../Layout/Layout";

const DailyHoroscope = () => {
  const [user, setUser] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!u || !token) {
      setLoading(false);
      return;
    }

    setUser(u);
    fetchHoroscope(token);
  }, []);

  const fetchHoroscope = async (token) => {
    setLoading(true);
    try {
      const res = await API.get("/horoscope/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHoroscope(res.data);
    } catch (err) {
      console.error("Error fetching horoscope:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading your horoscope...</p>;
  if (!horoscope) return <p className="text-center mt-5">No horoscope found for today.</p>;

  return (
    <Layout>
      <div className="container mt-5 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Hello, {user?.name || "Friend"}</h1>
        <p className="text-gray-500 mb-4">
          Zodiac/Nakshatra: {user.zodiacSign} | Date:{" "}
          {new Date(horoscope.generatedAt).toLocaleDateString()}
        </p>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-semibold mb-3">{horoscope.title}</h2>
          <p className="text-gray-700 mb-4">{horoscope.summary}</p>

          {horoscope.sections?.map((sec, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold">{sec.heading}</h3>
              <p className="text-gray-600">{sec.text}</p>
            </div>
          ))}

          {horoscope.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {horoscope.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-sm px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DailyHoroscope;
