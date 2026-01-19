// import React, { useEffect, useState } from 'react';
// import Layout from '../Layout/Layout';
// import toast from 'react-hot-toast';
// import { Select, Skeleton } from 'antd';
// import BlogCard from '../Components/BlogCard';
// import { FiMapPin, FiSun, FiCloud, FiCloudRain } from 'react-icons/fi';
// import { BsBuilding, BsGraphUp } from 'react-icons/bs';
// import { FaLaughSquint, FaLandmark } from 'react-icons/fa';
// import { Carousel } from 'react-bootstrap';
// import MiniCard from '../Components/MiniCard';
// import API from '../../utils/api';
// import { Link } from 'react-router-dom';  
// import { useAuth } from '../context/auth';
// import AdBanner from '../Components/AdBanner';
// import { useLocation } from '../context/LocationContext.jsx';
// import { requestNotificationPermission } from '../firebase';

// const { Option } = Select;





// const Home = () => {
//   const [auth] = useAuth();
//   const [blogs, setBlogs] = useState([]);
//   // const [loading, setLoading] = useState(true);
  
//   // Location state
//   // const [selectedLocation, setSelectedLocation] = useState('kota');
//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//     const { location, changeLocation } = useLocation();
//   const [selectedLocation, setSelectedLocation] = useState(location);


//   const [posts, setPosts] = useState([]);
// const [page, setPage] = useState(1);
// const [hasMore, setHasMore] = useState(true);
// const [loading, setLoading] = useState(false);



  

//     useEffect(() => {
//     requestNotificationPermission();
//   }, []);


//   // Define cities
//   const cities = [
//     { label: "Kota", value: "kota", color: "#1E3A8A" },
//     { label: "Ramganj Mandi", value: "ramganjmandi", color: "#059669" },
//     { label: "Sangod", value: "sangod", color: "#7C3AED" },
//     { label: "Ladpura", value: "ladpura", color: "#22c9d5" },
//     { label: "Kota Rural", value: "kota-rural", color: "#EA580C" },
//   ];

//   // // Fetch posts by location
//   // const fetchPostsByLocation = async (location) => {
//   //   try {
//   //     setLoading(true);
//   //     const { data } = await API.get(`/post/get-posts`);
      
//   //     if (data?.success && data.posts) {  
//   //       // Filter posts by location
//   //       const filteredPosts = data.posts.filter(post => {
//   //         if (!post.location) return false;
          
//   //         const postLocation = post.location.toLowerCase().trim();
//   //         const targetLocation = location.toLowerCase().trim();
          
//   //         // Handle different location naming conventions
//   //         if (targetLocation === 'kota' && postLocation === 'kota') {
//   //           return true;
//   //         }
          
//   //         if (targetLocation === 'kota-rural' && (postLocation === 'rural' || postLocation === 'gramin')) {
//   //           return true;
//   //         }
          
//   //         if (targetLocation === 'ramganjmandi' && postLocation.includes('ramganj')) {
//   //           return true;
//   //         }
          
//   //         return postLocation === targetLocation;
//   //       });
        
//   //       setBlogs(filteredPosts);
//   //     }
//   //   } catch (error) {
//   //     console.log("Error fetching posts:", error);
//   //     toast.error("Failed to load posts");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // Fetch posts with pagination

//   const fetchPosts = async (pageNo = 1) => {
//   if (loading || !hasMore) return;

//   try {
//     setLoading(true);

//     const { data } = await API.get(
//       `/post/get-posts?location=${location}&page=${pageNo}&limit=10`
//     );

//     if (data?.posts?.length === 0) {
//       setHasMore(false);
//       return;
//     }

//     setPosts((prev) => [...prev, ...data.posts]);
//     setPage(pageNo + 1);
//   } catch (err) {
//     console.error("Failed to load posts");
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   setPosts([]);
//   setPage(1);
//   setHasMore(true);
//   fetchPosts(1);
// }, [location]);





//   // Get weather data
//   const getWeatherByCity = async (city) => {
//     try {
//       setWeatherLoading(true);
//       const { data } = await API.get(`/weather?city=${city}`);

