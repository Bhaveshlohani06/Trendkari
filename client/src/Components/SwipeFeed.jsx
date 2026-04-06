// // import React, { useEffect, useState, useRef } from "react";
// // import "../../css/Swipe.css";
// // import API from "../../utils/api";

// // const SwipeFeed = () => {
// //   const [posts, setPosts] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   const containerRef = useRef(null);
// //   const observer = useRef();
// //   const isScrolling = useRef(false);

// //   // 🔥 FETCH POSTS
// //   const fetchPosts = async (pageNo = 1) => {
// //     if (loading || !hasMore) return;

// //     try {
// //       setLoading(true);

// //       const { data } = await API.get(
// //         `/post/get-posts?status=approved&page=${pageNo}&limit=8`
// //       );

// //       if (!data?.posts || data.posts.length === 0) {
// //         setHasMore(false);
// //         return;
// //       }

// //       setPosts((prev) => [...prev, ...data.posts]);
// //       setPage(pageNo + 1);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPosts(1);
// //   }, []);

// //   // 🔥 SCROLL TO INDEX (CORE ENGINE)
// //   const goToIndex = (index) => {
// //     if (index < 0 || index >= posts.length) return;
// //     if (isScrolling.current) return;

// //     isScrolling.current = true;

// //     const container = containerRef.current;
// //     const height = window.innerHeight;

// //     container.scrollTo({
// //       top: index * height,
// //       behavior: "smooth",
// //     });

// //     setCurrentIndex(index);

// //     setTimeout(() => {
// //       isScrolling.current = false;
// //     }, 400);
// //   };

// //   // 🔥 TOUCH SWIPE
// //   useEffect(() => {
// //     const container = containerRef.current;

// //     let startY = 0;
// //     let endY = 0;

// //     const handleTouchStart = (e) => {
// //       startY = e.touches[0].clientY;
// //     };

// //     const handleTouchEnd = (e) => {
// //       endY = e.changedTouches[0].clientY;

// //       const diff = startY - endY;

// //         if (currentIndex === 0 && diff < -80) {
// //     refreshFeed();
// //     return;
// //   }

// //       if (Math.abs(diff) < 50) return;

// //       if (diff > 0) goToIndex(currentIndex + 1);
// //       else goToIndex(currentIndex - 1);
// //     };

// //     container.addEventListener("touchstart", handleTouchStart);
// //     container.addEventListener("touchend", handleTouchEnd);

// //     return () => {
// //       container.removeEventListener("touchstart", handleTouchStart);
// //       container.removeEventListener("touchend", handleTouchEnd);
// //     };
// //   }, [currentIndex, posts]);

// //   // 🔥 DESKTOP SCROLL (WHEEL)
// //   useEffect(() => {
// //     const container = containerRef.current;

// //     const handleWheel = (e) => {
// //       if (isScrolling.current) return;

// //       if (e.deltaY > 0) goToIndex(currentIndex + 1);
// //       else goToIndex(currentIndex - 1);
// //     };

// //     container.addEventListener("wheel", handleWheel);

// //     return () => container.removeEventListener("wheel", handleWheel);
// //   }, [currentIndex, posts]);

// //   // 🔥 LOAD MORE (INTERSECTION)
// //   const lastPostRef = (node) => {
// //     if (loading) return;

// //     if (observer.current) observer.current.disconnect();

// //     observer.current = new IntersectionObserver((entries) => {
// //       if (entries[0].isIntersecting && hasMore) {
// //         fetchPosts(page);
// //       }
// //     });

// //     if (node) observer.current.observe(node);
// //   };

// //   const formatTimeAgo = (dateString) => {
// //   const date = new Date(dateString);
// //   const now = new Date();

// //   const diff = Math.floor((now - date) / 1000);

// //   if (diff < 60) return "अभी";
// //   if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
// //   if (diff < 86400) return `${Math.floor(diff / 3600)} घंटे पहले`;

// //   return `${Math.floor(diff / 86400)} दिन पहले`;
// // };

// // const handleShare = async (e, post) => {
// //   e.stopPropagation();

// //   const url = `https://www.trendkari.in/article/${post.slug}`;

// //   if (navigator.share) {
// //     try {
// //       await navigator.share({
// //         title: post.title,
// //         text: post.title,
// //         url,
// //       });
// //     } catch (err) {
// //       console.log("Share cancelled");
// //     }
// //   } else {
// //     await navigator.clipboard.writeText(url);
// //     alert("लिंक कॉपी हो गया!");
// //   }
// // };


// //   return (
// // //     <div className="feed-container" ref={containerRef}>
// // //       {posts.map((post, index) => {
// // //         const isLast = index === posts.length - 1;

// // //         return (
// // // <div
// // //   key={post._id || index}
// // //   ref={isLast ? lastPostRef : null}
// // //   className="feed-card"
// // // >
// // //   {/* 🖼 IMAGE */}
// // //   <div className="feed-image-wrapper">
// // //     <img
// // //       src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
// // //       alt={post.title}
// // //       className="feed-image"
// // //       loading="lazy"
// // //     />
// // //       <button
// // //     className="share-btn"
// // //     onClick={(e) => handleShare(e, post)}
// // //   >
// // //     🔗
// // //   </button>
// // //   </div>

// // //   {/* 📝 CONTENT */}
// // //   <div className="feed-content">
// // //     {/* ⏱ TIME */}
// // //     <span className="feed-meta">
// // //       {formatTimeAgo(post.createdAt)}
// // //     </span>

// // //     {/* 📰 TITLE */}
// // //     <h3 className="feed-title">{post.title}</h3>

// // //     {/* 📄 DESCRIPTION */}
// // //     <p className="feed-desc">
// // //       {post.content || "No description available"}
// // //     </p>
// // //   </div>
// // // </div>
// // //         );
// // //       })}

// // //       {loading && <div className="loader">Loading...</div>}
// // //     </div>

// // <div className="feed-container" ref={containerRef}>
// //   {posts.map((post, index) => {
// //     const isLast = index === posts.length - 1;

// //     return (
// //       <div
// //         key={post._id || index}
// //         ref={isLast ? lastPostRef : null}
// //         className="feed-card"
// //       >
// //         {/* 🖼 IMAGE */}
// //         <div className="feed-image-wrapper">
// //           <img
// //             src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
// //             alt={post.title}
// //             className="feed-image"
// //             loading="lazy"
// //           />

// //           {/* 🔥 GRADIENT OVERLAY (PREMIUM LOOK) */}
// //           <div className="image-overlay"></div>

// //           {/* 🔥 SHARE BUTTON */}
// //           <button
// //             className="share-btn"
// //             onClick={(e) => handleShare(e, post)}
// //           >
// //             🔗
// //           </button>
// //         </div>

// //         {/* 📝 CONTENT */}
// //         <div className="feed-content">
// //           <span className="feed-meta">
// //             {formatTimeAgo(post.createdAt)}
// //           </span>

// //           <h3 className="feed-title">{post.title}</h3>

// //           <p className="feed-desc">
// //             {post.content || post.description || "No description available"}
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   })}

// //   {loading && <div className="loader">Loading...</div>}
// // </div>
// //   );
// // };

// // export default SwipeFeed;




















// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";
// import Layout from "../Layout/Layout";
// import { useLocation } from "../context/LocationContext";

// import { Helmet } from "react-helmet";
// import { useAuth } from "../context/auth";


// const LIMIT = 6;



// const SwipeFeed = () => {
//   const { location } = useLocation(); 
// const { slug } = useParams();  
//   const navigate = useNavigate();
//   const { auth } = useAuth();
//   const isAdmin = auth?.user?.role === "admin";

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initialPost, setInitialPost] = useState(null);

//   const observer = useRef();

//   const params = useParams();
// const { changeLocation } = useLocation();
// const postRefs = useRef([]); 


// useEffect(() => {
//   if (params.location && params.location !== location) {
//     changeLocation(params.location);
//   }
// }, [params.location]);

//   // 🔥 FETCH POSTS
//   const fetchPosts = useCallback(async (pageNo = 1) => {
//     if (loading || !hasMore) return;

//     try {
//       setLoading(true);

//       const { data } = await API.get(
//         // `/post/get-posts?status=approved&location=${location}&page=${pageNo}&limit=${LIMIT}`
//         `/post/get-posts?status=approved&location=${location}&page=${pageNo}&limit=${LIMIT}`
//       );

//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }

//       // setPosts((prev) => {
//       //   const ids = new Set(prev.map((p) => p._id));
//       //   const filtered = data.posts.filter((p) => !ids.has(p._id));
//       //   return [...prev, ...filtered];
//       // });



//       setPage(pageNo + 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [location, loading, hasMore]);


//         setPosts((prev) => {
//   const exists = prev.find(p => p._id === initialPost._id);
//   if (exists) return prev;
//   return [initialPost, ...prev]; 
// });

//   const fetchInitialPost = async () => {
//   if (!slug) return;

//   try {
//     const { data } = await API.get(
//       `/post/get-post/${slug}` // cache bust
//     );

//     if (data?.post) {
//       setInitialPost(data.post);
//     }
//   } catch (err) {
//     console.error("Initial post error:", err);
//   }
// };

//   // 🔥 INITIAL LOAD
// useEffect(() => {
//   // FULL RESET
//   setPosts([]);
//   setPage(1);
//   setHasMore(true);
//   setInitialPost(null);

//   if (slug) {
//     fetchInitialPost(); 
//   } else {
//     fetchPosts(1);
//   }

// }, [slug, location]);

// useEffect(() => {
//   if (!initialPost) return;

//   setPosts((prev) => {
//     const safePrev = prev.filter(Boolean);
//     const exists = safePrev.find(p => p._id === initialPost._id);

//     if (exists) return safePrev;

//     return [initialPost, ...safePrev];
//   });

// }, [initialPost]);

//   // 🔥 INTERSECTION OBSERVER (ONLY ONE LOADER)
//   const lastPostRef = (node) => {
//     if (loading) return;

//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         fetchPosts(page);
//       }
//     });

//     if (node) observer.current.observe(node);
//   };

//   // 🔥 SHARE
// const handleShare = async (e, post) => {
//   e.stopPropagation();

//   const url = `https://www.trendkari.in/feed/${post.slug}`;

//   const shareText = `
// 📰 ${post.title}

// 👉 पूरी खबर पढ़ें:


// `;

//   const shareData = {
//     title: post.title,
//     text: shareText,
//     url: url,
//   };


//   try {
//     if (navigator.share) {
//       await navigator.share(shareData);
//     } else {
//       await navigator.clipboard.writeText(shareText);
//       alert("लिंक कॉपी हो गया!");
//     }
//   } catch (err) {
//     console.log("Share cancelled", err);
//   }
// };

//   useEffect(() => {
//   if (slug) {

//     console.log("Opened from shared link");
//   }
// }, [slug]);



//   // 🔥 TIME FORMAT
//   const formatTimeAgo = (date) => {
//     const diff = Math.floor((Date.now() - new Date(date)) / 1000);
//     if (diff < 60) return "अभी";
//     if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} घंटे पहले`;
//     return `${Math.floor(diff / 86400)} दिन पहले`;
//   };

//     const handleAuthorClick = (e) => {
//     e.stopPropagation();
//     if (post?.author?._id) {
//       navigate(`/dashboard/user/profile/${post.author._id}`);
//     }
//   };


