// import React, { useEffect, useState, useRef } from "react";
// import "../../css/Swipe.css";
// import API from "../../utils/api";

// const SwipeFeed = () => {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);

//   // 🔥 FETCH POSTS
//   const fetchPosts = async (pageNo = 1) => {
//     if (loading || !hasMore) return;

//     try {
//       setLoading(true);

//       const { data } = await API.get(
//         `/post/get-posts?status=approved&page=${pageNo}&limit=8`
//       );

//       if (!data?.posts || data.posts.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       setPosts((prev) => [...prev, ...data.posts]);
//       setPage(pageNo + 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts(1);
//   }, []);

//   // 🔥 SCROLL TO INDEX (CORE ENGINE)
//   const goToIndex = (index) => {
//     if (index < 0 || index >= posts.length) return;
//     if (isScrolling.current) return;

//     isScrolling.current = true;

//     const container = containerRef.current;
//     const height = window.innerHeight;

//     container.scrollTo({
//       top: index * height,
//       behavior: "smooth",
//     });

//     setCurrentIndex(index);

//     setTimeout(() => {
//       isScrolling.current = false;
//     }, 400);
//   };

//   // 🔥 TOUCH SWIPE
//   useEffect(() => {
//     const container = containerRef.current;

//     let startY = 0;
//     let endY = 0;

//     const handleTouchStart = (e) => {
//       startY = e.touches[0].clientY;
//     };

//     const handleTouchEnd = (e) => {
//       endY = e.changedTouches[0].clientY;

//       const diff = startY - endY;

//         if (currentIndex === 0 && diff < -80) {
//     refreshFeed();
//     return;
//   }

//       if (Math.abs(diff) < 50) return;

//       if (diff > 0) goToIndex(currentIndex + 1);
//       else goToIndex(currentIndex - 1);
//     };

//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);

//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, posts]);

//   // 🔥 DESKTOP SCROLL (WHEEL)
//   useEffect(() => {
//     const container = containerRef.current;

//     const handleWheel = (e) => {
//       if (isScrolling.current) return;

//       if (e.deltaY > 0) goToIndex(currentIndex + 1);
//       else goToIndex(currentIndex - 1);
//     };

//     container.addEventListener("wheel", handleWheel);

//     return () => container.removeEventListener("wheel", handleWheel);
//   }, [currentIndex, posts]);

//   // 🔥 LOAD MORE (INTERSECTION)
//   const lastPostRef = (node) => {
//     if (loading) return;

//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasMore) {
//         fetchPosts(page);
//       }
//     });

//     if (node) observer.current.observe(node);
//   };

//   const formatTimeAgo = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();

//   const diff = Math.floor((now - date) / 1000);

//   if (diff < 60) return "अभी";
//   if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)} घंटे पहले`;

//   return `${Math.floor(diff / 86400)} दिन पहले`;
// };

// const handleShare = async (e, post) => {
//   e.stopPropagation();

//   const url = `https://www.trendkari.in/article/${post.slug}`;

//   if (navigator.share) {
//     try {
//       await navigator.share({
//         title: post.title,
//         text: post.title,
//         url,
//       });
//     } catch (err) {
//       console.log("Share cancelled");
//     }
//   } else {
//     await navigator.clipboard.writeText(url);
//     alert("लिंक कॉपी हो गया!");
//   }
// };


//   return (
// //     <div className="feed-container" ref={containerRef}>
// //       {posts.map((post, index) => {
// //         const isLast = index === posts.length - 1;

// //         return (
// // <div
// //   key={post._id || index}
// //   ref={isLast ? lastPostRef : null}
// //   className="feed-card"
// // >
// //   {/* 🖼 IMAGE */}
// //   <div className="feed-image-wrapper">
// //     <img
// //       src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
// //       alt={post.title}
// //       className="feed-image"
// //       loading="lazy"
// //     />
// //       <button
// //     className="share-btn"
// //     onClick={(e) => handleShare(e, post)}
// //   >
// //     🔗
// //   </button>
// //   </div>

// //   {/* 📝 CONTENT */}
// //   <div className="feed-content">
// //     {/* ⏱ TIME */}
// //     <span className="feed-meta">
// //       {formatTimeAgo(post.createdAt)}
// //     </span>

// //     {/* 📰 TITLE */}
// //     <h3 className="feed-title">{post.title}</h3>

// //     {/* 📄 DESCRIPTION */}
// //     <p className="feed-desc">
// //       {post.content || "No description available"}
// //     </p>
// //   </div>
// // </div>
// //         );
// //       })}

// //       {loading && <div className="loader">Loading...</div>}
// //     </div>

// <div className="feed-container" ref={containerRef}>
//   {posts.map((post, index) => {
//     const isLast = index === posts.length - 1;

//     return (
//       <div
//         key={post._id || index}
//         ref={isLast ? lastPostRef : null}
//         className="feed-card"
//       >
//         {/* 🖼 IMAGE */}
//         <div className="feed-image-wrapper">
//           <img
//             src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//             alt={post.title}
//             className="feed-image"
//             loading="lazy"
//           />

//           {/* 🔥 GRADIENT OVERLAY (PREMIUM LOOK) */}
//           <div className="image-overlay"></div>

//           {/* 🔥 SHARE BUTTON */}
//           <button
//             className="share-btn"
//             onClick={(e) => handleShare(e, post)}
//           >
//             🔗
//           </button>
//         </div>

//         {/* 📝 CONTENT */}
//         <div className="feed-content">
//           <span className="feed-meta">
//             {formatTimeAgo(post.createdAt)}
//           </span>

//           <h3 className="feed-title">{post.title}</h3>