//       if (data && data.temp !== undefined) {
//         setWeather({
//           temp: Math.round(data.temp),
//           feelsLike: Math.round(data.feelsLike),
//           condition: data.condition,
//         });
//       } else {
//         setWeather(null);
//       }
//     } catch (error) {
//       console.error("Weather fetch failed", error);
//       setWeather(null);
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   // Get weather icon
//   const getWeatherIcon = (condition = "") => {
//     const text = condition.toLowerCase();
//     if (text.includes("rain")) return <FiCloudRain className="me-1" />;
//     if (text.includes("cloud")) return <FiCloud className="me-1" />;
//     return <FiSun className="me-1" />;
//   };

//   // Handle location change
//   const handleLocationChange = (location) => {
//     setSelectedLocation(location);
//     // fetchPostsByLocation(location);
//     getWeatherByCity(location);
//   };

//   // Initialize
// useEffect(() => {
//   fetchPostsByLocation(location);
// }, [location]);

//   // Get current city info
//   const getCurrentCity = () => cities.find(c => c.value === selectedLocation);

//   // Group posts for carousel (3 per slide)
//   const carouselSlides = [];
//   if (blogs.length > 0) {
//     for (let i = 0; i < blogs.length; i += 3) {
//       carouselSlides.push(blogs.slice(i, i + 3));
//     }
//   }

//   // Get posts by category
//   const getPostsByCategory = (categorySlug) => {
//     return blogs.filter(post => post.category?.slug === categorySlug).slice(0, 4);
//   };

//   return (
//     <Layout
//       title="Home - Trendkari"
//       description="Stay updated with the latest news and articles from Trendkari. Explore insights on local events, government updates, business trends, and community stories tailored for Kota and surrounding areas."
//       keywords="Trendkari, News, Articles, Local Events, Government Updates, Business Trends, Community Stories, Kota News, Rajasthan News"  
//     >
//       {/* Location Header with Weather */}
//       <div className="location-header py-3" style={{
//         backgroundColor: getCurrentCity()?.color || "#1E3A8A",
//         width: "25%",
//         height: "60px",
//         color: "white",
//         borderRadius: "8px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         marginBottom: "20px",
//       }}>
//         <div className="container">
//           <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">

//             {/* Location Selector */}
//             <Select
//               value={selectedLocation}
//               onChange={handleLocationChange}
//               style={{ width: 200 }}
//               suffixIcon={<FiMapPin />}
//               backgroundColor="white"
//               textColor="black"
//               dropdownStyle={{ backgroundColor: "white" }}
//             >
//               {cities.map((city) => (
//                 <Option key={city.value} value={city.value}>
//                   <div className="d-flex align-items-center">
//                     <span style={{
//                       width: 10,
//                       height: 10,
//                       borderRadius: "50%",
//                       backgroundColor: city.color,
//                       marginRight: 8,
//                     }} />
//                     {city.label}
//                   </div>
//                 </Option>
//               ))}
//             </Select>
            
//           </div>
//         </div>
//       </div>

//       {/* Location Tabs */}
//       {/* <div className="container-fluid bg-light py-2">
//         <div className="container">
//           <div className="d-flex overflow-auto">
//             {cities.map(city => (
//               <button
//                 key={city.value}
//                 className={`btn ${selectedLocation === city.value ? 'text-white' : 'text-dark'} rounded-pill me-2 px-3 py-2`}
//                 onClick={() => handleLocationChange(city.value)}
//                 style={{
//                   backgroundColor: selectedLocation === city.value ? city.color : 'transparent',
//                   border: `1px solid ${selectedLocation === city.value ? city.color : '#dee2e6'}`,
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 <FiMapPin className="me-1" />
//                 {city.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div> */}

//       <div className="container mt-4">
//         {/* Posts Carousel */}
//         <section className="mb-5">
//           <div className="d-flex align-items-center justify-content-between mb-4">
//             <h3 className="h5 fw-bold">Top Stories from {getCurrentCity()?.label}</h3>
//             <div className="small text-muted">
//               {loading ? 'Loading...' : `${blogs.length} posts`}
//             </div>
//           </div>