//   const getTextContent = (content) => {
//   if (!content) return "";

//   // If already string
//   if (typeof content === "string") return content;

//   // If EditorJS object
//   if (content.blocks) {
//     return content.blocks
//       .map((block) => block.data?.text || "")
//       .join(" ");
//   }

//   return "";
// };

//   return (
//     <div className="feed-container">
//       {/* {posts.map((post, index) => {
//         const isLast = index === posts.length - 1;

//         return (
//           <div
//             key={post._id || index}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           > */}

//           {posts.map((post, index) => {
//               if (!post) return null; // ✅ prevent crash
//   const isLast = index === posts.length - 1;

//   return (
//     <div
//       key={post._id || index}
//       ref={(el) => {
//         postRefs.current[index] = el; // assign ref
//         if (isLast) lastPostRef(el); // for infinite scroll
//       }}
//       className="feed-card"
//     >
//             {/* IMAGE */}
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 2 ? "eager" : "lazy"}
//               />

//               <div className="image-overlay" />

//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//               >
//                 🔗
//               </button>
//             </div>

//             {/* CONTENT */}
//             <div className="feed-content px-3">
//  <div className="feed-meta">
//   <span>{formatTimeAgo(post.createdAt)}</span>

//   {post.author && (
//     <span
//       className="feed-author ms-3"
//       onClick={(e) => handleAuthorClick(e, post)}
//     >
//       {post.author.name}
//     </span>

    
//   )}
// </div>
// {isAdmin && (
//   <button
//     className="edit-btn"
//     onClick={() => navigate(`/dashboard/admin/edit-post/${post.slug}`)}
//   >
//     ✏️
//   </button>
// )}
//               <h3 className="feed-title">{post.title}</h3>

//               <p className="feed-desc">
//                 {/* {post.content || post.description} */}
//   {getTextContent(post.content) || post.description || ""}

//               </p>
//             </div>
//           </div>
//         );
//       })}

//       {/* {loading && <div className="loader">Loading...</div>} */}

// {loading && posts.length === 0 && (
//   <div className="feed-skeleton-container">
//     {[1, 2].map((_, i) => (
//       <div key={i} className="feed-card skeleton">
//         <div className="feed-image-wrapper skeleton-bg" />

//         <div className="feed-content">
//           <div className="skeleton-line w-25 mb-2"></div>
//           <div className="skeleton-line w-75 mb-2"></div>
//           <div className="skeleton-line w-100 mb-2"></div>
//           <div className="skeleton-line w-90"></div>
//         </div>
//       </div>
//     ))}
//   </div>
// )}

// {loading && posts.length > 0 && (
//   <div className="text-center py-3 text-muted">
//     Loading more...
//   </div>
// )}
//     </div>
//   );
// };

// export default SwipeFeed;




// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";

// const LIMIT = 6;

// const SwipeFeed = () => {
//   const { slug } = useParams();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initialPost, setInitialPost] = useState(null);

//   const containerRef = useRef(null);
//   const observer = useRef();
//   const postRefs = useRef([]);
//   const isScrolling = useRef(false);

//   const [currentIndex, setCurrentIndex] = useState(0);



//   useEffect(() => {
//   // FULL RESET
//   setPosts([]);
//   setPage(1);
//   setHasMore(true);
//   setInitialPost(null);
//   setCurrentIndex(0);

//   if (slug) {
//     fetchInitialPost();
//   } else {
//     fetchPosts(1);
//   }
// }, [slug, location]);

//   // 🔥 FETCH FEED POSTS
//   const fetchPosts = useCallback(async (pageNo = 1) => {
//     if (loading || !hasMore) return;

//     try {
//       setLoading(true);

//       const { data } = await API.get(
//         `/post/get-posts?status=approved&page=${pageNo}&limit=${LIMIT}`
//       );

//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }

//       setPosts((prev) => {
//         const safePrev = prev.filter(Boolean);
//         const ids = new Set(safePrev.map(p => p._id));

//         const filtered = data.posts.filter(
//           (p) => p && !ids.has(p._id)
//         );

//         return [...safePrev, ...filtered];
//       });

//       setPage(pageNo + 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [loading, hasMore]);

//   // 🔥 FETCH SINGLE POST (SHARE LINK)

//   useEffect(() => {
//   if (slug && posts.length > 0) {
//     const index = posts.findIndex((p) => p.slug === slug);

//     if (index !== -1) {
//       setTimeout(() => {
//         goToIndex(index);
//       }, 200);
//     }
//   }
// }, [posts, slug]);


// const fetchInitialPost = async () => {
//   try {
//     const { data } = await API.get(`/post/get-post/${slug}`);

//     if (data?.post) {
//       setInitialPost(data.post);

//       // 🔥 IMPORTANT: set as FIRST item
//       setPosts([data.post]);

//       // fetch rest
//       setTimeout(() => {
//         fetchPosts(1);
//       }, 100);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };

//   // 🔥 INITIAL LOAD
//   // useEffect(() => {
//   //   setPosts([]);
//   //   setPage(1);
//   //   setHasMore(true);

//   //   if (slug) {
//   //     fetchInitialPost();
//   //   }

//   //   fetchPosts(1);
//   // }, [slug]);

// useEffect(() => {
//   const load = async () => {
//     setPosts([]);
//     setPage(1);
//     setHasMore(true);

//     let firstPost = null;

//     if (slug) {
//       try {
//         const { data } = await API.get(`/post/get-post/${slug}`);
//         firstPost = data?.post;
//         setInitialPost(firstPost);
//       } catch (e) {
//         console.error(e);
//       }
//     }

//     const { data } = await API.get(
//       `/post/get-posts?status=approved&page=1&limit=${LIMIT}`
//     );

//     let feedPosts = data?.posts || [];

//     // ✅ Inject initial post BEFORE setting state
//     if (firstPost) {
//       const exists = feedPosts.find(p => p._id === firstPost._id);
//       if (!exists) {
//         feedPosts = [firstPost, ...feedPosts];
//       }
//     }

//     setPosts(feedPosts);
//     setPage(2);
//   };

//   load();
// }, [slug]);


//   // 🔥 SCROLL TO CORRECT POST
// useEffect(() => {
//   if (!slug || posts.length === 0) return;

//   const interval = setInterval(() => {
//     const index = posts.findIndex(p => p.slug === slug);

//     if (index !== -1 && containerRef.current) {
//       containerRef.current.scrollTo({
//         top: index * window.innerHeight,
//         behavior: "auto",
//       });

//       clearInterval(interval);
//     }
//   }, 100);

//   return () => clearInterval(interval);

// }, [posts, slug]);

//   // 🔥 SCROLL ENGINE
// const goToIndex = (index) => {
//   if (index < 0 || index >= posts.length) return;

//   if (isScrolling.current) return;
//   isScrolling.current = true;

//   containerRef.current.scrollTo({
//     top: index * window.innerHeight,
//     behavior: "smooth",
//   });

//   setCurrentIndex(index);

//   setTimeout(() => {
//     isScrolling.current = false;
//   }, 500); // increase from 400 → smoother
// };

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

//   // 🔥 LOAD MORE
//   const lastPostRef = (node) => {
//     if (loading) return;

//     if (observer.current) observer.current.disconnect();

//     // observer.current = new IntersectionObserver((entries) => {
//     //   if (entries[0].isIntersecting) {
//     //     fetchPosts(page);
//     //   }
//     // });
//     observer.current = new IntersectionObserver(
//   (entries) => {
// if (entries[0].isIntersecting && hasMore && !loading) {
//   fetchPosts(page);
// }
//   },
//   {
//     root: null,
//     rootMargin: "200px",
//     threshold: 0.1,
//   }
// );

//     if (node) observer.current.observe(node);
//   };

//   // 🔥 SHARE
//   const handleShare = async (e, post) => {
//     e.stopPropagation();

//     const url = `https://www.trendkari.in/feed/${post.slug}`;

//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch {}
//   };

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;

//         const isLast = index === posts.length - 1;

//         return (
//           <div
//             key={post._id}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 2 ? "eager" : "lazy"}
//               />

//               <div className="image-overlay" />

//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//               >
//                 🔗
//               </button>
//             </div>

//             <div className="feed-content px-3">
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.content || ""}
//               </p>
//             </div>
//           </div>
//         );
//       })}

//       {loading && <div className="loader">Loading...</div>}
//     </div>
//   );
// };

// export default SwipeFeed;












// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";

// const LIMIT = 6;

// const SwipeFeed = () => {
//   const { slug } = useParams();
//   const location = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//     };
//   }, []);

//   // 🔥 SINGLE SOURCE OF TRUTH - INITIAL LOAD
//   useEffect(() => {
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Fetch initial feed posts first (for fast loading)
//         const feedResponse = await API.get(
//           `/post/get-posts?status=approved&page=1&limit=${LIMIT}`
//         );
        
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               // Check if post already exists in feed
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 // Insert at top for immediate visibility
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // Scroll to target post if exists
//           if (targetIndex !== -1) {
//             setTimeout(() => {
//               goToIndex(targetIndex);
//             }, 100);
//           }
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [slug, location.key]); // location.key ensures navigation resets

//   // 🔥 FETCH MORE POSTS (PAGINATION)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing) return;
    
//     try {
//       setLoading(true);
      
//       const { data } = await API.get(
//         `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`
//       );
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing]);

//   // 🔥 SMOOTH SCROLL TO INDEX
//   const goToIndex = useCallback((index) => {
//     if (!containerRef.current || isScrolling.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     isScrolling.current = true;
    
//     containerRef.current.scrollTo({
//       top: index * window.innerHeight,
//       behavior: "smooth",
//     });
    
//     setCurrentIndex(index);
    
//     setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [posts.length]);

//   // 🔥 TOUCH SWIPE HANDLER
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     let touchStart = 0;
//     let touchEnd = 0;
    
//     const handleTouchStart = (e) => {
//       touchStart = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e) => {
//       touchEnd = e.changedTouches[0].clientY;
//       const diff = touchStart - touchEnd;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           goToIndex(currentIndex + 1);
//         } else {
//           goToIndex(currentIndex - 1);
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, goToIndex]);

//   // 🔥 INFINITE SCROLL OBSERVER
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // 🔥 SHARE HANDLER
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };

//   // 🔥 LOADING STATE
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.content || ""}
//               </p>
//             </div>
//           </div>
//         );
//       })}
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">Loading more...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;



// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";

// const LIMIT = 6;

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
  
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
  
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
  
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const location = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({}); // Cache author details
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//     };
//   }, []);

//   // Fetch author details
//   const fetchAuthorDetails = useCallback(async (authorId) => {
//     if (!authorId || authors[authorId]) return authors[authorId];
    
//     try {
//       const { data } = await API.get(`/user/get-user/${authorId}`);
//       if (data?.user) {
//         setAuthors(prev => ({ ...prev, [authorId]: data.user }));
//         return data.user;
//       }
//     } catch (err) {
//       console.error("Error fetching author:", err);
//     }
//     return null;
//   }, [authors]);

//   // Fetch authors for multiple posts
//   useEffect(() => {
//     const fetchAllAuthors = async () => {
//       const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
//       for (const authorId of uniqueAuthorIds) {
//         if (!authors[authorId]) {
//           await fetchAuthorDetails(authorId);
//         }
//       }
//     };
    
