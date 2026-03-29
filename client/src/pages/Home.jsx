// import React, { useEffect, useRef, useState } from "react";
// import Layout from "../Layout/Layout";
// import { Skeleton } from "antd";
// import toast from "react-hot-toast";
// import { Carousel } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import API from "../../utils/api";
// import BlogCard from "../Components/BlogCard.jsx";
// import { useLocation } from "../context/LocationContext.jsx";
// import { FiSun, FiCloud, FiCloudRain } from "react-icons/fi";
// import { BsBuilding } from "react-icons/bs";
// import { FaLandmark } from "react-icons/fa";
// import MiniCard from "../Components/MiniCard.jsx";
// import { useNavigate } from "react-router-dom";

// const CITIES = [
//   { label: "कोटा", value: "kota", color: "#1E3A8A" },
//   { label: "रामगंजमंडी", value: "ramganjmandi", color: "#059669" },
//   { label: "सांगोद", value: "sangod", color: "#7C3AED" },
//   { label: "लाडपुरा", value: "ladpura", color: "#0EA5E9" },
//   { label: "ग्रामीण कोटा", value: "rural-kota", color: "#EA580C" },
// ];

// const Home = () => {
//   const navigate = useNavigate();
//   const { location } = useLocation();
//   const [blogs, setBlogs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [loadingUsers, setLoadingUsers] = useState(false);
  
//   const [weather, setWeather] = useState(null);
//   const loaderRef = useRef(null);

//   const [suggestedUsers, setSuggestedUsers] = useState([]);

//   const currentCity = CITIES.find((c) => c.value === location);

//   const fetchPosts = async (pageNo = 1) => {
//     if (loading || !hasMore) return;
//     try {
//       setLoading(true);
//       const { data } = await API.get(`/post/get-posts?location=${location}&page=${pageNo}&limit=12`);
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

//   const fetchWeather = async (city) => {
//     try {
//       const { data } = await API.get(`/weather?city=${city}`);
//       setWeather(data);
//     } catch {
//       setWeather(null);
//     }
//   };



//   // Fetch suggested users with proper error handling
  
//   const fetchSuggestedUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       const response = await API.get("/user/suggested",{
//          params: {
//         t: Date.now(), // 🔥 forces fresh response
//       },

//     });
      
//       // Handle different response structures
//       if (response.data?.users) {
//         setSuggestedUsers(response.data.users);
//       } else if (Array.isArray(response.data)) {
//         setSuggestedUsers(response.data);
//       } else {
//         setSuggestedUsers([]);
//       }
//     } catch (err) {
//       console.error("Error fetching suggested users:", err);
//       setSuggestedUsers([]);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };


//   const handleFollow = async (userId) => {
//   try {
  
//     //login in
//     if (!localStorage.getItem("token")) {
//       toast.error("कृपया पहले लॉगिन करें");
//       return;
//     }

//     await API.post(`/user/${userId}/follow`);

//     // Remove followed user from suggestions
//     setSuggestedUsers((prev) =>
//       prev.filter((user) => user._id !== userId)
//     );
//   } catch (error) {
//     console.error("Follow error:", error);
//     toast.error("Follow करने में समस्या आई");
//   }
// };


//   useEffect(() => {
//     setBlogs([]);
//     setPage(1);
//     setHasMore(true);
//     fetchPosts(1);
//     fetchWeather(location);
//     fetchSuggestedUsers();
//   }, [location]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) fetchPosts(page);
//       },
//       { threshold: 1 }
//     );
//     if (loaderRef.current) observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [page, hasMore, loading]);

//   const getWeatherIcon = () => {
//     if (!weather?.condition) return <FiSun />;
//     const text = weather.condition.toLowerCase();
//     if (text.includes("rain")) return <FiCloudRain />;
//     if (text.includes("cloud")) return <FiCloud />;
//     return <FiSun />;
//   };

//   const getPostsByCategory = (slug) => blogs.filter((p) => p.category?.slug === slug).slice(0, 4);

//   const carouselSlides = [];
//   for (let i = 0; i < blogs.length; i += 3) {
//     carouselSlides.push(blogs.slice(i, i + 3));
//   }

//   return (
//     <Layout title="Trendkari | Today's City News">
//       {/* CITY BANNER */}
//       <div className="city-banner mb-4 bg-light rounded">
//         <h4 className="mb-1">आज {currentCity?.label} में क्या हो रहा है</h4>
//       </div>



// {/* Market, Horoscope and Emergency */}
// <div className="quick-actions mb-4">
//   <div className="row g-3">

//     {/* MARKET */}
//     <div className="col-4">
//       <div
//         className="card text-center shadow-sm h-100 cursor-pointer"
//         onClick={() => navigate("/market")}
//         style={{ cursor: "pointer" }}
//       >
//         <div className="card-body p-2">
//           <div style={{ fontSize: "22px" }}>🛒</div>
//           <small className="fw-semibold">Market</small>
//         </div>
//       </div>
//     </div>