//           {loading ? (
//             <div className="row g-4">
//               {[1, 2, 3].map(i => (
//                 <div className="col-md-4" key={i}>
//                   <div className="card h-100">
//                     <Skeleton.Image style={{ width: '100%', height: '200px' }} active />
//                     <div className="card-body">
//                       <Skeleton active paragraph={{ rows: 2 }} />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : blogs.length > 0 ? (
//             <Carousel indicators={carouselSlides.length > 1} controls={carouselSlides.length > 1}>
//               {carouselSlides.map((slide, index) => (
//                 <Carousel.Item key={index}>
//                   <div className="row g-4">
//                     {slide.map(post => (
//                       <div className="col-md-4" key={post._id}>
//                         <BlogCard post={post} />
//                       </div>
//                     ))}
//                   </div>
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           ) : (
//             <div className="text-center py-5 bg-light rounded">
//               <p className="text-muted">No posts available for {getCurrentCity()?.label}</p>
//             </div>
//           )}
//         </section>

//         {/* Government Updates */}
//         <section className="mb-5">
//           <div className="d-flex align-items-center mb-4">
//             <BsBuilding className="me-2 fs-4 text-primary" />
//             <h4 className="fw-bold m-0">Government Updates</h4>
//           </div>

//           {loading ? (
//             <div className="row g-4">
//               {[1, 2, 3, 4].map(i => (
//                 <div className="col-md-3" key={i}>
//                   <div className="card h-100">
//                     <Skeleton active paragraph={{ rows: 3 }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : getPostsByCategory('government').length > 0 ? (
//             <div className="row g-4">
//               {getPostsByCategory('government').map(post => (
//                 <div className="col-md-3" key={post._id}>
//                   <div className="card h-100 border-0 shadow-sm">
//                     <div className="card-body">
//                       <div className="d-flex align-items-start mb-2">
//                         <FaLandmark className="text-primary me-2" />
//                         <small className="text-muted">Government</small>
//                       </div>
//                       <h6 className="card-title fw-bold">{post.title}</h6>
//                       <p className="card-text small text-muted">
//                         {post.description?.substring(0, 100)}...
//                       </p>
//                       <Link to={`/article/${encodeURIComponent(post.slug)}`} className="small text-primary text-decoration-none">
//                         Read more →
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="alert alert-info">
//               <BsBuilding className="me-2" />
//               No government updates for {getCurrentCity()?.label}
//             </div>
//           )}
//         </section>

//         {/* Local Community Updates */}
//         {/* <section className="mb-5">
//           <div className="d-flex align-items-center mb-4">
//             <FaLaughSquint className="me-2 fs-4 text-success" />
//             <h4 className="fw-bold m-0">Local Community Updates</h4>
//           </div>

//           {loading ? (
//             <div className="row">
//               <div className="col-md-8">
//                 <Skeleton active paragraph={{ rows: 4 }} />
//               </div>
//               <div className="col-md-4">
//                 <Skeleton active paragraph={{ rows: 4 }} />
//               </div>
//             </div>
//           ) : getPostsByCategory('local').length > 0 ? (
//             <div className="row g-4">
//               <div className="col-md-8">
//                 {getPostsByCategory('local').slice(0, 3).map(post => (
//                   <MiniCard key={post._id} post={post} />
//                 ))}
//               </div>
//               <div className="col-md-4">
//                 <div className="card border-0 shadow-sm h-100">
//                   <div className="card-body">
//                     <h6 className="fw-bold mb-3">Local Highlights</h6>
//                     <p className="small text-muted">
//                       Stay updated with the latest happenings in {getCurrentCity()?.label}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="alert alert-info">
//               <FaLaughSquint className="me-2" />
//               No local updates for {getCurrentCity()?.label}
//             </div>
//           )}
//         </section> */}

//         {/* Business & Economy */}
//         {/* <section className="mb-5">
//           <div className="d-flex align-items-center mb-4">
//             <BsGraphUp className="me-2 fs-4 text-warning" />
//             <h4 className="fw-bold m-0">Business & Economy</h4>
//           </div>

//           {loading ? (
//             <div className="row g-4">
//               {[1, 2].map(i => (
//                 <div className="col-md-6" key={i}>
//                   <Skeleton active paragraph={{ rows: 4 }} />
//                 </div>
//               ))}
//             </div>
//           ) : getPostsByCategory('business').length > 0 ? (
//             <div className="row g-4">
//               {getPostsByCategory('business').slice(0, 2).map(post => (
//                 <div className="col-md-6" key={post._id}>
//                   <BlogCard post={post} />
//                 </div>
//               ))}
//             </div>
//           ) : null}
//         </section> */}

//         {/* All Posts Grid */}
//         {blogs.length > 0 && !loading && (
//           <section className="mb-5">
//             <div className="d-flex align-items-center justify-content-between mb-4">
//               <h4 className="fw-bold">All Posts from {getCurrentCity()?.label}</h4>
//               <div className="small text-muted">
//                 Showing {blogs.length} posts
//               </div>
//             </div>
            
//             <div className="row g-4">
//               {blogs.map(post => (
//                 <div className="col-md-3" key={post._id}>
//                   <BlogCard post={post} />
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Ad Banner */}
//         {/* <div className="my-5">
//           <AdBanner />
//         </div> */}
//       </div>
//     </Layout>
//   );
// };