//     if (posts.length > 0) {
//       fetchAllAuthors();
//     }
//   }, [posts, fetchAuthorDetails, authors]);

//   // 🔥 SINGLE SOURCE OF TRUTH - INITIAL LOAD
//   useEffect(() => {
//     // Reset everything when route changes
//     initialLoadDone.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       setAuthors({});
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (locationParam && locationParam !== "feed") {
//           feedUrl += `&location=${locationParam}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               // Check if post already exists in feed
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 // Insert at top for immediate visibility
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // Scroll to target post if exists
//           if (targetIndex !== -1) {
//             setTimeout(() => {
//               goToIndex(targetIndex);
//             }, 200);
//           }
          
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [locationParam, slug, location.key]);

//   // 🔥 FETCH MORE POSTS (PAGINATION)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
      
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (locationParam && locationParam !== "feed") {
//         feedUrl += `&location=${locationParam}`;
//       }
      
//       const { data } = await API.get(feedUrl);
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, locationParam]);

//   // 🔥 SMOOTH SCROLL TO INDEX
//   const goToIndex = useCallback((index) => {
//     if (!containerRef.current || isScrolling.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     isScrolling.current = true;
    
//     containerRef.current.scrollTo({
//       top: index * window.innerHeight,
//       behavior: "smooth",
//     });
    
//     setCurrentIndex(index);
    
//     setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [posts.length]);

//   // 🔥 TOUCH SWIPE HANDLER
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     let touchStart = 0;
//     let touchEnd = 0;
    
//     const handleTouchStart = (e) => {
//       touchStart = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e) => {
//       touchEnd = e.changedTouches[0].clientY;
//       const diff = touchStart - touchEnd;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           goToIndex(currentIndex + 1);
//         } else {
//           goToIndex(currentIndex - 1);
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, goToIndex]);

//   // 🔥 INFINITE SCROLL OBSERVER
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // 🔥 SHARE HANDLER
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${locationParam || "all"}/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };

//   // 🔥 LOADING STATE
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
//         const author = authors[post.author];
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <div className="feed-meta">
//                 {author && (
//                   <span className="feed-author">
//                     ✍️ {author.name || author.username || "लेखक"}
//                   </span>
//                 )}
//                 <span className="feed-time">
//                   🕒 {timeAgo(post.createdAt)}
//                 </span>
//               </div>
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.description || post.content || ""}
//               </p>
//             </div>
//           </div>
//         );
//       })}
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">Loading more...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;









// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";

// const LIMIT = 6;

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
  
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
  
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
  
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const location = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({});
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);
//   const scrollTimeoutRef = useRef(null);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//       if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
//     };
//   }, []);

//   // Fetch author details
//   const fetchAuthorDetails = useCallback(async (authorId) => {
//     if (!authorId || authors[authorId]) return authors[authorId];
    
//     try {
//       const { data } = await API.get(`/user/get-user/${authorId}`);
//       if (data?.user) {
//         setAuthors(prev => ({ ...prev, [authorId]: data.user }));
//         return data.user;
//       }
//     } catch (err) {
//       console.error("Error fetching author:", err);
//     }
//     return null;
//   }, [authors]);

//   // Fetch authors for multiple posts
//   useEffect(() => {
//     const fetchAllAuthors = async () => {
//       const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
//       for (const authorId of uniqueAuthorIds) {
//         if (!authors[authorId]) {
//           await fetchAuthorDetails(authorId);
//         }
//       }
//     };
    
//     if (posts.length > 0) {
//       fetchAllAuthors();
//     }
//   }, [posts, fetchAuthorDetails, authors]);

//   // 🔥 IMPROVED SMOOTH SCROLL TO INDEX
//   const goToIndex = useCallback((index, shouldScroll = true) => {
//     if (!containerRef.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     // Clear any existing scroll timeout
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current);
//     }
    
//     if (shouldScroll) {
//       isScrolling.current = true;
      
//       containerRef.current.scrollTo({
//         top: index * window.innerHeight,
//         behavior: "smooth",
//       });
//     }
    
//     setCurrentIndex(index);
    
//     // Reset scrolling flag after animation completes
//     scrollTimeoutRef.current = setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [posts.length]);

//   // 🔥 HANDLE SCROLL EVENT TO UPDATE CURRENT INDEX
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     const handleScroll = () => {
//       if (isScrolling.current) return;
      
//       const scrollTop = container.scrollTop;
//       const windowHeight = window.innerHeight;
//       const newIndex = Math.round(scrollTop / windowHeight);
      
//       if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
//         setCurrentIndex(newIndex);
//       }
//     };
    
//     container.addEventListener("scroll", handleScroll);
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [currentIndex, posts.length]);

//   // 🔥 SINGLE SOURCE OF TRUTH - INITIAL LOAD
//   useEffect(() => {
//     // Reset everything when route changes
//     initialLoadDone.current = false;
//     isScrolling.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       setAuthors({});
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (locationParam && locationParam !== "feed") {
//           feedUrl += `&location=${locationParam}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               // Check if post already exists in feed
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 // Insert at top for immediate visibility
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // IMPORTANT: Wait for DOM to render before scrolling
//           if (targetIndex !== -1) {
//             setTimeout(() => {
//               if (containerRef.current) {
//                 // Force scroll without animation for initial positioning
//                 containerRef.current.scrollTo({
//                   top: targetIndex * window.innerHeight,
//                   behavior: "auto",
//                 });
//                 setCurrentIndex(targetIndex);
                
//                 // Reset scrolling flag after manual scroll
//                 setTimeout(() => {
//                   isScrolling.current = false;
//                 }, 100);
//               }
//             }, 200);
//           }
          
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [locationParam, slug, location.key]);

//   // 🔥 FETCH MORE POSTS (PAGINATION)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
      
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (locationParam && locationParam !== "feed") {
//         feedUrl += `&location=${locationParam}`;
//       }
      
//       const { data } = await API.get(feedUrl);
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, locationParam]);

//   // 🔥 TOUCH SWIPE HANDLER
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     let touchStart = 0;
//     let touchEnd = 0;
    
//     const handleTouchStart = (e) => {
//       touchStart = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e) => {
//       if (isScrolling.current) return;
      
//       touchEnd = e.changedTouches[0].clientY;
//       const diff = touchStart - touchEnd;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           // Swipe up - next post
//           if (currentIndex + 1 < posts.length) {
//             goToIndex(currentIndex + 1, true);
//           }
//         } else {
//           // Swipe down - previous post
//           if (currentIndex - 1 >= 0) {
//             goToIndex(currentIndex - 1, true);
//           }
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, posts.length, goToIndex]);

//   // 🔥 KEYBOARD SUPPORT (Arrow keys)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isScrolling.current) return;
      
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         if (currentIndex - 1 >= 0) {
//           goToIndex(currentIndex - 1, true);
//         }
//       } else if (e.key === "ArrowDown") {
//         e.preventDefault();
//         if (currentIndex + 1 < posts.length) {
//           goToIndex(currentIndex + 1, true);
//         }
//       }
//     };
    
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, posts.length, goToIndex]);

//   // 🔥 INFINITE SCROLL OBSERVER
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // 🔥 SHARE HANDLER
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${locationParam || "all"}/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };

//   // 🔥 LOADING STATE
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
//         const author = authors[post.author];
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <div className="feed-meta">
//                 {author && (
//                   <span className="feed-author">
//                     ✍️ {post.author || "लेखक"}
//                   </span>
//                 )}
//                 <span className="feed-time">
//                   🕒 {timeAgo(post.createdAt)}
//                 </span>
//               </div>
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.description || post.content?.substring(0, 150) || ""}
//                 {(post.description?.length > 150 || post.content?.length > 150) && "..."}
//               </p>
//             </div>
//           </div>
//         );
//       })}
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">Loading more...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;










// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";

// const LIMIT = 6;

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
  
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
  
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
  
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const location = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({}); // Cache author details
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//     };
//   }, []);

//   // Fetch author details
//   const fetchAuthorDetails = useCallback(async (authorId) => {
//     if (!authorId || authors[authorId]) return authors[authorId];
    
//     try {
//       const { data } = await API.get(`/user/get-user/${authorId}`);
//       if (data?.user) {
//         setAuthors(prev => ({ ...prev, [authorId]: data.user }));
//         return data.user;
//       }
//     } catch (err) {
//       console.error("Error fetching author:", err);
//     }
//     return null;
//   }, [authors]);

//   // Fetch authors for multiple posts
//   useEffect(() => {
//     const fetchAllAuthors = async () => {
//       const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
//       for (const authorId of uniqueAuthorIds) {
//         if (!authors[authorId]) {
//           await fetchAuthorDetails(authorId);
//         }
//       }
//     };
    
//     if (posts.length > 0) {
//       fetchAllAuthors();
//     }
//   }, [posts, fetchAuthorDetails, authors]);

//   // 🔥 SINGLE SOURCE OF TRUTH - INITIAL LOAD
//   useEffect(() => {
//     // Reset everything when route changes
//     initialLoadDone.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       setAuthors({});
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (locationParam && locationParam !== "feed") {
//           feedUrl += `&location=${locationParam}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               // Check if post already exists in feed
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 // Insert at top for immediate visibility
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // Scroll to target post if exists
//           if (targetIndex !== -1) {
//             setTimeout(() => {
//               goToIndex(targetIndex);
//             }, 200);
//           }
          
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [locationParam, slug, location.key]);

//   // 🔥 FETCH MORE POSTS (PAGINATION)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
      
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (locationParam && locationParam !== "feed") {
//         feedUrl += `&location=${locationParam}`;
//       }
      
//       const { data } = await API.get(feedUrl);
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, locationParam]);

//   // 🔥 SMOOTH SCROLL TO INDEX
//   const goToIndex = useCallback((index) => {
//     if (!containerRef.current || isScrolling.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     isScrolling.current = true;
    
//     containerRef.current.scrollTo({
//       top: index * window.innerHeight,
//       behavior: "smooth",
//     });
    
//     setCurrentIndex(index);
    
//     setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [posts.length]);

//   // 🔥 TOUCH SWIPE HANDLER
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     let touchStart = 0;
//     let touchEnd = 0;
    
//     const handleTouchStart = (e) => {
//       touchStart = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e) => {
//       touchEnd = e.changedTouches[0].clientY;
//       const diff = touchStart - touchEnd;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           goToIndex(currentIndex + 1);
//         } else {
//           goToIndex(currentIndex - 1);
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, goToIndex]);

//   // 🔥 INFINITE SCROLL OBSERVER
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // 🔥 SHARE HANDLER
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${locationParam || "all"}/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };

//   // 🔥 LOADING STATE
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
//         const author = authors[post.author];
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <div className="feed-meta">
//                 {author && (
//                   <span className="feed-author">
//                     ✍️ {author.name || author.username || "लेखक"}
//                   </span>
//                 )}
//                 <span className="feed-time">
//                   🕒 {timeAgo(post.createdAt)}
//                 </span>
//               </div>
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.description || post.content?.substring(0, 150) || ""}
//                 {(post.description?.length > 150 || post.content?.length > 150) && "..."}
//               </p>
//             </div>
//           </div>
//         );
//       })}
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">Loading more...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;





// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";

// const LIMIT = 6;

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
  
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
  
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
  
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const location = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({});
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);
//   const scrollTimeoutRef = useRef(null);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//       if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
//     };
//   }, []);

