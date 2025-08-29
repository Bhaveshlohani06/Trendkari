import React, { useEffect, useState, useRef } from 'react';
import Layout from '../Layout/Layout';
import toast from 'react-hot-toast';
import { Select, Skeleton } from 'antd';
import BlogCard from '../Components/BlogCard';
import { FiTrendingUp, FiClock, FiZap, FiArrowRight, FiUsers } from 'react-icons/fi';
import { BsLightningFill, BsNewspaper, BsGraphUp } from 'react-icons/bs';
import { FaLaughSquint, FaTshirt } from 'react-icons/fa';
import { MdOutlineScience, MdOutlineVideogameAsset } from 'react-icons/md';
import QuoteCard from '../Components/Quotes';
import MiniCard from '../Components/MiniCard';
import CategoryCarousel from '../Components/CategoryCarousel';
import CategoryNavbar from '../Components/CategoryNavbar';
import CategorySlider from '../Components/CategoryNavbar';
import API from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import AdBanner from '../Components/AdBanner';

const { Option } = Select;

const Home = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersToFollow, setUsersToFollow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

  // Get all posts
  const getAllPosts = async (pageNum = 1, limit = 20) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/post/get-posts?page=${pageNum}&limit=${limit}`);
      if (data?.success) {
        if (pageNum === 1) {
          setBlogs(data.posts);
        } else {
          setBlogs(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.posts.length === limit);
      }
    } catch (error) {
      console.log("Error fetching blogs", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };


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

  // Get users to follow
const getUsersToFollow = async () => {
  try {
    const token = auth?.token;
    // console.log("Token:", token);
    const { data } = await API.get('/user/users-to-follow', {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("Response:", data);
    
    if (data?.success) {
      setUsersToFollow(data.users);
    } else {
      toast.error('Unexpected response format');
    }
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    toast.error('Error while loading users');
  }
};


// Use your existing follow function
const handleFollow = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to follow users');
      return;
    } 

    const { data } = await API.post(`/auth/${userId}/follow`, {
        headers: { Authorization: `Bearer ${token}` }
      });

     setIsFollowing(data.following);
          setFollowersCount(prev => data.following ? prev + 1 : prev - 1);
          toast.success(data.following ? "Followed successfully!" : "Unfollowed successfully!");
        } catch (error) {
          toast.error("Failed to update follow status");
          console.error(error);
        }
      };


  // Infinite scroll setup
  const lastBlogElementRef = useRef();
  
  useEffect(() => {
    if (loading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (lastBlogElementRef.current) {
      observer.current.observe(lastBlogElementRef.current);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    getAllPosts(page);
  }, [page]);

  useEffect(() => {
    getAllCategories();
    getUsersToFollow();
  }, []);

  // Shuffle array function for dynamic content
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Get random posts for different sections
  const getRandomPosts = (categorySlug, count) => {
    const categoryPosts = blogs.filter(post => post.category?.slug === categorySlug);
    return shuffleArray(categoryPosts).slice(0, count);
  };

  // Skeleton components
  const MiniCardSkeleton = () => (
    <div className="card p-3 mini-card mb-3">
      <div className="d-flex gap-3">
        <Skeleton.Avatar active size={80} shape="square" />
        <div className="w-auto flex-grow-1">
          <Skeleton paragraph={{ rows: 2 }} active />
          <div className="d-flex justify-content-between">
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
          </div>
        </div>
      </div>
    </div>
  );

  const BlogCardSkeleton = () => (
    <div className="card h-100">
      <Skeleton.Image style={{ width: '100%', height: '180px' }} active />
      <div className="card-body">
        <Skeleton paragraph={{ rows: 2 }} active />
        <div className="d-flex justify-content-between">
          <Skeleton.Button active size="small" />
          <Skeleton.Button active size="small" />
        </div>
      </div>
    </div>
  );


  return (
    <Layout>
      {/* Category Navbar */}
      <CategorySlider />

      {/* Ad Banner */}
      <div className="my-4">
        <AdBanner />
      </div>

      {/* Hero Section with Skeleton */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {loading ? (
              <>
                <Skeleton.Input active size="large" className="mb-4" style={{ width: 400, height: 50 }} />
                <Skeleton paragraph={{ rows: 1 }} active style={{ maxWidth: 600, margin: '0 auto' }} />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark">
                  Trendkari — Your Viral Content Hub
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto text-dark">
                  Daily curated trends across tech, fashion, entertainment, memes & startups
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trending Now Section with Skeleton */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            {/* LEFT: Trending Now */}
            <div className="col-md-6">
              <div className="mb-3">
                <h2 className="h4 fw-bold text-dark d-flex align-items-center">
                  <BsLightningFill className="text-warning me-2" />
                  Trending Now
                </h2>
                <p className="text-muted">What's buzzing across the internet today</p>
              </div>

              {loading ? (
                <div className="d-flex flex-column gap-3">
                  {[...Array(6)].map((_, i) => (
                    <MiniCardSkeleton key={i} />
                  ))}
                </div>
              ) : blogs.filter((post) => post.isFeatured).length === 0 ? (
                <p className="text-muted">No trending posts found</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {shuffleArray(blogs.filter((post) => post.isFeatured))
                    .slice(0, 6)
                    .map((post) => (
                      <MiniCard key={post._id} post={post} />
                    ))}
                </div>
              )}
            </div>

            {/* RIGHT: What's Buzzing */}
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <FiTrendingUp className="text-warning me-2" />
                <h2 className="h4 fw-bold text-dark m-0">What's Buzzing on Trendkari?</h2>
              </div>
              <p className="text-muted mb-4">
                The trends here change fast, so stay tuned and stay curious.
              </p>

              {loading ? (
                <div className="row g-4">
                  {[...Array(4)].map((_, i) => (
                    <div className="col-md-6" key={i}>
                      <BlogCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row g-4">
                  {shuffleArray(blogs).slice(0, 4).map((post) => (
                    <div className="col-md-6" key={post._id}>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Users to Follow Carousel */}
      <section className="py-4 bg-white">
        <div className="container">
          <div className="d-flex align-items-center mb-4">
            <FiUsers className="text-primary me-2 fs-4" />
            <h3 className="h5 fw-bold mb-0">Trending Creators</h3>
            <Link to="/" className="ms-auto text-decoration-none small">
              View all <FiArrowRight className="ms-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="d-flex overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mx-2 text-center" style={{ minWidth: '100px' }}>
                  <Skeleton.Avatar active size={64} />
                  <Skeleton paragraph={{ rows: 1 }} active className="mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex overflow-auto pb-3">
              {usersToFollow.slice(0, 15).map((user) => (
                <div key={user._id} className="mx-2 text-center">
  <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
    <img
      src={user.avatar || "/default-avatar.png"}
      alt={user.name}
      className="rounded-circle border"
      style={{ width: "64px", height: "64px", objectFit: "cover", cursor: "pointer" }}
    />
    <p className="small fw-medium mt-2 mb-1">{user.name}</p>
  </Link>

  <button className="btn btn-outline-primary btn-sm" onClick={ () => handleFollow() }>Follow</button>
</div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-4 bg-white">
        <div className="container">
          <div><CategoryCarousel /></div>
        </div>
      </section>

      {/* Quote Section */}
      <div className="p-4">
        <QuoteCard />
      </div>

      {/* Latest Posts Section with Skeleton */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            {/* LEFT: Startup News */}
            <div className="col-md-6">
              <div className="mb-3">
                <h2 className="h4 fw-bold text-dark d-flex align-items-center">
                  <FiClock className="text-warning me-2" />
                  India's Hottest Startups – Daily Highlights
                </h2>
                <p className="text-muted">Stay ahead with real-time updates on emerging unicorns, disruptive ideas, and founder spotlights.</p>
              </div>

              {loading ? (
                <div className="d-flex flex-column gap-3">
                  {[...Array(6)].map((_, i) => (
                    <MiniCardSkeleton key={i} />
                  ))}
                </div>
              ) : getRandomPosts('startup-news', 6).length === 0 ? (
                <p className="text-muted">No startup posts found</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {getRandomPosts('startup-news', 6).map((post) => (
                    <MiniCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Politics */}
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <BsNewspaper className="text-warning me-2" />
                <h2 className="h4 fw-bold text-dark m-0">Politics</h2>
              </div>
              <p className="text-muted mb-4">
                Explore exciting updates and insights from the world of entertainment and pop culture.
              </p>

              {loading ? (
                <div className="row g-4">
                  {[...Array(4)].map((_, i) => (
                    <div className="col-md-6" key={i}>
                      <BlogCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row g-4">
                  {getRandomPosts('politics', 4).map((post) => (
                    <div className="col-md-6" key={post._id}>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

           
            <div className="my-4">
        <AdBanner />
      </div>


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

      {/* Tech and Fashion Section with Skeleton */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            {/* LEFT: Tech */}
            <div className="col-md-6">
              <div className="mb-3">
                <h2 className="h4 fw-bold text-dark d-flex align-items-center">
                  <MdOutlineScience className="text-warning me-2" />
                  What's Hot in Tech 2025
                </h2>
                <p className="text-muted">Fast, fresh, and futuristic — your daily dose of what's trending in the tech world.</p>
              </div>

              {loading ? (
                <div className="d-flex flex-column gap-3">
                  {[...Array(6)].map((_, i) => (
                    <MiniCardSkeleton key={i} />
                  ))}
                </div>
              ) : getRandomPosts('tech', 6).length === 0 ? (
                <p className="text-muted">No tech posts found</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {getRandomPosts('tech', 6).map((post) => (
                    <MiniCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Fashion */}
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <FaTshirt className="text-warning me-2" />
                <h2 className="h4 fw-bold text-dark m-0">Style Radar: Looks That Rule the Internet</h2>
              </div>
              <p className="text-muted mb-4">
                Catch the bold, the beautiful, and the bizarre—straight from Instagram, runways, and real streets.
              </p>

              {loading ? (
                <div className="row g-4">
                  {[...Array(4)].map((_, i) => (
                    <div className="col-md-6" key={i}>
                      <BlogCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row g-4">
                  {getRandomPosts('fashion', 4).map((post) => (
                    <div className="col-md-6" key={post._id}>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={lastBlogElementRef} className="text-center my-4">
          {loading ? (
            <Skeleton active />
          ) : (
            <button 
              className="btn btn-outline-primary"
              onClick={() => setPage(prev => prev + 1)}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Home;