// export default Home;


// import React, { useEffect, useRef, useState } from "react";
// import Layout from "../Layout/Layout";
// import { Skeleton } from "antd";
// import toast from "react-hot-toast";
// import { Carousel } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import API from "../../utils/api";

// import BlogCard from "../Components/BlogCard";
// import MiniCard from "../Components/MiniCard";
// import { useLocation } from "../context/LocationContext.jsx";

// import {
//   FiSun,
//   FiCloud,
//   FiCloudRain,
// } from "react-icons/fi";
// import {
//   BsBuilding,
// } from "react-icons/bs";
// import { FaLandmark } from "react-icons/fa";
// import CITY_CONFIG from "../../config/cityConfig.js";

// /* ---------------- CITY CONFIG ---------------- */

// const CITIES = [
//   { label: "कोटा", value: "kota", color: "#1E3A8A" },
//   { label: "रामगंजमंडी", value: "ramganjmandi", color: "#059669" },
//   { label: "सांगोद", value: "sangod", color: "#7C3AED" },
//   { label: "लाडपुरा", value: "ladpura", color: "#0EA5E9" },
//   { label: "ग्रामीण कोटा", value: "rural-kota", color: "#EA580C" },
// ];

// /* ---------------- HOME PAGE ---------------- */

// const Home = () => {
//   const { location } = useLocation();

//   /* ---------- POST STATES ---------- */
//   const [blogs, setBlogs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   /* ---------- WEATHER ---------- */
//   const [weather, setWeather] = useState(null);

//   /* ---------- LAZY LOADER REF ---------- */
//   const loaderRef = useRef(null);

//   /* ---------- FETCH POSTS ---------- */
//   const fetchPosts = async (pageNo = 1) => {
//     if (loading || !hasMore) return;

//     try {
//       setLoading(true);

//       const { data } = await API.get(
//         `/post/get-posts?location=${location}&page=${pageNo}&limit=12`
//       );

//       if (!data?.posts || data.posts.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       setBlogs((prev) => [...prev, ...data.posts]);
//       setPage(pageNo + 1);
//     } catch (err) {
//       console.error(err);
//       toast.error("पोस्ट लोड नहीं हो पाईं");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- RESET ON CITY CHANGE ---------- */
//   useEffect(() => {
//     setBlogs([]);
//     setPage(1);
//     setHasMore(true);
//     fetchPosts(1);
//     fetchWeather(location);
//   }, [location]);