//   // Fetch author details
//   const fetchAuthorDetails = useCallback(async (authorId) => {
//     if (!authorId || authors[authorId]) return authors[authorId];
    
//     try {
//       const { data } = await API.get(`/user/get-user/${authorId}`);
//       if (data?.user) {
//         setAuthors(prev => ({ ...prev, [authorId]: data.user }));
//         return data.user;
//       }
//     } catch (err) {
//       console.error("Error fetching author:", err);
//     }
//     return null;
//   }, [authors]);

//   // Fetch authors for multiple posts
//   useEffect(() => {
//     const fetchAllAuthors = async () => {
//       const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
//       for (const authorId of uniqueAuthorIds) {
//         if (!authors[authorId]) {
//           await fetchAuthorDetails(authorId);
//         }
//       }
//     };
    
//     if (posts.length > 0) {
//       fetchAllAuthors();
//     }
//   }, [posts, fetchAuthorDetails, authors]);

//   // 🔥 IMPROVED SMOOTH SCROLL TO INDEX
//   const goToIndex = useCallback((index, shouldScroll = true) => {
//     if (!containerRef.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     // Clear any existing scroll timeout
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current);
//     }
    
//     if (shouldScroll) {
//       isScrolling.current = true;
      
//       containerRef.current.scrollTo({
//         top: index * window.innerHeight,
//         behavior: "smooth",
//       });
//     }
    
//     setCurrentIndex(index);
    
//     // Reset scrolling flag after animation completes
//     // scrollTimeoutRef.current = setTimeout(() => {
//     //   isScrolling.current = false;
//     // }, 500);

//   }, [posts.length]);

//   // 🔥 HANDLE SCROLL EVENT TO UPDATE CURRENT INDEX
//   // useEffect(() => {
//   //   const container = containerRef.current;
//   //   if (!container) return;
    
//   //   const handleScroll = () => {
//   //     if (isScrolling.current) return;
      
//   //     const scrollTop = container.scrollTop;
//   //     const windowHeight = window.innerHeight;
//   //     // const newIndex = Math.round(scrollTop / windowHeight);

//   //     const newIndex = Math.floor((scrollTop + windowHeight / 2) / windowHeight);

//   //     if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
//   //       setCurrentIndex(newIndex);
//   //     }
//   //   };
    
//   //   container.addEventListener("scroll", handleScroll);
//   //   return () => container.removeEventListener("scroll", handleScroll);
//   // }, [currentIndex, posts.length]);

//   useEffect(() => {
//   const container = containerRef.current;
//   if (!container) return;

//   const handleScroll = () => {
//     const scrollTop = container.scrollTop;
//     const windowHeight = window.innerHeight;

//     // ✅ Better index calculation
//     const newIndex = Math.floor((scrollTop + windowHeight / 2) / windowHeight);

//     if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
//       setCurrentIndex(newIndex);
//     }

//     // ✅ THIS is Step 3 (place it HERE)
//     if (isScrolling.current) {
//       clearTimeout(scrollTimeoutRef.current);
//       scrollTimeoutRef.current = setTimeout(() => {
//         isScrolling.current = false;
//       }, 100);
//     }
//   };

//   container.addEventListener("scroll", handleScroll);
//   return () => container.removeEventListener("scroll", handleScroll);
// }, [currentIndex, posts.length]);

//   // 🔥 SINGLE SOURCE OF TRUTH - INITIAL LOAD
//   useEffect(() => {
//     // Reset everything when route changes
//     initialLoadDone.current = false;
//     isScrolling.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       setAuthors({});
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (locationParam && locationParam !== "feed") {
//           feedUrl += `&location=${locationParam}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               // Check if post already exists in feed
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 // Insert at top for immediate visibility
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // IMPORTANT: Wait for DOM to render before scrolling
//           // if (targetIndex !== -1) {
//           //   setTimeout(() => {
//           //     if (containerRef.current) {
//           //       // Force scroll without animation for initial positioning
//           //       containerRef.current.scrollTo({
//           //         top: targetIndex * window.innerHeight,
//           //         behavior: "auto",
//           //       });
//           //       setCurrentIndex(targetIndex);
                
//           //       // Reset scrolling flag after manual scroll
//           //       setTimeout(() => {
//           //         isScrolling.current = false;
//           //       }, 100);
//           //     }
//           //   }, 200);
//           // }

//           if (targetIndex !== -1) {
//   requestAnimationFrame(() => {
//     requestAnimationFrame(() => {
//       if (!containerRef.current) return;

//       const scrollTop = targetIndex * window.innerHeight;

//       // HARD sync scroll position
//       containerRef.current.scrollTop = scrollTop;

//       // Sync index AFTER scroll is applied
//       setCurrentIndex(targetIndex);

//       // Reset flags cleanly
//       isScrolling.current = false;
//     });
//   });
// }
          
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [locationParam, slug, location.key]);

//   // 🔥 FETCH MORE POSTS (PAGINATION)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
      
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (locationParam && locationParam !== "feed") {
//         feedUrl += `&location=${locationParam}`;
//       }
      
//       const { data } = await API.get(feedUrl);
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, locationParam]);

//   // 🔥 TOUCH SWIPE HANDLER
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     let touchStart = 0;
//     let touchEnd = 0;
    
//     const handleTouchStart = (e) => {
//       touchStart = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e) => {
//       if (isScrolling.current) return;
      
//       touchEnd = e.changedTouches[0].clientY;
//       const diff = touchStart - touchEnd;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           // Swipe up - next post
//           if (currentIndex + 1 < posts.length) {
//             goToIndex(currentIndex + 1, true);
//           }
//         } else {
//           // Swipe down - previous post
//           if (currentIndex - 1 >= 0) {
//             goToIndex(currentIndex - 1, true);
//           }
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, posts.length, goToIndex]);

//   // 🔥 KEYBOARD SUPPORT (Arrow keys)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isScrolling.current) return;
      
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         if (currentIndex - 1 >= 0) {
//           goToIndex(currentIndex - 1, true);
//         }
//       } else if (e.key === "ArrowDown") {
//         e.preventDefault();
//         if (currentIndex + 1 < posts.length) {
//           goToIndex(currentIndex + 1, true);
//         }
//       }
//     };
    
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, posts.length, goToIndex]);

//   // 🔥 INFINITE SCROLL OBSERVER
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // 🔥 SHARE HANDLER
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${locationParam || "all"}/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };

//   // 🔥 LOADING STATE
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
//         const author = authors[post.author];
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <div className="feed-meta">
//                 {author && (
//                   <span className="feed-author">
//                     ✍️ {post.author  || "लेखक"}
//                   </span>
//                 )}
//                 <span className="feed-time">
//                   🕒 {timeAgo(post.createdAt)}
//                 </span>
//               </div>
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.description || post.content?.substring(0, 150) || ""}
//                 {(post.description?.length > 150 || post.content?.length > 150) && "..."}
//               </p>
//             </div>
//           </div>
//         );
//       })}
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">Loading more...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;








// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";
// import { LocationProvider } from "../context/LocationContext";

// const LIMIT = 6;

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
  
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
  
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
  
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const location = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({});
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);
//   const scrollTimeoutRef = useRef(null);
//   const initialScrollDone = useRef(false); // New ref to track initial scroll

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//       if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
//     };
//   }, []);

//   // Fetch author details
//   const fetchAuthorDetails = useCallback(async (authorId) => {
//     if (!authorId || authors[authorId]) return authors[authorId];
    
//     try {
//       const { data } = await API.get(`/user/get-user/${authorId}`);
//       if (data?.user) {
//         setAuthors(prev => ({ ...prev, [authorId]: data.user }));
//         return data.user;
//       }
//     } catch (err) {
//       console.error("Error fetching author:", err);
//     }
//     return null;
//   }, [authors]);

//   // Fetch authors for multiple posts
//   useEffect(() => {
//     const fetchAllAuthors = async () => {
//       const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
//       for (const authorId of uniqueAuthorIds) {
//         if (!authors[authorId]) {
//           await fetchAuthorDetails(authorId);
//         }
//       }
//     };
    
//     if (posts.length > 0) {
//       fetchAllAuthors();
//     }
//   }, [posts, fetchAuthorDetails, authors]);

//   // IMPROVED SMOOTH SCROLL TO INDEX
//   const goToIndex = useCallback((index, shouldScroll = true) => {
//     if (!containerRef.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     // Clear any existing scroll timeout
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current);
//     }
    
//     if (shouldScroll) {
//       isScrolling.current = true;
      
//       containerRef.current.scrollTo({
//         top: index * window.innerHeight,
//         behavior: "smooth",
//       });
//     }
    
//     setCurrentIndex(index);
    
//     // Reset scrolling flag after animation completes
//     scrollTimeoutRef.current = setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [posts.length]);

//   // HANDLE SCROLL EVENT TO UPDATE CURRENT INDEX
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     const handleScroll = () => {
//       // Skip if we're programmatically scrolling
//       if (isScrolling.current) return;
      
//       const scrollTop = container.scrollTop;
//       const windowHeight = window.innerHeight;
//       const newIndex = Math.round(scrollTop / windowHeight);
      
//       // Only update if the index actually changed and is valid
//       if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
//         setCurrentIndex(newIndex);
//       }
//     };
    
//     container.addEventListener("scroll", handleScroll, { passive: true });
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [currentIndex, posts.length]);

//   // FIXED: SINGLE SOURCE OF TRUTH - INITIAL LOAD
//   useEffect(() => {
//     // Reset everything when route changes
//     initialLoadDone.current = false;
//     initialScrollDone.current = false; // Reset initial scroll flag
//     isScrolling.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       setAuthors({});
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (locationParam && locationParam !== "feed") {
//           feedUrl += `&location=${locationParam}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               // Check if post already exists in feed
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 // Insert at top for immediate visibility
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // IMPORTANT: Wait for DOM to render before scrolling
//           if (targetIndex !== -1) {
//             // Use multiple timeouts to ensure DOM is ready
//             const performInitialScroll = () => {
//               if (containerRef.current && !initialScrollDone.current) {
//                 initialScrollDone.current = true;
//                 isScrolling.current = true;
                
//                 // Force scroll without animation for initial positioning
//                 containerRef.current.scrollTop = targetIndex * window.innerHeight;
//                 setCurrentIndex(targetIndex);
                
//                 // Reset scrolling flag after a delay
//                 setTimeout(() => {
//                   isScrolling.current = false;
//                 }, 200);
//               }
//             };
            
//             // Wait for DOM to fully render
//             setTimeout(performInitialScroll, 100);
//             // Backup scroll in case first one fails
//             setTimeout(performInitialScroll, 300);
//           }
          
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [locationParam, slug, location.key]);

//   // FETCH MORE POSTS (PAGINATION)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
      
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (locationParam && locationParam !== "feed") {
//         feedUrl += `&location=${locationParam}`;
//       }
      
//       const { data } = await API.get(feedUrl);
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, locationParam]);

//   // TOUCH SWIPE HANDLER
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     let touchStart = 0;
//     let touchEnd = 0;
    
//     const handleTouchStart = (e) => {
//       touchStart = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e) => {
//       if (isScrolling.current) return;
      