//     {/* HOROSCOPE */}
    // <div className="col-4">
    //   <div
    //     className="card text-center shadow-sm h-100"
    //     onClick={() => navigate("/horoscope")}
    //     style={{ cursor: "pointer" }}
    //   >
    //     <div className="card-body p-2">
    //       <div style={{ fontSize: "22px" }}>🔮</div>
    //       <small className="fw-semibold">Horoscope</small>
    //     </div>
    //   </div>
    // </div>

//     {/* EMERGENCY */}
//     <div className="col-4">
//       <div
//         className="card text-center shadow-sm h-100"
//         onClick={() => navigate("/emergency")}
//         style={{ cursor: "pointer" }}
//       >
//         <div className="card-body p-2">
//           <div style={{ fontSize: "22px" }}>🚨</div>
//           <small className="fw-semibold">Emergency</small>
//         </div>
//       </div>
//     </div>

//   </div>
// </div>
      

//       {/* FOLLOW SOURCES */}

// <section className="mb-5">
//   <div className="d-flex justify-content-between align-items-center mb-3">
//     <h5 className="fw-bold m-0">स्थानीय पत्रकार और स्रोत</h5>
//     <Link to="/users" className="small text-primary text-decoration-none">
//       सभी देखें →
//     </Link>
//   </div>

//   {error && <div className="alert alert-warning small">{error}</div>}

//   <div className="d-flex gap-3 overflow-auto pb-2">

//     {/* LOADING */}
//     {loading &&
//       [1, 2, 3, 4, 5, 7, 8,].map(i => (
//         <div
//           key={i}
//           className="card shadow-sm border-0"
//           style={{ minWidth: 200, height: 200 }}
//         >
//           <div className="card-body d-flex flex-column align-items-center justify-content-center">
//             <div className="rounded-circle bg-light mb-3" style={{ width: 60, height: 60 }} />
//             <div className="placeholder-glow w-100 text-center">
//               <span className="placeholder col-6"></span>
//             </div>
//           </div>
//         </div>
//       ))
//     }

//     {/* USER CARDS */}
//     {!loading &&
//       suggestedUsers.map(user => (
//         <Link
//           key={user._id}
//           to={`/dashboard/user/profile/${user._id}`}
//           className="card shadow-sm border-0 text-decoration-none text-dark"
//           style={{ minWidth: 200, height: 200 }}
//         >
//           <div className="card-body d-flex flex-column align-items-center justify-content-between p-3">

//             {/* AVATAR */}
//             <div
//               className="rounded-circle border overflow-hidden d-flex align-items-center justify-content-center"
//               style={{ width: 60, height: 60 }}
//             >
//               <img
//                 src={user.avatar?.startsWith("http") ? user.avatar : "/avatar.png"}
//                 alt={user.name}
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 onError={(e) => (e.target.src = "/avatar.png")}
//               />
//             </div>

//             {/* NAME */}
//             <h6
//               className="fw-bold text-center text-truncate w-100 m-0"
//               title={user.name}
//             >
//               {user.name}
//             </h6>

//             {/* FOLLOW BUTTON (STOP NAVIGATION) */}
//             <button
//               className="btn btn-sm btn-outline-primary w-100"
//               onClick={(e) => {
//                 e.preventDefault(); // ⛔ stop Link
//                 e.stopPropagation(); // ⛔ stop bubbling
//                 handleFollow(user._id);
//               }}
//             >
//               फॉलो करें
//             </button>

//           </div>
//         </Link>
//       ))
//     }

//     {/* SEE ALL */}
//     {!loading && (
//       <Link
//         to="/users"
//         className="card shadow-sm border-0 text-decoration-none"
//         style={{ minWidth: 200, height: 200 }}
//       >
//         <div className="card-body d-flex flex-column justify-content-center align-items-center text-primary fw-bold">
//           <span style={{ fontSize: 26 }}>→</span>
//           सभी प्रोफाइल देखें
//         </div>
//       </Link>
//     )}

//   </div>

//   {!loading && suggestedUsers.length === 0 && (
//     <div className="text-center py-4 border rounded">
//       <p className="text-muted mb-0">कोई सुझाव उपलब्ध नहीं है</p>
//     </div>
//   )}
// </section>




//       {/* GOVERNMENT UPDATES */}
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
//                   <Link to={`/article/${post.slug}`} className="small text-primary">पूरा पढ़ें →</Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ALL POSTS */}
      
//       <section className="mb-5">
//         <h5 className="fw-bold mb-3">{currentCity?.label} की सभी खबरें</h5>
//         <div className="row g-4">
//           {blogs.map((post) => (
//             <div className="col-md-6" key={post._id}>
//               {/* <BlogCard post={post} /> */}
//               <MiniCard post={post} />


//             </div>
//           ))}
//         </div>
//       </section>

//       {/* LAZY LOADER */}
//       {hasMore && (
//         <div ref={loaderRef} className="text-center py-4">
//           {loading && <Skeleton active paragraph={{ rows: 3 }} />}
//         </div>
//       )}

//       {!hasMore && <p className="text-center text-muted">आपने सभी खबरें देख लीं</p>}
//     </Layout>
//   );
// };