//   /* ---------- LAZY LOAD OBSERVER ---------- */
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (
//           entries[0].isIntersecting &&
//           hasMore &&
//           !loading
//         ) {
//           fetchPosts(page);
//         }
//       },
//       { threshold: 1 }
//     );

//     if (loaderRef.current) {
//       observer.observe(loaderRef.current);
//     }

//     return () => observer.disconnect();
//   }, [page, hasMore, loading]);

//   /* ---------- WEATHER ---------- */
//   const fetchWeather = async (city) => {
//     try {
//       const { data } = await API.get(`/weather?city=${city}`);
//       setWeather(data);
//     } catch {
//       setWeather(null);
//     }
//   };

//   const getWeatherIcon = () => {
//     if (!weather?.condition) return <FiSun />;
//     const text = weather.condition.toLowerCase();
//     if (text.includes("rain")) return <FiCloudRain />;
//     if (text.includes("cloud")) return <FiCloud />;
//     return <FiSun />;
//   };

//   const currentCity = CITIES.find((c) => c.value === location);

//   /* ---------- CAROUSEL LOGIC ---------- */
//   const carouselSlides = [];
//   for (let i = 0; i < blogs.length; i += 3) {
//     carouselSlides.push(blogs.slice(i, i + 3));
//   }

//   /* ---------- CATEGORY FILTER ---------- */
//   const getPostsByCategory = (slug) =>
//     blogs.filter((p) => p.category?.slug === slug).slice(0, 4);

//   /* ---------------- JSX ---------------- */


//   // ------------------ Small Cards ------------------
// // const InfoCards = () => {
// // return (
// // <div className="info-cards">
// // <div className="info-card breaking">
// // <h3>Breaking News</h3>
// // <p>Latest and verified updates from your city</p>
// // </div>
// // <div className="info-card festival">
// // <h3>Big Festival</h3>
// // <p>Festivals, fairs and major cultural events</p>
// // </div>
// // <div className="info-card emergency">
// // <h3>Emergency Alert</h3>
// // <p>Weather, health & urgent public notices</p>
// // </div>
// // </div>
// // );
// // };


// // // ------------------ Post Card ------------------
// // const PostCard = ({ post }) => {
// // return (
// // <div className="post-card">
// // <img src={post.thumbnail} alt={post.title} />
// // <div className="post-content">
// // <h2>{post.title}</h2>
// // <p>{post.excerpt}</p>
// // <span className="meta">
// // {post.city} • {new Date(post.createdAt).toLocaleDateString()}
// // </span>
// // </div>
// // </div>
// // );
// // };

//   return (
//     <Layout title="Trendkari | Today's City News">
      
//       {/* ---------------- CITY BANNER ---------------- */}
//     <div
//   className="city-banner"
// >
//   <h4 className="mb-1">
//     आज {currentCity?.label} में क्या हो रहा है
//   </h4>

//   {weather && (
//     <small>
//       {getWeatherIcon()} {weather.temp}°C | {weather.condition}
//     </small>
//   )}
// </div>

//       {/* Info Cards */}
// {/* <InfoCards /> */}


//       {/* ---------------- TOP STORIES ---------------- */}
//       {/* <section className="mb-5">
//         <h5 className="fw-bold mb-3">
//           {currentCity?.label} की बड़ी खबरें
//         </h5>

//         {blogs.length === 0 && loading ? (
//           <Skeleton active paragraph={{ rows: 4 }} />
//         ) : (
//           <Carousel>
//             {carouselSlides.map((slide, i) => (
//               <Carousel.Item key={i}>
//                 <div className="row g-4">
//                   {slide.map((post) => (
//                     <div className="col-md-4" key={post._id}>
//                       <BlogCard post={post} />
//                     </div>
//                   ))}
//                 </div>
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         )}
//       </section> */}

//       {/* Desktop */}
// <div className="d-none d-md-block">
//   <Carousel>...</Carousel>
// </div>

// {/* Mobile */}
// <div className="d-md-none overflow-auto d-flex gap-3 pb-2">
//   {blogs.slice(0, 6).map(post => (
//     <div key={post._id} style={{ minWidth: 260 }}>
//       <BlogCard post={post} />
//     </div>
//   ))}
// </div>


//       {/* ---------------- GOVERNMENT ---------------- */}
//       <section className="mb-5">
//         <div className="d-flex align-items-center mb-3">
//           <BsBuilding className="me-2" />
//           <h5 className="fw-bold m-0">सरकारी अपडेट</h5>
//         </div>