//       touchEnd = e.changedTouches[0].clientY;
//       const diff = touchStart - touchEnd;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           // Swipe up - next post
//           if (currentIndex + 1 < posts.length) {
//             goToIndex(currentIndex + 1, true);
//           }
//         } else {
//           // Swipe down - previous post
//           if (currentIndex - 1 >= 0) {
//             goToIndex(currentIndex - 1, true);
//           }
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, posts.length, goToIndex]);

//   // KEYBOARD SUPPORT (Arrow keys)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isScrolling.current) return;
      
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         if (currentIndex - 1 >= 0) {
//           goToIndex(currentIndex - 1, true);
//         }
//       } else if (e.key === "ArrowDown") {
//         e.preventDefault();
//         if (currentIndex + 1 < posts.length) {
//           goToIndex(currentIndex + 1, true);
//         }
//       }
//     };
    
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, posts.length, goToIndex]);

//   // INFINITE SCROLL OBSERVER
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // SHARE HANDLER
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${locationParam} || "all"}/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };

//   // LOADING STATE
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
//         const author = authors[post.author];
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <div className="feed-meta">
//                 {author && (
//                   <span className="feed-author">
//                     ✍️ {post.author || "लेखक"}
//                   </span>
//                 )}
//                 <span className="feed-time">
//                   🕒 {timeAgo(post.createdAt)}
//                 </span>
//               </div>
//               <h3 className="feed-title">{post.title}</h3>
//               <p className="feed-desc">
//                 {post.description || post.content?.substring(0, 150) || ""}
//                 {(post.description?.length > 150 || post.content?.length > 150) && "..."}
//               </p>
//             </div>
//           </div>
//         );
//       })}
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">Loading more...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;








// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation as useRouterLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";
// import { useLocation } from "../context/LocationContext";

// const LIMIT = 6;

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
  
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
  
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
  
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const routerLocation = useRouterLocation();
//   const { location: contextLocation } = useLocation();

//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({});
  
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);
//   const scrollTimeoutRef = useRef(null);
//   const initialScrollDone = useRef(false);
//   const touchStartY = useRef(0);
//   const touchEndY = useRef(0);

//   // Get effective location - priority: URL param > context > default
//   const effectiveLocation = locationParam && locationParam !== "feed" 
//     ? locationParam 
//     : contextLocation || "kota";

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//       if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
//     };
//   }, []);

//   // // Fetch author details
//   // const fetchAuthorDetails = useCallback(async (authorId) => {
//   //   if (!authorId || authors[authorId]) return authors[authorId];
    
//   //   try {
//   //     const { data } = await API.get(`/user/get-user/${authorId}`);
//   //     if (data?.user) {
//   //       setAuthors(prev => ({ ...prev, [authorId]: data.user }));
//   //       return data.user;
//   //     }
//   //   } catch (err) {
//   //     console.error("Error fetching author:", err);
//   //   }
//   //   return null;
//   // }, [authors]);

//   // // Fetch authors for multiple posts
//   // useEffect(() => {
//   //   const fetchAllAuthors = async () => {
//   //     const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
//   //     for (const authorId of uniqueAuthorIds) {
//   //       if (!authors[authorId]) {
//   //         await fetchAuthorDetails(authorId);
//   //       }
//   //     }
//   //   };
    
//   //   if (posts.length > 0) {
//   //     fetchAllAuthors();
//   //   }
//   // }, [posts, fetchAuthorDetails, authors]);

//   // Smooth scroll to index
//   const goToIndex = useCallback((index, shouldScroll = true) => {
//     if (!containerRef.current) return;
//     if (index < 0 || index >= posts.length) return;
    
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current);
//     }
    
//     if (shouldScroll) {
//       isScrolling.current = true;
      
//       containerRef.current.scrollTo({
//         top: index * window.innerHeight,
//         behavior: "smooth",
//       });
//     }
    
//     setCurrentIndex(index);
    
//     scrollTimeoutRef.current = setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [posts.length]);

//   // Handle scroll event to update current index
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     const handleScroll = () => {
//       if (isScrolling.current) return;
      
//       const scrollTop = container.scrollTop;
//       const windowHeight = window.innerHeight;
//       const newIndex = Math.round(scrollTop / windowHeight);
      
//       if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
//         setCurrentIndex(newIndex);
        
//         // Trigger preload for next posts
//         // if (newIndex + 2 >= posts.length && hasMore && !loading && !initializing) {
//         //   fetchMorePosts();
//         // }

//         if (
//   newIndex >= posts.length - 2 &&
//   hasMore &&
//   !loading &&
//   !initializing &&
//   initialLoadDone.current
// ) {
//   fetchMorePosts();
// }
//       }
//     };
    
//     container.addEventListener("scroll", handleScroll, { passive: true });
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [currentIndex, posts.length, hasMore, loading, initializing]);

//   // Initialize feed
//   useEffect(() => {
//     initialLoadDone.current = false;
//     initialScrollDone.current = false;
//     isScrolling.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
      
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       // setAuthors({});
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on effective location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
//           feedUrl += `&location=${effectiveLocation}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
            
//             if (singlePost) {
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
//               if (existingIndex === -1) {
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);

//   //         const injectAds = (posts, city) => {
//   // const ads = CITY_ADS[city] || [];
//   // if (!ads.length) return posts;

//   // let result = [...posts];

//   // // Insert ads at positions
//   // const positions = [2, 5, 8]; // after every few posts

//   // ads.forEach((ad, i) => {
//   //   if (result.length > positions[i]) {
//   //     result.splice(positions[i], 0, {
//   //       ...ad,
//   //       isAd: true
//   //     });
//   //   }
//   // });

// //   return result;
// // };
          
//           // Wait for DOM to render before scrolling
//           if (targetIndex !== -1 && feedPosts.length > 0) {
//             const performInitialScroll = () => {
//               if (containerRef.current && !initialScrollDone.current && feedPosts.length > 0) {
//                 initialScrollDone.current = true;
//                 isScrolling.current = true;
                
//                 const targetScrollTop = targetIndex * window.innerHeight;
//                 containerRef.current.scrollTop = targetScrollTop;
//                 setCurrentIndex(targetIndex);
                
//                 setTimeout(() => {
//                   isScrolling.current = false;
//                 }, 200);
//               }
//             };
            
//             // Multiple attempts to ensure DOM is ready
//             setTimeout(performInitialScroll, 100);
//             setTimeout(performInitialScroll, 300);
//             setTimeout(performInitialScroll, 500);
//           }
          
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//         if (isMounted.current) {
//           toast?.error("Failed to load feed");
//         }
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [effectiveLocation, slug, routerLocation.key]);

//   // Fetch more posts (pagination)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
      
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
//         feedUrl += `&location=${effectiveLocation}`;
//       }
      
//       const { data } = await API.get(feedUrl);
      
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
      
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, effectiveLocation]);

//   // Touch swipe handler
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     const handleTouchStart = (e) => {
//       touchStartY.current = e.touches[0].clientY;
//     };
    
//     const handleTouchMove = (e) => {
//       // Prevent default to avoid page scroll during swipe
//       if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
//         e.preventDefault();
//       }
//     };
    
//     const handleTouchEnd = (e) => {
//       if (isScrolling.current) return;
      
//       touchEndY.current = e.changedTouches[0].clientY;
//       const diff = touchStartY.current - touchEndY.current;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           // Swipe up - next post
//           if (currentIndex + 1 < posts.length) {
//             goToIndex(currentIndex + 1, true);
//           } else if (currentIndex + 1 >= posts.length && hasMore && !loading) {
//             // Auto-trigger load more when reaching the end
//             fetchMorePosts();
//           }
//         } else {
//           // Swipe down - previous post
//           if (currentIndex - 1 >= 0) {
//             goToIndex(currentIndex - 1, true);
//           }
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart, { passive: false });
//     container.addEventListener("touchmove", handleTouchMove, { passive: false });
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchmove", handleTouchMove);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, posts.length, goToIndex, hasMore, loading, fetchMorePosts]);

//   // Keyboard support (Arrow keys)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isScrolling.current) return;
      
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         if (currentIndex - 1 >= 0) {
//           goToIndex(currentIndex - 1, true);
//         }
//       } else if (e.key === "ArrowDown") {
//         e.preventDefault();
//         if (currentIndex + 1 < posts.length) {
//           goToIndex(currentIndex + 1, true);
//         }
//       }
//     };
    
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, posts.length, goToIndex]);

