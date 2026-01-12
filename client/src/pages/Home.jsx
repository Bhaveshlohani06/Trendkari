import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import toast from 'react-hot-toast';
import { Select, Skeleton } from 'antd';
import BlogCard from '../Components/BlogCard';
import { FiMapPin, FiSun, FiCloud, FiCloudRain } from 'react-icons/fi';
import { BsBuilding, BsGraphUp } from 'react-icons/bs';
import { FaLaughSquint, FaLandmark } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';
import MiniCard from '../Components/MiniCard';
import API from '../../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import AdBanner from '../Components/AdBanner';

const { Option } = Select;

const Home = () => {
  const [auth] = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Location state
  const [selectedLocation, setSelectedLocation] = useState('kota');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Define cities
  const cities = [
    { label: "Kota", value: "kota", color: "#1E3A8A" },
    { label: "Ramganj Mandi", value: "ramganjmandi", color: "#059669" },
    { label: "Sangod", value: "sangod", color: "#7C3AED" },
    { label: "Ladpura", value: "ladpura", color: "#22c9d5" },
    { label: "Kota Rural", value: "kota-rural", color: "#EA580C" },
  ];

  // Fetch posts by location
  const fetchPostsByLocation = async (location) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/post/get-posts`);
      
      if (data?.success && data.posts) {
        // Filter posts by location
        const filteredPosts = data.posts.filter(post => {
          if (!post.location) return false;
          
          const postLocation = post.location.toLowerCase().trim();
          const targetLocation = location.toLowerCase().trim();
          
          // Handle different location naming conventions
          if (targetLocation === 'kota' && postLocation === 'kota') {
            return true;
          }
          
          if (targetLocation === 'kota-rural' && (postLocation === 'rural' || postLocation === 'gramin')) {
            return true;
          }
          
          if (targetLocation === 'ramganjmandi' && postLocation.includes('ramganj')) {
            return true;
          }
          
          return postLocation === targetLocation;
        });
        
        setBlogs(filteredPosts);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Get weather data
  const getWeatherByCity = async (city) => {
    try {
      setWeatherLoading(true);
      const { data } = await API.get(`/weather?city=${city}`);

      if (data && data.temp !== undefined) {
        setWeather({
          temp: Math.round(data.temp),
          feelsLike: Math.round(data.feelsLike),
          condition: data.condition,
        });
      } else {
        setWeather(null);
      }
    } catch (error) {
      console.error("Weather fetch failed", error);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Get weather icon
  const getWeatherIcon = (condition = "") => {
    const text = condition.toLowerCase();
    if (text.includes("rain")) return <FiCloudRain className="me-1" />;
    if (text.includes("cloud")) return <FiCloud className="me-1" />;
    return <FiSun className="me-1" />;
  };

  // Handle location change
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    fetchPostsByLocation(location);
    getWeatherByCity(location);
  };

  // Initialize
  useEffect(() => {
    fetchPostsByLocation(selectedLocation);
    getWeatherByCity(selectedLocation);
  }, []);

  // Get current city info
  const getCurrentCity = () => cities.find(c => c.value === selectedLocation);

  // Group posts for carousel (3 per slide)
  const carouselSlides = [];
  if (blogs.length > 0) {
    for (let i = 0; i < blogs.length; i += 3) {
      carouselSlides.push(blogs.slice(i, i + 3));
    }
  }

  // Get posts by category
  const getPostsByCategory = (categorySlug) => {
    return blogs.filter(post => post.category?.slug === categorySlug).slice(0, 4);
  };

  return (
    <Layout>
      {/* Location Header with Weather */}
      <div className="location-header py-3" style={{
        backgroundColor: getCurrentCity()?.color || "#1E3A8A",
        color: "white",
      }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            {/* City Info with Weather */}
            <div className="d-flex align-items-center">
              <FiMapPin className="me-2 fs-5" />
              <div>
                <h5 className="mb-0 fw-bold">{getCurrentCity()?.label} News</h5>
                <small className="opacity-75">Hyperlocal updates from your area</small>
                
                {/* Weather Display */}
                <div className="d-flex align-items-center gap-2 mt-1 small">
                  {weatherLoading ? (
                    <span className="opacity-75">Loading weather…</span>
                  ) : weather ? (
                    <>
                      {getWeatherIcon(weather.condition)}
                      <span>
                        {weather.temp}°C · {weather.condition}
                      </span>
                      <span className="opacity-50">
                        • Feels like {weather.feelsLike}°C
                      </span>
                    </>
                  ) : (
                    <span className="opacity-75">Weather unavailable</span>
                  )}
                </div>
              </div>
            </div>

            {/* Location Selector */}
            <Select
              value={selectedLocation}
              onChange={handleLocationChange}
              style={{ width: 220 }}
              suffixIcon={<FiMapPin />}
              dropdownStyle={{ backgroundColor: "white" }}
            >
              {cities.map((city) => (
                <Option key={city.value} value={city.value}>
                  <div className="d-flex align-items-center">
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: city.color,
                      marginRight: 8,
                    }} />
                    {city.label}
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Location Tabs */}
      <div className="container-fluid bg-light py-2">
        <div className="container">
          <div className="d-flex overflow-auto">
            {cities.map(city => (
              <button
                key={city.value}
                className={`btn ${selectedLocation === city.value ? 'text-white' : 'text-dark'} rounded-pill me-2 px-3 py-2`}
                onClick={() => handleLocationChange(city.value)}
                style={{
                  backgroundColor: selectedLocation === city.value ? city.color : 'transparent',
                  border: `1px solid ${selectedLocation === city.value ? city.color : '#dee2e6'}`,
                  whiteSpace: 'nowrap',
                }}
              >
                <FiMapPin className="me-1" />
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {/* Posts Carousel */}
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="h5 fw-bold">Top Stories from {getCurrentCity()?.label}</h3>
            <div className="small text-muted">
              {loading ? 'Loading...' : `${blogs.length} posts`}
            </div>
          </div>

          {loading ? (
            <div className="row g-4">
              {[1, 2, 3].map(i => (
                <div className="col-md-4" key={i}>
                  <div className="card h-100">
                    <Skeleton.Image style={{ width: '100%', height: '200px' }} active />
                    <div className="card-body">
                      <Skeleton active paragraph={{ rows: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <Carousel indicators={carouselSlides.length > 1} controls={carouselSlides.length > 1}>
              {carouselSlides.map((slide, index) => (
                <Carousel.Item key={index}>
                  <div className="row g-4">
                    {slide.map(post => (
                      <div className="col-md-4" key={post._id}>
                        <BlogCard post={post} />
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-5 bg-light rounded">
              <p className="text-muted">No posts available for {getCurrentCity()?.label}</p>
            </div>
          )}
        </section>

        {/* Government Updates */}
        <section className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <BsBuilding className="me-2 fs-4 text-primary" />
            <h4 className="fw-bold m-0">Government Updates</h4>
          </div>

          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4].map(i => (
                <div className="col-md-3" key={i}>
                  <div className="card h-100">
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : getPostsByCategory('government').length > 0 ? (
            <div className="row g-4">
              {getPostsByCategory('government').map(post => (
                <div className="col-md-3" key={post._id}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-2">
                        <FaLandmark className="text-primary me-2" />
                        <small className="text-muted">Government</small>
                      </div>
                      <h6 className="card-title fw-bold">{post.title}</h6>
                      <p className="card-text small text-muted">
                        {post.description?.substring(0, 100)}...
                      </p>
                      <Link to={`/article/${encodeURIComponent(post.slug)}`} className="small text-primary text-decoration-none">
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <BsBuilding className="me-2" />
              No government updates for {getCurrentCity()?.label}
            </div>
          )}
        </section>

        {/* Local Community Updates */}
        {/* <section className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <FaLaughSquint className="me-2 fs-4 text-success" />
            <h4 className="fw-bold m-0">Local Community Updates</h4>
          </div>

          {loading ? (
            <div className="row">
              <div className="col-md-8">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
              <div className="col-md-4">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            </div>
          ) : getPostsByCategory('local').length > 0 ? (
            <div className="row g-4">
              <div className="col-md-8">
                {getPostsByCategory('local').slice(0, 3).map(post => (
                  <MiniCard key={post._id} post={post} />
                ))}
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Local Highlights</h6>
                    <p className="small text-muted">
                      Stay updated with the latest happenings in {getCurrentCity()?.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">
              <FaLaughSquint className="me-2" />
              No local updates for {getCurrentCity()?.label}
            </div>
          )}
        </section> */}

        {/* Business & Economy */}
        {/* <section className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <BsGraphUp className="me-2 fs-4 text-warning" />
            <h4 className="fw-bold m-0">Business & Economy</h4>
          </div>

          {loading ? (
            <div className="row g-4">
              {[1, 2].map(i => (
                <div className="col-md-6" key={i}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              ))}
            </div>
          ) : getPostsByCategory('business').length > 0 ? (
            <div className="row g-4">
              {getPostsByCategory('business').slice(0, 2).map(post => (
                <div className="col-md-6" key={post._id}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          ) : null}
        </section> */}

        {/* All Posts Grid */}
        {blogs.length > 0 && !loading && (
          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="fw-bold">All Posts from {getCurrentCity()?.label}</h4>
              <div className="small text-muted">
                Showing {blogs.length} posts
              </div>
            </div>
            
            <div className="row g-4">
              {blogs.map(post => (
                <div className="col-md-3" key={post._id}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ad Banner */}
        {/* <div className="my-5">
          <AdBanner />
        </div> */}
      </div>
    </Layout>
  );
};

export default Home;