//         <div className="row g-4">
//           {getPostsByCategory("government").map((post) => (
//             <div className="col-md-3" key={post._id}>
//               <div className="card h-100 shadow-sm">
//                 <div className="card-body">
//                   <FaLandmark className="text-primary mb-2" />
//                   <h6 className="fw-bold">{post.title}</h6>
//                   <Link
//                     to={`/article/${post.slug}`}
//                     className="small text-primary"
//                   >
//                     पूरा पढ़ें →
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- ALL POSTS ---------------- */}
//       <section className="mb-5">
//         <h5 className="fw-bold mb-3">
//           {currentCity?.label} की सभी खबरें
//         </h5>

//         <div className="row g-4">
//           {blogs.map((post) => (
//             <div className="col-md-3" key={post._id}>
//               <BlogCard post={post} />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ---------------- LAZY LOADER ---------------- */}
//       {hasMore && (
//         <div ref={loaderRef} className="text-center py-4">
//           {loading && <Skeleton active paragraph={{ rows: 3 }} />}
//         </div>
//       )}

//       {!hasMore && (
//         <p className="text-center text-muted">
//           आपने सभी खबरें देख लीं
//         </p>
//       )}
//     </Layout>
//   );
// };

// export default Home;




import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layout/Layout";
import { Skeleton } from "antd";
import toast from "react-hot-toast";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import BlogCard from "../Components/BlogCard";
import { useLocation } from "../context/LocationContext.jsx";
import { FiSun, FiCloud, FiCloudRain } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { FaLandmark } from "react-icons/fa";

const CITIES = [
  { label: "कोटा", value: "kota", color: "#1E3A8A" },
  { label: "रामगंजमंडी", value: "ramganjmandi", color: "#059669" },
  { label: "सांगोद", value: "sangod", color: "#7C3AED" },
  { label: "लाडपुरा", value: "ladpura", color: "#0EA5E9" },
  { label: "ग्रामीण कोटा", value: "rural-kota", color: "#EA580C" },
];