//   // Infinite scroll observer
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
    
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       {
//         root: null,
//         rootMargin: "200px",
//         threshold: 0.1,
//       }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);

//   // Share handler
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
    
//     const url = `https://www.trendkari.in/feed/${effectiveLocation}/${post.slug}`;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };


//   const CITY_ADS = {
//   kota: [
//     {
//       _id: "ad-kota-1",
//       title: "🔥 Allen Kota - Top Coaching",
//       description: "Join India's best coaching institute",
//       image: "https://via.placeholder.com/400x700?text=Allen+Ad",
//       link: "https://allen.ac.in"
//     },
//     {
//       _id: "ad-kota-2",
//       title: "🏠 PG Available in Kota",
//       description: "Affordable rooms near coaching",
//       image: "https://via.placeholder.com/400x700?text=PG+Ad",
//       link: "#"
//     },
//     {
//       _id: "ad-kota-3",
//       title: "🍔 Best Cafes in Kota",
//       description: "Explore trending cafes",
//       image: "https://via.placeholder.com/400x700?text=Cafe+Ad",
//       link: "#"
//     }
//   ],

//   jaipur: [
//     {
//       _id: "ad-jaipur-1",
//       title: "🏨 Jaipur Luxury Hotels",
//       description: "Book your royal stay",
//       image: "https://via.placeholder.com/400x700?text=Hotel+Ad",
//       link: "#"
//     },
//     {
//       _id: "ad-jaipur-2",
//       title: "💍 Wedding Planners Jaipur",
//       description: "Make your wedding royal",
//       image: "https://via.placeholder.com/400x700?text=Wedding+Ad",
//       link: "#"
//     },
//     {
//       _id: "ad-jaipur-3",
//       title: "🛍️ Jaipur Shopping Festival",
//       description: "Flat 50% off",
//       image: "https://via.placeholder.com/400x700?text=Shopping+Ad",
//       link: "#"
//     }
//   ]
// };


//    const getPostContent = (content) => {
//   if (!content) return "NO Content";

//   // ✅ If already string
//   if (typeof content === "string") return content;

//   // ✅ If Editor.js format
//   if (typeof content === "object" && content.blocks) {
//     return content.blocks
//       .map(block => {
//         if (block.type === "paragraph") {
//           return block.data?.text || "";
//         }
//         if (block.type === "header") {
//           return block.data?.text || "";
//         }
//         return "";
//       })
//       .join(" ");
//   }

//   // fallback
//   return "NO Content";
// };


//   // Loading state
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">
//           <div className="spinner"></div>
//           <p>लोड हो रहा है...</p>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (!initializing && posts.length === 0) {
//     return (
//       <div className="feed-container empty-container">
//         <div className="empty-state">
//           <p>कोई पोस्ट नहीं मिली</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="feed-container" ref={containerRef}>
//       {posts.map((post, index) => {
//         if (!post) return null;
        
//         const isLast = index === posts.length - 1;
//         const author = [post.author];
        
//         return (
//           <div
//             key={`${post._id}-${index}`}
//             ref={isLast ? lastPostRef : null}
//             className="feed-card"
//             data-index={index}
//             data-active={currentIndex === index}
//           >
//             <div className="feed-image-wrapper">
//               <img
//                 src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
//                 alt={post.title}
//                 className="feed-image"
//                 loading={index < 3 ? "eager" : "lazy"}
//                 onError={(e) => {
//                   e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                 }}
//               />
              
//               <div className="image-overlay" />
              
//               <button
//                 className="share-btn"
//                 onClick={(e) => handleShare(e, post)}
//                 aria-label="Share"
//               >
//                 🔗
//               </button>
//             </div>
            
//             <div className="feed-content px-3">
//               <div className="feed-meta">
//                 {author && (
//                   <span className="feed-author">
//                     ✍️ {author.name || author.username || "Trendkari Team"}
//                   </span>
//                 )}
//                 <span className="feed-time">
//                   🕒 {timeAgo(post.createdAt)}
//                 </span>
//               </div>
//               <h3 className="feed-title">{post.title}</h3>
// {/* 

// >
//               <p>
// {post.content || "NO Content" }

//               </p> */}
//               {/* <p >
//                 {post.content || "NO Content"}
//               </p> */}

//               <div>
//                 {getPostContent(post.content)}
//               </div>
//             </div>
//           </div>
//         );
//       })}

      
      
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">
//             <div className="spinner-small"></div>
//             <p>लोड हो रहा है...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;



































// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useLocation as useRouterLocation } from "react-router-dom";
// import API from "../../utils/api";
// import "../../css/Swipe.css";
// import { useLocation } from "../context/LocationContext";

// const LIMIT = 6;

// // Ad configuration for different cities
// const CITY_ADS = {
//   kota: [
//     { id: 1, title: "🔥 Learn Stock Trading in 7 Days", description: "Master the stock market with expert guidance", cta: "Enroll Now", bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
//     { id: 2, title: "🚀 Grow Instagram to 100K Followers", description: "Proven strategies for rapid growth", cta: "Get Started", bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
//     { id: 3, title: "💼 Hiring Developers – Apply Now", description: "Remote positions available worldwide", cta: "Apply Today", bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
//     { id: 4, title: "📚 Free Digital Marketing Course", description: "Learn SEO, Social Media & More", cta: "Join Free", bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
//     { id: 5, title: "🏠 Property Deals in Your City", description: "Best real estate investment opportunities", cta: "View Deals", bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }
//   ],
//   ramganjamndi: [
//     { id: 1, title: "🏭 Industrial Training Program", description: "Get certified in manufacturing skills", cta: "Apply Now", bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
//     { id: 2, title: "🚜 Modern Farming Techniques", description: "Increase crop yield by 200%", cta: "Learn More", bgColor: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" },
//     { id: 3, title: "💻 Computer Course for Youth", description: "Basic to Advanced IT skills", cta: "Join Now", bgColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }
//   ],
//   snagod: [
//     { id: 1, title: "📖 Competitive Exam Prep", description: "Crack SSC, Bank & Railway exams", cta: "Start Prep", bgColor: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)" },
//     { id: 2, title: "💪 Fitness Center Membership", description: "50% off for first 100 members", cta: "Book Now", bgColor: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)" }
//   ],
//   ladpura: [
//     { id: 1, title: "🏪 Small Business Loan", description: "Instant approval up to 10 lakhs", cta: "Apply Online", bgColor: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" },
//     { id: 2, title: "🎨 Art & Craft Workshop", description: "Weekend classes for all ages", cta: "Register", bgColor: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" }
//   ]
// };

// // Default ads for cities without specific ads
// const DEFAULT_ADS = [
//   { id: 1, title: "🔥 Special Offer in Your City", description: "Limited time discount on services", cta: "Claim Offer", bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
//   { id: 2, title: "📱 Download Our App", description: "Get exclusive city updates", cta: "Install Now", bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }
// ];

// // Helper function for time ago format
// const timeAgo = (date) => {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//   let interval = seconds / 31536000;
//   if (interval > 1) return Math.floor(interval) + " साल पहले";
//   interval = seconds / 2592000;
//   if (interval > 1) return Math.floor(interval) + " महीने पहले";
//   interval = seconds / 86400;
//   if (interval > 1) return Math.floor(interval) + " दिन पहले";
//   interval = seconds / 3600;
//   if (interval > 1) return Math.floor(interval) + " घंटे पहले";
//   interval = seconds / 60;
//   if (interval > 1) return Math.floor(interval) + " मिनट पहले";
//   return Math.floor(seconds) + " सेकंड पहले";
// };

// // Ad Component
// const AdCard = ({ ad, index }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const adRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setIsVisible(true);
//           // Track ad impression (you can send to analytics)
//           console.log(`Ad ${ad.id} viewed`);
//         }
//       },
//       { threshold: 0.5 }
//     );

//     if (adRef.current) {
//       observer.observe(adRef.current);
//     }

//     return () => {
//       if (adRef.current) {
//         observer.unobserve(adRef.current);
//       }
//     };
//   }, [ad.id]);

//   const handleAdClick = () => {
//     // Track ad click (you can send to analytics)
//     console.log(`Ad ${ad.id} clicked`);
//     // Add your affiliate link or action here
//     alert(`Opening: ${ad.title}\nThis is a demo ad. Integrate your actual link here.`);
//   };

//   return (
//     <div 
//       ref={adRef}
//       className="feed-card ad-card"
//       onClick={handleAdClick}
//       style={{ cursor: 'pointer' }}
//     >
//       <div className="ad-wrapper" style={{ background: ad.bgColor }}>
//         <div className="ad-badge">Sponsored</div>
//         <div className="ad-content">
//           <h3 className="ad-title">{ad.title}</h3>
//           <p className="ad-description">{ad.description}</p>
//           <button className="ad-cta-btn">{ad.cta}</button>
//         </div>
//         <div className="ad-decoration">
//           <div className="ad-icon">📢</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SwipeFeed = () => {
//   const { location: locationParam, slug } = useParams();
//   const routerLocation = useRouterLocation();
//   const { location: contextLocation } = useLocation();
  
//   // State declarations - ORDER MATTERS!
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [authors, setAuthors] = useState({});
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [adFrequency, setAdFrequency] = useState({});
//   const [combinedItems, setCombinedItems] = useState([]); // Declare this BEFORE it's used
  
//   // Refs
//   const containerRef = useRef(null);
//   const observer = useRef();
//   const isScrolling = useRef(false);
//   const isMounted = useRef(true);
//   const initialLoadDone = useRef(false);
//   const scrollTimeoutRef = useRef(null);
//   const initialScrollDone = useRef(false);
//   const touchStartY = useRef(0);
//   const touchEndY = useRef(0);
  
//   // Get effective location - priority: URL param > context > default
//   const effectiveLocation = locationParam && locationParam !== "feed" ? locationParam : contextLocation || "kota";
  
//   // Get ads for current city
//   const getCityAds = useCallback(() => {
//     const cityAds = CITY_ADS[effectiveLocation.toLowerCase()];
//     return cityAds && cityAds.length > 0 ? cityAds : DEFAULT_ADS;
//   }, [effectiveLocation]);
  
//   // Insert ads into posts based on frequency (every 5 posts, starting at positions 2, 5, 8...)
//   const insertAdsIntoPosts = useCallback((originalPosts, currentAds, startIndex = 0) => {
//     if (!originalPosts.length) return [];
    
//     const adPositions = [2, 5, 8, 11, 14, 17, 20]; // Ad positions (0-indexed: 2,5,8 means 3rd, 6th, 9th post)
//     const result = [];
//     let adIndex = 0;
    
//     for (let i = 0; i < originalPosts.length; i++) {
//       // Check if we need to insert an ad at this position (considering previously inserted ads)
//       const adjustedPosition = result.length;
//       if (adIndex < currentAds.length && adPositions.includes(adjustedPosition) && adjustedPosition >= startIndex) {
//         // Insert ad
//         result.push({ 
//           type: 'ad', 
//           data: currentAds[adIndex % currentAds.length],
//           adId: `${currentAds[adIndex % currentAds.length].id}-${adjustedPosition}`
//         });
//         adIndex++;
//       }
//       // Insert actual post
//       result.push({ type: 'post', data: originalPosts[i], originalIndex: i });
//     }
    
//     return result;
//   }, []);
  
//   // Track ad frequency per session
//   const updateAdFrequency = useCallback((city) => {
//     setAdFrequency(prev => ({
//       ...prev,
//       [city]: (prev[city] || 0) + 1
//     }));
//   }, []);
  
//   // Update combined items when posts or city changes
//   useEffect(() => {
//     if (posts.length > 0) {
//       const cityAds = getCityAds();
//       const itemsWithAds = insertAdsIntoPosts(posts, cityAds);
//       setCombinedItems(itemsWithAds);
//       updateAdFrequency(effectiveLocation);
//     } else {
//       setCombinedItems([]);
//     }
//   }, [posts, effectiveLocation, insertAdsIntoPosts, updateAdFrequency, getCityAds]);
  
//   // Smooth scroll to index
//   const goToIndex = useCallback((index, shouldScroll = true) => {
//     if (!containerRef.current) return;
//     if (index < 0 || index >= combinedItems.length) return;
    
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current);
//     }
    
//     if (shouldScroll) {
//       isScrolling.current = true;
//       containerRef.current.scrollTo({
//         top: index * window.innerHeight,
//         behavior: "smooth",
//       });
//     }
//     setCurrentIndex(index);
    
//     scrollTimeoutRef.current = setTimeout(() => {
//       isScrolling.current = false;
//     }, 500);
//   }, [combinedItems.length]);
  
//   // Fetch more posts (pagination)
//   const fetchMorePosts = useCallback(async () => {
//     if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
//     try {
//       setLoading(true);
//       let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
//       if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
//         feedUrl += `&location=${effectiveLocation}`;
//       }
      
//       const { data } = await API.get(feedUrl);
//       if (!isMounted.current) return;
      
//       if (!data?.posts?.length) {
//         setHasMore(false);
//         return;
//       }
      
//       setPosts(prev => {
//         const existingIds = new Set(prev.map(p => p._id));
//         const newPosts = data.posts.filter(p => !existingIds.has(p._id));
//         return [...prev, ...newPosts];
//       });
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error("Error fetching more posts:", err);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   }, [loading, hasMore, page, initializing, effectiveLocation]);
  
//   // Handle scroll event to update current index
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     const handleScroll = () => {
//       if (isScrolling.current) return;
//       const scrollTop = container.scrollTop;
//       const windowHeight = window.innerHeight;
//       const newIndex = Math.round(scrollTop / windowHeight);
      
//       if (newIndex !== currentIndex && newIndex >= 0 && newIndex < combinedItems.length) {
//         setCurrentIndex(newIndex);
        
//         // Check if we need to load more posts (considering ads)
//         const postsLoaded = combinedItems.filter(item => item.type === 'post').length;
//         if (newIndex >= combinedItems.length - 2 && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       }
//     };
    
//     container.addEventListener("scroll", handleScroll, { passive: true });
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [currentIndex, combinedItems, hasMore, loading, initializing, fetchMorePosts]);
  
//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (observer.current) observer.current.disconnect();
//       if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
//     };
//   }, []);
  
//   // Initialize feed
//   useEffect(() => {
//     initialLoadDone.current = false;
//     initialScrollDone.current = false;
//     isScrolling.current = false;
    
