import React, { useEffect, useState, useRef } from 'react';
import Layout from '../Layout/Layout';
import toast from 'react-hot-toast';
// import {ReactQuill} from 'react-quill';

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { Select } from 'antd';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Link } from 'react-router-dom';
import axios from 'axios';


const { Option } = Select;
const BACKEND_URL = `https://trendkari.onrender.com/api/v1/post`;





const Home = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  
        const [showModal, setShowModal] = useState(false);

        const [categories, setCategories] = useState([]);
        const [title, setTitle] = useState('');
        const [content, setContent] = useState('');
        const [category, setCategory] = useState('');
        const [image, setImage] = useState(null);
        const [tags, setTags] = useState('');
        const [isFeatured, setIsFeatured] = useState(false);
        // const [loading, setLoading] = useState(false);
        const [status, setStatus] = useState('draft');



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



    // Load categories
    const getAllCategories = async () => {
      try {
        const { data } = await API.get('/category/categories');
        if (data?.success) {
          setCategories(data?.categories);
        }
      } catch (error) {
        console.log(error);
        toast.error('Error while loading categories');
      }
    };
  
    useEffect(() => {
      getAllCategories();
    }, []);

    // Generate content with AI
   const generateAndHumanize = async () => {

    const token = localStorage.getItem("token");

  if (!title) {
    toast.error('Please enter a title');
    return;
  }

  if(!token){
      toast.error("Please login to generate content");
      return;
    }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    // Step 1: Generate raw AI content
    const genRes = await API.post(`${BACKEND_URL}/generate`,
      // `${BACKEND_URL}/generate`,
      { prompt: title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    const generated = genRes?.data?.content;

    if (!generated) {
      toast.error("Failed to generate content");
      return;
    }

    // Step 2: Send raw content to backend to humanize it
     const humRes = await API.post(`${BACKEND_URL}/humanize`, {
      htmlContent: generated
    }, {
      headers: {
        Authorization: `Bearer ${token}`  // ✅ Add token here too
      }
      });

    const humanized = humRes?.data?.content;  // ✅ match response key from backend

    if (!humanized) {
      toast.error("Failed to humanize content");
      return;
    }

    // Step 3: Load into editor
    setContent(humanized);
if (contentRef.current) {
  contentRef.current.innerHTML = humanized;
}

toast.success('Content generated and humanized!');
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  // Submit post handler
    const handleCreate = async (e) => {
          const token = localStorage.getItem("token");
          const user = JSON.parse(localStorage.getItem("user")); 

          if (!token) {
            toast.error("Please login to create a post");
            return;
          }

    
      e.preventDefault();
      try {
        const postData = new FormData();
        postData.append('title', title);
        const htmlContent = contentRef.current?.innerHTML || '';
        postData.append('content', htmlContent);
        postData.append('category', category);
        postData.append('status', status);
        postData.append('isFeatured', isFeatured);
        postData.append('image', image);
        postData.append('tags', tags);




    const { data } = await API.post("/post/create-post", postData,{
      headers: {
              Authorization: `Bearer ${token}`,
            },

          });

          if (data?.error) {
            toast.error(data?.message);
          } else {
            toast.success("Post Created Successfully");
            navigate('/explore');
          }
          
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong in creating the Post");
        }
      };
  
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

             <h5 className="mb-3 text-dark">
  {auth?.user?.name ? `(${auth.user.name})` : "Welcome"}
</h5>

        {/* Post Card */}
      <div className="card shadow-sm rounded mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <img
          src={auth?.user?.avatar || 'https://via.placeholder.com/40'}
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <input
              type="text"
              className="form-control rounded-pill bg-light border-0 ps-3"
              placeholder="What's on your mind...."
              onFocus={() => setShowModal(true)}
              style={{ height: '45px' }}
            />
          </div>
          <hr />
          <div className="d-flex justify-content-end">
            <button className="btn btn-dark d-flex" onClick={() => setShowModal(true)}>
              <i className="bi bi-pencil me-2"></i>
              Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create a Post</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                {/* Title */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

               

                {/* TinyMCE Editor */}
                <div
  ref={contentRef}
  contentEditable
  onInput={() => setContent(contentRef.current.innerHTML)} // updates content state
  style={{
    minHeight: '300px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#fff',
    fontSize: '16px',
    lineHeight: '1.6',
    direction: 'ltr', // 👈 Force Left-to-Right text direction
    textAlign: 'left',
  }}
  suppressContentEditableWarning={true}
>
  {content ? (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  ) : (
    'Start writing or wait for content to be generated...'
  )}
</div>

                      {/* Generate AI button */}
                      <button
                        className="btn btn-warning btn-sm m-3"
                        onClick={generateAndHumanize}
                        disabled={loading}
                        style={{ align: 'flex-start' }}
                      >
                        {loading ? 'Generating...' : 'Generate with AI'}
                      </button>


                {/* Category Dropdown */}
                <select
                  className="form-select mt-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
            {/* Image Upload */}
                 <label htmlFor="imageUpload" className="form-label">Post Image</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreate}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End of Modal */}


      




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

      {/* RIGHT: Trending */}
            <div className="col-md-6">
        <div className="d-flex align-items-center mb-3">
          <FiTrendingUp className="text-warning me-2" />          
          <h2 className="h4 fw-bold text-dark m-0">What’s Buzzing on Trendkari?</h2>
        </div>
        <p className="text-muted mb-4">
            The trends here change fast, so stay tuned and stay curious.        </p>

        <div className="row g-4">
          {blogs
            .filter((post) => post)
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