const Home = () => {
  const { location } = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [weather, setWeather] = useState(null);
  const loaderRef = useRef(null);

  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const currentCity = CITIES.find((c) => c.value === location);

  const fetchPosts = async (pageNo = 1) => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/post/get-posts?location=${location}&page=${pageNo}&limit=12`);
      if (!data?.posts || data.posts.length === 0) {
        setHasMore(false);
        return;
      }
      setBlogs((prev) => [...prev, ...data.posts]);
      setPage(pageNo + 1);
    } catch (err) {
      console.error(err);
      toast.error("पोस्ट लोड नहीं हो पाईं");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const { data } = await API.get(`/weather?city=${city}`);
      setWeather(data);
    } catch {
      setWeather(null);
    }
  };

  // const fetchSuggestedUsers = async () => {
  //   try {
  //     const { data } = await API.get("/user/users-to-follow");
  //     if (data.success) setSuggestedUsers(data.users);
  //   } catch {
  //     setSuggestedUsers([]);
  //   }
  // };

// const fetchSuggestedUsers = async () => {
//   try {
//     setLoading(true);

//     const { data } = await API.get("/user/suggested", {
//       params: {
//         limit: 5,
//         excludeCurrentUser: true,
//       },
//     });

//     setSuggestedUsers(data || []);
//     setError(null);
//   } catch (err) {
//     console.error("Error fetching suggested users:", err);
//     setError("Failed to load suggested users");
//     setSuggestedUsers([]);
//   } finally {
//     setLoading(false);
//   }
// };


  // Fetch suggested users with proper error handling
  
  const fetchSuggestedUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await API.get("/user/suggested",{
         params: {
        t: Date.now(), // 🔥 forces fresh response
      },

    });
      
      // Handle different response structures
      if (response.data?.users) {
        setSuggestedUsers(response.data.users);
      } else if (Array.isArray(response.data)) {
        setSuggestedUsers(response.data);
      } else {
        setSuggestedUsers([]);
      }
    } catch (err) {
      console.error("Error fetching suggested users:", err);
      setSuggestedUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };


  const handleFollow = async (userId) => {
  try {
  
    //login in
    if (!localStorage.getItem("token")) {
      toast.error("कृपया पहले लॉगिन करें");
      return;
    }

    await API.post(`/user/${userId}/follow`);

    // Remove followed user from suggestions
    setSuggestedUsers((prev) =>
      prev.filter((user) => user._id !== userId)
    );
  } catch (error) {
    console.error("Follow error:", error);
    toast.error("Follow करने में समस्या आई");
  }
};


  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
    fetchWeather(location);
    fetchSuggestedUsers();
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) fetchPosts(page);
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  const getWeatherIcon = () => {
    if (!weather?.condition) return <FiSun />;
    const text = weather.condition.toLowerCase();
    if (text.includes("rain")) return <FiCloudRain />;
    if (text.includes("cloud")) return <FiCloud />;
    return <FiSun />;
  };

  const getPostsByCategory = (slug) => blogs.filter((p) => p.category?.slug === slug).slice(0, 4);

  const carouselSlides = [];
  for (let i = 0; i < blogs.length; i += 3) {
    carouselSlides.push(blogs.slice(i, i + 3));
  }

  return (
    <Layout title="Trendkari | Today's City News">
      {/* CITY BANNER */}
      <div className="city-banner mb-4 p-3 bg-light rounded">
        <h4 className="mb-1">आज {currentCity?.label} में क्या हो रहा है</h4>
        {weather && <small>{getWeatherIcon()} {weather.temp}°C | {weather.condition}</small>}
      </div>

      {/* TOP STORIES */}
      <section className="mb-5">
        <h5 className="fw-bold mb-3">{currentCity?.label} की बड़ी खबरें</h5>
        {blogs.length === 0 && loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Carousel>
            {carouselSlides.map((slide, i) => (
              <Carousel.Item key={i}>
                <div className="row g-4">
                  {slide.map((post) => (
                    <div className="col-md-4" key={post._id}>
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </section>

      {/* FOLLOW SOURCES */}
      {/* <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold m-0">स्थानीय पत्रकार और स्रोत</h5>
          <Link to="/follow" className="small text-primary">सभी देखें →</Link>
        </div>
        <div className="d-flex gap-3 overflow-auto pb-2">
          {suggestedUsers.map(user => (
            <div key={user._id} className="card shadow-sm border-0" style={{ minWidth: 220 }}>
              <div className="card-body text-center">
                <img src={user.profilePic || "/avatar.png"} className="rounded-circle mb-2" width={60} height={60} />
                <h6 className="fw-bold mb-1">{user.name}</h6>
                <small className="text-muted">{user.bio}</small>
              </div>
            </div>
          ))}
        </div>
      </section> */}

       {/* <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">स्थानीय पत्रकार और स्रोत</h5>
        <Link to="/follow" className="small text-primary text-decoration-none">
          सभी देखें →
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-warning small">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="d-flex gap-3 overflow-auto pb-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="card shadow-sm border-0" style={{ minWidth: 220 }}>
              <div className="card-body text-center">
                <div className="rounded-circle mb-2 mx-auto bg-light" style={{ width: 60, height: 60 }} />
                <div className="placeholder-glow">
                  <h6 className="placeholder col-8 mx-auto mb-1"></h6>
                  <small className="placeholder col-10 mx-auto"></small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="d-flex gap-3 overflow-auto pb-3">
          {suggestedUsers.map(user => (
            <div key={user._id} className="card shadow-sm border-0" style={{ minWidth: 220 }}>
              <div className="card-body text-center p-3">
                <img 
                  src={user.profilePic || "/avatar.png"} 
                  className="rounded-circle mb-2 border" 
                  width={60} 
                  height={60}
                  alt={user.name}
                  onError={(e) => {
                    e.target.src = "/avatar.png";
                  }}
                />
                <h6 className="fw-bold mb-1 text-truncate">{user.name}</h6>
                <small className="text-muted d-block mb-2 text-truncate">{user.bio}</small>
                <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                  <span>👥 {user.followers || 0} फॉलोअर्स</span>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary w-100"
                  onClick={() => handleFollow(user._id)}
                >
                  फॉलो करें
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {suggestedUsers.length === 0 && !loading && (
        <div className="text-center py-4 border rounded">
          <p className="text-muted mb-0">कोई सुझाव उपलब्ध नहीं है</p>
        </div>
      )}
    </section> */}

<section className="mb-5">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="fw-bold m-0">स्थानीय पत्रकार और स्रोत</h5>
    <Link to="/users" className="small text-primary text-decoration-none">
      सभी देखें →
    </Link>
  </div>

  {error && <div className="alert alert-warning small">{error}</div>}

  <div className="d-flex gap-3 overflow-auto pb-2">

    {/* LOADING */}
    {loading &&
      [1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="card shadow-sm border-0"
          style={{ minWidth: 200, height: 200 }}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            <div className="rounded-circle bg-light mb-3" style={{ width: 60, height: 60 }} />
            <div className="placeholder-glow w-100 text-center">
              <span className="placeholder col-6"></span>
            </div>
          </div>
        </div>
      ))
    }

    {/* USER CARDS */}
    {!loading &&
      suggestedUsers.map(user => (
        <Link
          key={user._id}
          to={`/dashboard/user/profile/${user._id}`}
          className="card shadow-sm border-0 text-decoration-none text-dark"
          style={{ minWidth: 200, height: 200 }}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-between p-3">

            {/* AVATAR */}
            <div
              className="rounded-circle border overflow-hidden d-flex align-items-center justify-content-center"
              style={{ width: 60, height: 60 }}
            >
              <img
                src={user.avatar?.startsWith("http") ? user.avatar : "/avatar.png"}
                alt={user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => (e.target.src = "/avatar.png")}
              />
            </div>

            {/* NAME */}
            <h6
              className="fw-bold text-center text-truncate w-100 m-0"
              title={user.name}
            >
              {user.name}
            </h6>

            {/* FOLLOW BUTTON (STOP NAVIGATION) */}
            <button
              className="btn btn-sm btn-outline-primary w-100"
              onClick={(e) => {
                e.preventDefault(); // ⛔ stop Link
                e.stopPropagation(); // ⛔ stop bubbling
                handleFollow(user._id);
              }}
            >
              फॉलो करें
            </button>

          </div>
        </Link>
      ))
    }

    {/* SEE ALL */}
    {!loading && (
      <Link
        to="/users"
        className="card shadow-sm border-0 text-decoration-none"
        style={{ minWidth: 200, height: 200 }}
      >
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-primary fw-bold">
          <span style={{ fontSize: 26 }}>→</span>
          सभी प्रोफाइल देखें
        </div>
      </Link>
    )}

  </div>

  {!loading && suggestedUsers.length === 0 && (
    <div className="text-center py-4 border rounded">
      <p className="text-muted mb-0">कोई सुझाव उपलब्ध नहीं है</p>
    </div>
  )}
</section>




      {/* GOVERNMENT UPDATES */}
      <section className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <BsBuilding className="me-2" />
          <h5 className="fw-bold m-0">सरकारी अपडेट</h5>
        </div>
        <div className="row g-4">
          {getPostsByCategory("government").map((post) => (
            <div className="col-md-3" key={post._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <FaLandmark className="text-primary mb-2" />
                  <h6 className="fw-bold">{post.title}</h6>
                  <Link to={`/article/${post.slug}`} className="small text-primary">पूरा पढ़ें →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ALL POSTS */}
      <section className="mb-5">
        <h5 className="fw-bold mb-3">{currentCity?.label} की सभी खबरें</h5>
        <div className="row g-4">
          {blogs.map((post) => (
            <div className="col-md-3" key={post._id}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* LAZY LOADER */}
      {hasMore && (
        <div ref={loaderRef} className="text-center py-4">
          {loading && <Skeleton active paragraph={{ rows: 3 }} />}
        </div>
      )}

      {!hasMore && <p className="text-center text-muted">आपने सभी खबरें देख लीं</p>}
    </Layout>
  );
};

export default Home;