//     const initializeFeed = async () => {
//       if (!isMounted.current) return;
//       setInitializing(true);
//       setPosts([]);
//       setPage(1);
//       setHasMore(true);
//       setCurrentIndex(0);
//       setCombinedItems([]); // Reset combined items
      
//       try {
//         let feedPosts = [];
//         let targetIndex = -1;
        
//         // Build query params based on effective location
//         let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
//         if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
//           feedUrl += `&location=${effectiveLocation}`;
//         }
        
//         // Fetch initial feed posts
//         const feedResponse = await API.get(feedUrl);
//         feedPosts = feedResponse?.data?.posts || [];
        
//         // If there's a slug, fetch that specific post and merge
//         if (slug) {
//           try {
//             const singleResponse = await API.get(`/post/get-post/${slug}`);
//             const singlePost = singleResponse?.data?.post;
//             if (singlePost) {
//               const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
//               if (existingIndex === -1) {
//                 feedPosts = [singlePost, ...feedPosts];
//                 targetIndex = 0;
//               } else {
//                 targetIndex = existingIndex;
//               }
//             }
//           } catch (err) {
//             console.error("Error fetching single post:", err);
//           }
//         }
        
//         if (isMounted.current) {
//           setPosts(feedPosts);
//           setPage(2);
          
//           // Wait for DOM to render before scrolling
//           if (targetIndex !== -1 && feedPosts.length > 0) {
//             const performInitialScroll = () => {
//               if (containerRef.current && !initialScrollDone.current && combinedItems.length > 0) {
//                 initialScrollDone.current = true;
//                 isScrolling.current = true;
//                 // Find the actual index of the target post in combined items
//                 let actualIndex = -1;
//                 for (let i = 0; i < combinedItems.length; i++) {
//                   if (combinedItems[i].type === 'post' && combinedItems[i].originalIndex === targetIndex) {
//                     actualIndex = i;
//                     break;
//                   }
//                 }
                
//                 if (actualIndex !== -1) {
//                   const targetScrollTop = actualIndex * window.innerHeight;
//                   containerRef.current.scrollTop = targetScrollTop;
//                   setCurrentIndex(actualIndex);
//                 }
                
//                 setTimeout(() => {
//                   isScrolling.current = false;
//                 }, 200);
//               }
//             };
            
//             // Multiple attempts to ensure DOM is ready
//             setTimeout(performInitialScroll, 100);
//             setTimeout(performInitialScroll, 300);
//             setTimeout(performInitialScroll, 500);
//           }
//           initialLoadDone.current = true;
//         }
//       } catch (err) {
//         console.error("Error initializing feed:", err);
//         if (isMounted.current) {
//           // toast?.error("Failed to load feed");
//           console.error("Failed to load feed");
//         }
//       } finally {
//         if (isMounted.current) {
//           setInitializing(false);
//         }
//       }
//     };
    
//     initializeFeed();
//   }, [effectiveLocation, slug, routerLocation.key]);
  
//   // Touch swipe handler
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
    
//     const handleTouchStart = (e) => {
//       touchStartY.current = e.touches[0].clientY;
//     };
    
//     const handleTouchMove = (e) => {
//       if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
//         e.preventDefault();
//       }
//     };
    
//     const handleTouchEnd = (e) => {
//       if (isScrolling.current) return;
//       touchEndY.current = e.changedTouches[0].clientY;
//       const diff = touchStartY.current - touchEndY.current;
      
//       if (Math.abs(diff) > 50) {
//         if (diff > 0) {
//           // Swipe up - next item
//           if (currentIndex + 1 < combinedItems.length) {
//             goToIndex(currentIndex + 1, true);
//           } else if (currentIndex + 1 >= combinedItems.length && hasMore && !loading) {
//             fetchMorePosts();
//           }
//         } else {
//           // Swipe down - previous item
//           if (currentIndex - 1 >= 0) {
//             goToIndex(currentIndex - 1, true);
//           }
//         }
//       }
//     };
    
//     container.addEventListener("touchstart", handleTouchStart, { passive: false });
//     container.addEventListener("touchmove", handleTouchMove, { passive: false });
//     container.addEventListener("touchend", handleTouchEnd);
    
//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchmove", handleTouchMove);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex, combinedItems.length, goToIndex, hasMore, loading, fetchMorePosts]);
  
//   // Keyboard support (Arrow keys)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isScrolling.current) return;
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         if (currentIndex - 1 >= 0) {
//           goToIndex(currentIndex - 1, true);
//         }
//       } else if (e.key === "ArrowDown") {
//         e.preventDefault();
//         if (currentIndex + 1 < combinedItems.length) {
//           goToIndex(currentIndex + 1, true);
//         }
//       }
//     };
    
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, combinedItems.length, goToIndex]);
  
//   // Infinite scroll observer
//   const lastPostRef = useCallback((node) => {
//     if (loading || !hasMore || initializing) return;
//     if (observer.current) observer.current.disconnect();
    
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
//           fetchMorePosts();
//         }
//       },
//       { root: null, rootMargin: "200px", threshold: 0.1 }
//     );
    
//     if (node) observer.current.observe(node);
//   }, [loading, hasMore, fetchMorePosts, initializing]);
  
//   // Share handler
//   const handleShare = async (e, post) => {
//     e.stopPropagation();
//     const url = `https://www.trendkari.in/feed/${effectiveLocation}/${post.slug}`;
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: post.title,
//           text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
//           url,
//         });
//       } else {
//         await navigator.clipboard.writeText(url);
//         alert("लिंक कॉपी हो गया!");
//       }
//     } catch (err) {
//       console.error("Share failed:", err);
//     }
//   };
  
//   const getPostContent = (content) => {
//     if (!content) return "NO Content";
//     if (typeof content === "string") return content;
//     if (typeof content === "object" && content.blocks) {
//       return content.blocks
//         .map(block => {
//           if (block.type === "paragraph") {
//             return block.data?.text || "";
//           }
//           if (block.type === "header") {
//             return block.data?.text || "";
//           }
//           return "";
//         })
//         .join(" ");
//     }
//     return "NO Content";
//   };
  
//   // Loading state
//   if (initializing && posts.length === 0) {
//     return (
//       <div className="feed-container loading-container">
//         <div className="loader">
//           <div className="spinner"></div>
//           <p>लोड हो रहा है...</p>
//         </div>
//       </div>
//     );
//   }
  
//   // Empty state
//   if (!initializing && posts.length === 0) {
//     return (
//       <div className="feed-container empty-container">
//         <div className="empty-state">
//           <p>कोई पोस्ट नहीं मिली</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="feed-container" ref={containerRef}>
//       {combinedItems.map((item, index) => {
//         if (item.type === 'ad') {
//           // Render ad
//           const isLast = index === combinedItems.length - 1;
//           return (
//             <div 
//               key={`ad-${item.adId}-${index}`} 
//               ref={isLast ? lastPostRef : null}
//               className="feed-card-wrapper"
//               data-index={index}
//               data-active={currentIndex === index}
//             >
//               <AdCard ad={item.data} index={index} />
//             </div>
//           );
//         } else {
//           // Render post
//           const post = item.data;
//           const isLast = index === combinedItems.length - 1;
//           const author = post.author;
          
//           return (
//             <div 
//               key={`${post._id}-${index}`} 
//               ref={isLast ? lastPostRef : null}
//               className="feed-card"
//               data-index={index}
//               data-active={currentIndex === index}
//             >
//               <div className="feed-image-wrapper">
//                 <img 
//                   src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"} 
//                   alt={post.title} 
//                   className="feed-image" 
//                   loading={index < 3 ? "eager" : "lazy"} 
//                   onError={(e) => {
//                     e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
//                   }} 
//                 />
//                 <div className="image-overlay" />
//                 <button className="share-btn" onClick={(e) => handleShare(e, post)} aria-label="Share">
//                   🔗
//                 </button>
//               </div>
//               <div className="feed-content px-3">
//                 <div className="feed-meta">
//                   {author && (
//                     <span className="feed-author">
//                       ✍️ {author.name || author.username || "Trendkari Team"}
//                     </span>
//                   )}
//                   <span className="feed-time"> 🕒 {timeAgo(post.createdAt)} </span>
//                 </div>
//                 <h3 className="feed-title">{post.title}</h3>
//                 <div>{getPostContent(post.content)}</div>
//               </div>
//             </div>
//           );
//         }
//       })}
//       {loading && (
//         <div className="loader-wrapper">
//           <div className="loader">
//             <div className="spinner-small"></div>
//             <p>लोड हो रहा है...</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SwipeFeed;






























import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation as useRouterLocation } from "react-router-dom";
import API from "../../utils/api";
import "../../css/Swipe.css";
import { useLocation } from "../context/LocationContext";

const LIMIT = 6;