// export default Home;







import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layout/Layout";
import { Skeleton, Spin } from "antd";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import MiniCard from "../Components/MiniCard.jsx";
import { useLocation } from "../context/LocationContext.jsx";
import { BsBuilding } from "react-icons/bs";
import { FaLandmark } from "react-icons/fa";
import SwipeFeed from "../Components/SwipeFeed.jsx";

const CITIES = [
  { label: "कोटा", value: "kota" },
  { label: "रामगंजमंडी", value: "ramganjmandi" },
  { label: "सांगोद", value: "sangod" },
  { label: "लाडपुरा", value: "ladpura" },
  { label: "ग्रामीण कोटा", value: "rural-kota" },
];

const Home = () => {
  const navigate = useNavigate();
  const { location } = useLocation();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loaderRef = useRef(null);

  const currentCity = CITIES.find((c) => c.value === location);

  /* ================= POSTS ================= */
  const fetchPosts = async (pageNo = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const { data } = await API.get(
        `/post/get-posts?location=${location}&page=${pageNo}&limit=12`
      );

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
      setInitialLoading(false);
    }
  };

  /* ================= USERS ================= */
  const fetchSuggestedUsers = async () => {
    try {
      setLoadingUsers(true);

      const res = await API.get("/user/suggested", {
        params: { t: Date.now() },
      });

      if (res.data?.users) {
        setSuggestedUsers(res.data.users);
      } else {
        setSuggestedUsers([]);
      }
    } catch (err) {
      console.error(err);
      setSuggestedUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      if (!localStorage.getItem("token")) {
        toast.error("कृपया पहले लॉगिन करें");
        return;
      }

      await API.post(`/user/${userId}/follow`);

      setSuggestedUsers((prev) =>
        prev.filter((u) => u._id !== userId)
      );
    } catch (err) {
      toast.error("Follow करने में समस्या आई");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);

    fetchPosts(1);
    fetchSuggestedUsers();
  }, [location]);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchPosts(page);
        }
      },
      { threshold: 0.5 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [page, hasMore, loading]);

  /* ================= UI ================= */
  return (
    <Layout title="Trendkari | Today's City News">

      {/* HEADER TEXT */}
      {/* <div className="mb-4 p-3 rounded"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          border: "1px solid var(--border)"
        }}
      >
        <h5 className="m-0 fw-bold">
          {currentCity?.label} में आज क्या हो रहा है
        </h5>
      </div> */}

      {/* QUICK ACTIONS */}
      {/* <div className="row g-3 mb-4">
        {[
          { icon: "🛒", label: "Market", path: "/market" },
          { icon: "🔮", label: "Horoscope", path: "/horoscope" },
          { icon: "🚨", label: "Emergency", path: "/emergency" },
        ].map((item, i) => (
          <div className="col-4" key={i}>
            <div
              onClick={() => navigate(item.path)}
              className="text-center p-3 rounded shadow-sm"
              style={{
                cursor: "pointer",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--text)"
              }}
            >
              <div style={{ fontSize: 22 }}>{item.icon}</div>
              <small>{item.label}</small>
            </div>
          </div>
        ))}
      </div> */}



{/* <marquee onClick={() => navigate("/advertise")} style={{ cursor: "pointer" }}>
  <p className="m-0">
    📢 <b>
      Own a shop in {currentCity?.label}?🚀 Get featured on Trendkari →
    </b>
  </p>
</marquee> */}

      {/* SUGGESTED USERS */}
      {/* <section className="mb-5">
        <h6 className="fw-bold mb-3">स्थानीय पत्रकार</h6>

        <div className="d-flex gap-3 overflow-auto">

          {loadingUsers &&
            [1,2,3,4,5].map(i => (
              <Skeleton.Avatar key={i} active size={60} />
            ))
          }

          {!loadingUsers && suggestedUsers.map(user => (
            <div
              key={user._id}
              className="p-2 text-center"
              style={{ minWidth: 120 }}
            >
              <img
                src={user.avatar || "/avatar.png"}
                alt=""
                className="rounded-circle mb-2"
                width={50}
                height={50}
              />
              <div className="small">{user.name}</div>

              <button
                className="btn btn-sm btn-outline-primary mt-1"
                onClick={() => handleFollow(user._id)}
              >
                Follow
              </button>
            </div>


          ))}
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
      </section> */}

      {/* GOVERNMENT */}
  

      {/* POSTS */}
      <section>
        <h6 className="fw-bold mb-3">
          {currentCity?.label} की खबरें
        </h6>


        <div className="row g-3">
          {blogs.map(post => (
            <div className="col-12 col-md-6" key={post._id}>
              <SwipeFeed post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* LOADER */}
      <div ref={loaderRef} className="text-center py-4">

        {loading && (
          <Spin size="large" />
        )}

        {initialLoading && (
          <Skeleton active paragraph={{ rows: 4 }} />
        )}

        {!hasMore && (
          <p className="text-muted mt-3">
            आपने सभी खबरें देख लीं
          </p>
        )}
      </div>

    </Layout>
  );
};

export default Home;