//           <p className="feed-desc">
//             {post.content || post.description || "No description available"}
//           </p>
//         </div>
//       </div>
//     );
//   })}

//   {loading && <div className="loader">Loading...</div>}
// </div>
//   );
// };

// export default SwipeFeed;




















import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../css/Swipe.css";
import Layout from "../Layout/Layout";
import { useLocation } from "../context/LocationContext";

import { Helmet } from "react-helmet";
import { useAuth } from "../context/auth";


const LIMIT = 8;



const SwipeFeed = () => {
  const { location } = useLocation(); // 👈 from context
const { slug } = useParams();  
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role === "admin";

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialPost, setInitialPost] = useState(null);

  const observer = useRef();

  const params = useParams();
const { changeLocation } = useLocation();

useEffect(() => {
  if (params.location && params.location !== location) {
    changeLocation(params.location);
  }
}, [params.location]);

  // 🔥 FETCH POSTS
  const fetchPosts = useCallback(async (pageNo = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const { data } = await API.get(
        // `/post/get-posts?status=approved&location=${location}&page=${pageNo}&limit=${LIMIT}`
        `/post/get-posts?status=approved&location=${location}&page=${pageNo}&limit=${LIMIT}`
      );

      if (!data?.posts?.length) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const filtered = data.posts.filter((p) => !ids.has(p._id));
        return [...prev, ...filtered];
      });

      setPage(pageNo + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location, loading, hasMore]);


  const fetchInitialPost = async () => {
  if (!slug) return;

  try {
    const { data } = await API.get(
      `/post/get-post/${slug}` // cache bust
    );

    if (data?.post) {
      setInitialPost(data.post);
    }
  } catch (err) {
    console.error("Initial post error:", err);
  }
};

  // 🔥 INITIAL LOAD
useEffect(() => {
  // FULL RESET
  setPosts([]);
  setPage(1);
  setHasMore(true);
  setInitialPost(null);

  if (slug) {
    fetchInitialPost(); 
  } else {
    fetchPosts(1);
  }

}, [slug, location]);


useEffect(() => {
  if (!initialPost) return;

  setPosts((prev) => {
    const exists = prev.find(p => p._id === initialPost._id);
    if (exists) return prev;
    return [initialPost, ...prev];
  });

  fetchPosts(1);

}, [initialPost]);

  // 🔥 INTERSECTION OBSERVER (ONLY ONE LOADER)
  const lastPostRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts(page);
      }
    });

    if (node) observer.current.observe(node);
  };

  // 🔥 SHARE
const handleShare = async (e, post) => {
  e.stopPropagation();

  const url = `https://www.trendkari.in/feed/${post.slug}`;

  const shareText = `
📰 ${post.title}

👉 पूरी खबर पढ़ें:


`;

  const shareData = {
    title: post.title,
    text: shareText,
    url: url,
  };


  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("लिंक कॉपी हो गया!");
    }
  } catch (err) {
    console.log("Share cancelled", err);
  }
};

  useEffect(() => {
  if (slug) {

    console.log("Opened from shared link");
  }
}, [slug]);



  // 🔥 TIME FORMAT
  const formatTimeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "अभी";
    if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} घंटे पहले`;
    return `${Math.floor(diff / 86400)} दिन पहले`;
  };

    const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (post?.author?._id) {
      navigate(`/dashboard/user/profile/${post.author._id}`);
    }
  };


  const getTextContent = (content) => {
  if (!content) return "";

  // If already string
  if (typeof content === "string") return content;

  // If EditorJS object
  if (content.blocks) {
    return content.blocks
      .map((block) => block.data?.text || "")
      .join(" ");
  }

  return "";
};

  return (
    <div className="feed-container">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;

        return (
          <div
            key={post._id || index}
            ref={isLast ? lastPostRef : null}
            className="feed-card"
          >
            {/* IMAGE */}
            <div className="feed-image-wrapper">
              <img
                src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
                alt={post.title}
                className="feed-image"
                loading={index < 2 ? "eager" : "lazy"}
              />

              <div className="image-overlay" />

              <button
                className="share-btn"
                onClick={(e) => handleShare(e, post)}
              >
                🔗
              </button>
            </div>

            {/* CONTENT */}
            <div className="feed-content px-3">
 <div className="feed-meta">
  <span>{formatTimeAgo(post.createdAt)}</span>

  {post.author && (
    <span
      className="feed-author ms-3"
      onClick={(e) => handleAuthorClick(e, post)}
    >
      {post.author.name}
    </span>

    
  )}
</div>
{isAdmin && (
  <button
    className="edit-btn"
    onClick={() => navigate(`/dashboard/admin/edit-post/${post.slug}`)}
  >
    ✏️
  </button>
)}
              <h3 className="feed-title">{post.title}</h3>

              <p className="feed-desc">
                {/* {post.content || post.description} */}
  {getTextContent(post.content) || post.description || ""}

              </p>
            </div>
          </div>
        );
      })}

      {/* {loading && <div className="loader">Loading...</div>} */}

{loading && posts.length === 0 && (
  <div className="feed-skeleton-container">
    {[1, 2].map((_, i) => (
      <div key={i} className="feed-card skeleton">
        <div className="feed-image-wrapper skeleton-bg" />

        <div className="feed-content">
          <div className="skeleton-line w-25 mb-2"></div>
          <div className="skeleton-line w-75 mb-2"></div>
          <div className="skeleton-line w-100 mb-2"></div>
          <div className="skeleton-line w-90"></div>
        </div>
      </div>
    ))}
  </div>
)}

{loading && posts.length > 0 && (
  <div className="text-center py-3 text-muted">
    Loading more...
  </div>
)}
    </div>
  );
};

export default SwipeFeed;