// Ad configuration for different cities
const CITY_ADS = {
  kota: [
    { id: 1, title: "🔥 Learn Stock Trading in 7 Days", description: "Master the stock market with expert guidance", cta: "Enroll Now", bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: 2, title: "🚀 Grow Instagram to 100K Followers", description: "Proven strategies for rapid growth", cta: "Get Started", bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: 3, title: "💼 Hiring Developers – Apply Now", description: "Remote positions available worldwide", cta: "Apply Today", bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: 4, title: "📚 Free Digital Marketing Course", description: "Learn SEO, Social Media & More", cta: "Join Free", bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { id: 5, title: "🏠 Property Deals in Your City", description: "Best real estate investment opportunities", cta: "View Deals", bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }
  ],
  ramganjamndi: [
    { id: 1, title: "🏭 Industrial Training Program", description: "Get certified in manufacturing skills", cta: "Apply Now", bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
    { id: 2, title: "🚜 Modern Farming Techniques", description: "Increase crop yield by 200%", cta: "Learn More", bgColor: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" },
    { id: 3, title: "💻 Computer Course for Youth", description: "Basic to Advanced IT skills", cta: "Join Now", bgColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }
  ],
  snagod: [
    { id: 1, title: "📖 Competitive Exam Prep", description: "Crack SSC, Bank & Railway exams", cta: "Start Prep", bgColor: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)" },
    { id: 2, title: "💪 Fitness Center Membership", description: "50% off for first 100 members", cta: "Book Now", bgColor: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)" }
  ],
  ladpura: [
    { id: 1, title: "🏪 Small Business Loan", description: "Instant approval up to 10 lakhs", cta: "Apply Online", bgColor: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" },
    { id: 2, title: "🎨 Art & Craft Workshop", description: "Weekend classes for all ages", cta: "Register", bgColor: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" }
  ]
};

// Default ads for cities without specific ads
const DEFAULT_ADS = [
  { id: 1, title: "🔥 Special Offer in Your City", description: "Limited time discount on services", cta: "Claim Offer", bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: 2, title: "📱 Download Our App", description: "Get exclusive city updates", cta: "Install Now", bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }
];

// Helper function for time ago format
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " साल पहले";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " महीने पहले";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " दिन पहले";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  return Math.floor(seconds) + " सेकंड पहले";
};

// Ad Component
const AdCard = ({ ad, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Track ad impression (you can send to analytics)
          console.log(`Ad ${ad.id} viewed`);
        }
      },
      { threshold: 0.5 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
    };
  }, [ad.id]);

  const handleAdClick = () => {
    // Track ad click (you can send to analytics)
    console.log(`Ad ${ad.id} clicked`);
    // Add your affiliate link or action here
    alert(`Opening: ${ad.title}\nThis is a demo ad. Integrate your actual link here.`);
  };

  return (
    <div 
      ref={adRef}
      className="feed-card ad-card"
      onClick={handleAdClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="ad-wrapper" style={{ background: ad.bgColor }}>
        <div className="ad-badge">Sponsored</div>
        <div className="ad-content">
          <h3 className="ad-title">{ad.title}</h3>
          <p className="ad-description">{ad.description}</p>
          <button className="ad-cta-btn">{ad.cta}</button>
        </div>
        <div className="ad-decoration">
          <div className="ad-icon">📢</div>
        </div>
      </div>
    </div>
  );
};

const SwipeFeed = () => {
  const { location: locationParam, slug } = useParams();
  const routerLocation = useRouterLocation();
  const { location: contextLocation } = useLocation();
  
  // State declarations
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [authors, setAuthors] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [adFrequency, setAdFrequency] = useState({});
  const [combinedItems, setCombinedItems] = useState([]);
  const [targetPostId, setTargetPostId] = useState(null); // Store target post ID
  
  // Refs
  const containerRef = useRef(null);
  const observer = useRef();
  const isScrolling = useRef(false);
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const initialScrollDone = useRef(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const scrollAttempted = useRef(false);
  
  // Get effective location - priority: URL param > context > default
  const effectiveLocation = locationParam && locationParam !== "feed" ? locationParam : contextLocation || "kota";
  
  // Get ads for current city
  const getCityAds = useCallback(() => {
    const cityAds = CITY_ADS[effectiveLocation.toLowerCase()];
    return cityAds && cityAds.length > 0 ? cityAds : DEFAULT_ADS;
  }, [effectiveLocation]);
  
  // Insert ads into posts based on frequency (every 5 posts, starting at positions 2, 5, 8...)
  const insertAdsIntoPosts = useCallback((originalPosts, currentAds, startIndex = 0) => {
    if (!originalPosts.length) return [];
    
    // Ad positions (0-indexed: 2,5,8 means 3rd, 6th, 9th post)
    const adPositions = [2, 5, 8, 11, 14, 17, 20];
    const result = [];
    let adIndex = 0;
    
    for (let i = 0; i < originalPosts.length; i++) {
      // Calculate position considering previously inserted ads
      const currentPosition = result.length;
      
      // Insert ad if this position matches any ad position
      if (adIndex < currentAds.length && adPositions.includes(currentPosition)) {
        result.push({ 
          type: 'ad', 
          data: currentAds[adIndex % currentAds.length],
          adId: `${currentAds[adIndex % currentAds.length].id}-${currentPosition}`
        });
        adIndex++;
      }
      
      // Insert post with original index preserved
      result.push({ 
        type: 'post', 
        data: originalPosts[i], 
        originalIndex: i 
      });
    }
    
    return result;
  }, []);
  
  // Track ad frequency per session
  const updateAdFrequency = useCallback((city) => {
    setAdFrequency(prev => ({
      ...prev,
      [city]: (prev[city] || 0) + 1
    }));
  }, []);
  
  // Update combined items when posts or city changes
  useEffect(() => {
    if (posts.length > 0) {
      const cityAds = getCityAds();
      const itemsWithAds = insertAdsIntoPosts(posts, cityAds);
      setCombinedItems(itemsWithAds);
      updateAdFrequency(effectiveLocation);
    } else {
      setCombinedItems([]);
    }
  }, [posts, effectiveLocation, insertAdsIntoPosts, updateAdFrequency, getCityAds]);
  
  // Scroll to target post when combinedItems is ready
  useEffect(() => {
    if (!targetPostId || !containerRef.current || scrollAttempted.current || combinedItems.length === 0) {
      return;
    }
    
    // Find the index of the target post in combinedItems
    let actualIndex = -1;
    for (let i = 0; i < combinedItems.length; i++) {
      if (combinedItems[i].type === 'post' && combinedItems[i].data._id === targetPostId) {
        actualIndex = i;
        break;
      }
    }
    
    if (actualIndex !== -1 && !scrollAttempted.current) {
      scrollAttempted.current = true;
      isScrolling.current = true;
      initialScrollDone.current = true;
      
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (containerRef.current) {
          const targetScrollTop = actualIndex * window.innerHeight;
          containerRef.current.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
          });
          setCurrentIndex(actualIndex);
          
          setTimeout(() => {
            isScrolling.current = false;
          }, 500);
        }
      }, 100);
    }
  }, [combinedItems, targetPostId]);
  
  // Smooth scroll to index
  const goToIndex = useCallback((index, shouldScroll = true) => {
    if (!containerRef.current) return;
    if (index < 0 || index >= combinedItems.length) return;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    if (shouldScroll) {
      isScrolling.current = true;
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [combinedItems.length]);
  
  // Fetch more posts (pagination)
  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
    try {
      setLoading(true);
      let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
      if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
        feedUrl += `&location=${effectiveLocation}`;
      }
      
      const { data } = await API.get(feedUrl);
      if (!isMounted.current) return;
      
      if (!data?.posts?.length) {
        setHasMore(false);
        return;
      }
      
      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const newPosts = data.posts.filter(p => !existingIds.has(p._id));
        return [...prev, ...newPosts];
      });
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Error fetching more posts:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [loading, hasMore, page, initializing, effectiveLocation]);
  
  // Handle scroll event to update current index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (isScrolling.current) return;
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < combinedItems.length) {
        setCurrentIndex(newIndex);
        
        // Check if we need to load more posts (considering ads)
        const postsLoaded = combinedItems.filter(item => item.type === 'post').length;
        if (newIndex >= combinedItems.length - 2 && hasMore && !loading && !initializing && initialLoadDone.current) {
          fetchMorePosts();
        }
      }
    };
    
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, combinedItems, hasMore, loading, initializing, fetchMorePosts]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (observer.current) observer.current.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);
  
  // Initialize feed
  useEffect(() => {
    initialLoadDone.current = false;
    initialScrollDone.current = false;
    isScrolling.current = false;
    scrollAttempted.current = false;
    setTargetPostId(null); // Reset target post ID
    
    const initializeFeed = async () => {
      if (!isMounted.current) return;
      setInitializing(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setCurrentIndex(0);
      setCombinedItems([]);
      
      try {
        let feedPosts = [];
        
        // Build query params based on effective location
        let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
        if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
          feedUrl += `&location=${effectiveLocation}`;
        }
        
        // Fetch initial feed posts
        const feedResponse = await API.get(feedUrl);
        feedPosts = feedResponse?.data?.posts || [];
        
        // If there's a slug, fetch that specific post and merge
        if (slug) {
          try {
            const singleResponse = await API.get(`/post/get-post/${slug}`);
            const singlePost = singleResponse?.data?.post;
            if (singlePost) {
              const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              if (existingIndex === -1) {
                feedPosts = [singlePost, ...feedPosts];
                setTargetPostId(singlePost._id);
              } else {
                setTargetPostId(singlePost._id);
              }
            }
          } catch (err) {
            console.error("Error fetching single post:", err);
          }
        }
        
        if (isMounted.current) {
          setPosts(feedPosts);
          setPage(2);
          initialLoadDone.current = true;
        }
      } catch (err) {
        console.error("Error initializing feed:", err);
        if (isMounted.current) {
          console.error("Failed to load feed");
        }
      } finally {
        if (isMounted.current) {
          setInitializing(false);
        }
      }
    };
    
    initializeFeed();
  }, [effectiveLocation, slug, routerLocation.key]);
  
  // Touch swipe handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (e) => {
      if (isScrolling.current) return;
      touchEndY.current = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY.current;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up - next item
          if (currentIndex + 1 < combinedItems.length) {
            goToIndex(currentIndex + 1, true);
          } else if (currentIndex + 1 >= combinedItems.length && hasMore && !loading) {
            fetchMorePosts();
          }
        } else {
          // Swipe down - previous item
          if (currentIndex - 1 >= 0) {
            goToIndex(currentIndex - 1, true);
          }
        }
      }
    };
    
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, combinedItems.length, goToIndex, hasMore, loading, fetchMorePosts]);
  
  // Keyboard support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling.current) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex - 1 >= 0) {
          goToIndex(currentIndex - 1, true);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex + 1 < combinedItems.length) {
          goToIndex(currentIndex + 1, true);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, combinedItems.length, goToIndex]);
  
  // Infinite scroll observer
  const lastPostRef = useCallback((node) => {
    if (loading || !hasMore || initializing) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
          fetchMorePosts();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMorePosts, initializing]);
  
  // Share handler
  const handleShare = async (e, post) => {
    e.stopPropagation();
    const url = `https://www.trendkari.in/feed/${effectiveLocation}/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("लिंक कॉपी हो गया!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };
  
  const getPostContent = (content) => {
    if (!content) return "NO Content";
    if (typeof content === "string") return content;
    if (typeof content === "object" && content.blocks) {
      return content.blocks
        .map(block => {
          if (block.type === "paragraph") {
            return block.data?.text || "";
          }
          if (block.type === "header") {
            return block.data?.text || "";
          }
          return "";
        })
        .join(" ");
    }
    return "NO Content";
  };
  
  // Loading state
  if (initializing && posts.length === 0) {
    return (
      <div className="feed-container loading-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>लोड हो रहा है...</p>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!initializing && posts.length === 0) {
    return (
      <div className="feed-container empty-container">
        <div className="empty-state">
          <p>कोई पोस्ट नहीं मिली</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="feed-container" ref={containerRef}>
      {combinedItems.map((item, index) => {
        if (item.type === 'ad') {
          // Render ad
          const isLast = index === combinedItems.length - 1;
          return (
            <div 
              key={`ad-${item.adId}-${index}`} 
              ref={isLast ? lastPostRef : null}
              className="feed-card-wrapper"
              data-index={index}
              data-active={currentIndex === index}
            >
              <AdCard ad={item.data} index={index} />
            </div>
          );
        } else {
          // Render post
          const post = item.data;
          const isLast = index === combinedItems.length - 1;
          const author = post.author;
          
          return (
            <div 
              key={`${post._id}-${index}`} 
              ref={isLast ? lastPostRef : null}
              className="feed-card"
              data-index={index}
              data-active={currentIndex === index}
            >
              <div className="feed-image-wrapper">
                <img 
                  src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"} 
                  alt={post.title} 
                  className="feed-image" 
                  loading={index < 3 ? "eager" : "lazy"} 
                  onError={(e) => {
                    e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
                  }} 
                />
                <div className="image-overlay" />
                <button className="share-btn" onClick={(e) => handleShare(e, post)} aria-label="Share">
                  🔗
                </button>
              </div>
              <div className="feed-content px-3">
                <div className="feed-meta">
                  {author && (
                    <span className="feed-author">
                      ✍️ {author.name || author.username || "Trendkari Team"}
                    </span>
                  )}
                  <span className="feed-time"> 🕒 {timeAgo(post.createdAt)} </span>
                </div>
                <h3 className="feed-title">{post.title}</h3>
                <div>{getPostContent(post.content)}</div>
              </div>
            </div>
          );
        }
      })}
      {loading && (
        <div className="loader-wrapper">
          <div className="loader">
            <div className="spinner-small"></div>
            <p>लोड हो रहा है...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeFeed;