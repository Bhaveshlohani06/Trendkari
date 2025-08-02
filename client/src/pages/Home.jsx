import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import BlogCard from '../Components/BlogCard';
import { FiTrendingUp, FiClock, FiZap, FiArrowRight } from 'react-icons/fi';
import { BsLightningFill, BsNewspaper, BsGraphUp } from 'react-icons/bs';
import { FaLaughSquint, FaTshirt } from 'react-icons/fa';
import { MdOutlineScience, MdOutlineVideogameAsset } from 'react-icons/md';
import QuoteCard from '../Components/Quotes';
import MiniCard from '../Components/MiniCard';
import Carousel from 'react-bootstrap/Carousel';
import CategoryCarousel from '../Components/CategoryCarousel';
import API from '../../utils/api';



const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/post/get-posts");
      if (data?.success) {
        setBlogs(data.posts);
      }
    } catch (error) {
      console.log("Error fetching blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark">
              Trendkari — Your Viral Content Hub
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-dark">
              Daily curated trends across tech, fashion, entertainment, memes & startups
            </p>
            {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition flex items-center">
                <FiTrendingUp className="mr-2" /> Explore Trends
              </button>
              <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center">
                <FiClock className="mr-2" /> Today's Picks
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Trending Now Section */}
<section className="py-5 bg-light">
  <div className="container">
    <div className="row">

      {/* LEFT: Entertainment */}
      <div className="col-md-6">
        <div className="d-flex align-items-center mb-3">
          <FiTrendingUp className="text-warning me-2" />          
          <h2 className="h4 fw-bold text-dark m-0">Top AI Trends You Can’t Miss</h2>
        </div>
        <p className="text-muted mb-4">
          Explore how artificial intelligence is transforming everything from music to memes in real time.
        </p>

        <div className="row g-4">
          {blogs
            .filter((post) => post.category.slug === "ai-trends")
            .slice(0, 4)
            .map((post) => (
              <div className="col-md-6" key={post._id}>
                <BlogCard post={post} />
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT: Trending */}
      <div className="col-md-6">
  <div className="mb-3">
    <h2 className="h4 fw-bold text-dark d-flex align-items-center">
      <BsLightningFill className="text-warning me-2" />
      Trending Now
    </h2>
    <p className="text-muted">What's buzzing across the internet today</p>
  </div>

  {blogs.length === 0 ? (
    <p className="text-muted">No trending posts found</p>
  ) : (
    <div className="d-flex flex-column gap-3">
      {blogs
        .filter((post) => post.isFeatured)
        .slice(0, 6)
        .map((post) => (
          <MiniCard key={post._id} post={post} />
        ))}
    </div>
  )}
</div>

    </div>
  </div>
</section>






      {/* Categories Section */}
       <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
<div><CategoryCarousel/></div>

      </div>
    </section>

      {/* Quote Section */}
      <div className="p-4">
      <QuoteCard />
      
    </div>



      {/* Latest Posts Section */}
      <section className="py-5 bg-light">
  <div className="container">
    <div className="row">

      {/* LEFT: Entertainment */}
      <div className="col-md-6">
  <div className="mb-3">
    <h2 className="h4 fw-bold text-dark d-flex align-items-center">
      <FiClock className="text-warning me-2" />
      India’s Hottest Startups – Daily Highlights
    </h2>
    <p className="text-muted">Stay ahead with real-time updates on emerging unicorns, disruptive ideas, and founder spotlights.</p>
  </div>

  {blogs.length === 0 ? (
    <p className="text-muted">No trending posts found</p>
  ) : (
    <div className="d-flex flex-column gap-3">
      {blogs
        .filter((post) => post.category.slug === "startup-news")
        .slice(0, 6)
        .map((post) => (
          <MiniCard key={post._id} post={post} />
        ))}
    </div>
  )}
</div>

      {/* RIGHT: Trending */}
      <div className="col-md-6">
        <div className="d-flex align-items-center mb-3">
          <BsNewspaper className="text-warning me-2" />          
          <h2 className="h4 fw-bold text-dark m-0">Politics</h2>
        </div>
        <p className="text-muted mb-4">
          Explore exciting updates and insights from the world of entertainment and pop culture.
        </p>

        <div className="row g-4">
          {blogs
            .filter((post) => post.category.slug === "politics")
            .slice(0, 4)
            .map((post) => (
              <div className="col-md-6" key={post._id}>
                <BlogCard post={post} />
              </div>
            ))}
        </div>
      </div>

    </div>
  </div>
</section>

      {/* CTA Section */}
  <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
  <div className="container text-center">
    <h2 className="fw-semibold mb-3">Stay Updated with Daily Viral Trends</h2>
    <p className="text-muted mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      Get the latest buzz in tech, fashion, memes, and more—delivered straight to your inbox.
    </p>

    <form
      className="row g-2 justify-content-center align-items-center"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <div className="col-12 col-sm-8">
        <input
          type="email"
          className="form-control rounded-2"
          placeholder="Your email address"
          required
        />
      </div>
      <div className="col-12 col-sm-4">
        <button
          type="submit"
          className="btn btn-dark w-100 fw-medium"
          style={{ padding: "10px 0" }}
        >
          Subscribe
        </button>
      </div>
    </form>

    <p className="text-muted mt-3 small">
      No spam, just useful updates. Unsubscribe anytime.
    </p>
  </div>
</section>


{/* Blogs */}

<section className="py-5 bg-light">
  <div className="container">
    <div className="row">

      {/* LEFT: Entertainment */}
      <div className="col-md-6">
  <div className="mb-3">
    <h2 className="h4 fw-bold text-dark d-flex align-items-center">
      <MdOutlineScience className="text-warning me-2" />
      What’s Hot in Tech 2025
    </h2>
    <p className="text-muted">Fast, fresh, and futuristic — your daily dose of what’s trending in the tech world.</p>
  </div>

  {blogs.length === 0 ? (
    <p className="text-muted">No trending posts found</p>
  ) : (
    <div className="d-flex flex-column gap-3">
      {blogs
        .filter((post) => post.category.slug === "tech")
        .slice(0, 6)
        .map((post) => (
          <MiniCard key={post._id} post={post} />
        ))}
    </div>
  )}
</div>

      {/* RIGHT: Trending */}
      <div className="col-md-6">
        <div className="d-flex align-items-center mb-3">
          <FaTshirt className="text-warning me-2" />          
          <h2 className="h4 fw-bold text-dark m-0">Style Radar: Looks That Rule the Internet</h2>
        </div>
        <p className="text-muted mb-4">
         Catch the bold, the beautiful, and the bizarre—straight from Instagram, runways, and real streets.
        </p>

        <div className="row g-4">
          {blogs
            .filter((post) => post.category.slug === "fashion")
            .slice(0, 4)
            .map((post) => (
              <div className="col-md-6" key={post._id}>
                <BlogCard post={post} />
              </div>
            ))}
        </div>
      </div>

    </div>
  </div>
</section>




    </Layout>
  );
};

export default Home;