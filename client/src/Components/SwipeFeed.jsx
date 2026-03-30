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





import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import API from "../../utils/api";
import "../../css/Swipe.css";

const LIMIT = 6;

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

const SwipeFeed = () => {
  const { location: locationParam, slug } = useParams();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [authors, setAuthors] = useState({});
  
  const containerRef = useRef(null);
  const observer = useRef();
  const isScrolling = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (observer.current) observer.current.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Fetch author details
  const fetchAuthorDetails = useCallback(async (authorId) => {
    if (!authorId || authors[authorId]) return authors[authorId];
    
    try {
      const { data } = await API.get(`/user/get-user/${authorId}`);
      if (data?.user) {
        setAuthors(prev => ({ ...prev, [authorId]: data.user }));
        return data.user;
      }
    } catch (err) {
      console.error("Error fetching author:", err);
    }
    return null;
  }, [authors]);

  // Fetch authors for multiple posts
  useEffect(() => {
    const fetchAllAuthors = async () => {
      const uniqueAuthorIds = [...new Set(posts.map(p => p.author).filter(Boolean))];
      for (const authorId of uniqueAuthorIds) {
        if (!authors[authorId]) {
          await fetchAuthorDetails(authorId);
        }
      }
    };
    
    if (posts.length > 0) {
      fetchAllAuthors();
    }
  }, [posts, fetchAuthorDetails, authors]);

  // 🔥 IMPROVED SMOOTH SCROLL TO INDEX
  const goToIndex = useCallback((index, shouldScroll = true) => {
    if (!containerRef.current) return;
    if (index < 0 || index >= posts.length) return;
    
    // Clear any existing scroll timeout
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
    
    // Reset scrolling flag after animation completes
    scrollTimeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [posts.length]);

  // 🔥 HANDLE SCROLL EVENT TO UPDATE CURRENT INDEX
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (isScrolling.current) return;
      
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < posts.length) {
        setCurrentIndex(newIndex);
      }
    };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, posts.length]);

  // 🔥 SINGLE SOURCE OF TRUTH - INITIAL LOAD
  useEffect(() => {
    // Reset everything when route changes
    initialLoadDone.current = false;
    isScrolling.current = false;
    
    const initializeFeed = async () => {
      if (!isMounted.current) return;
      
      setInitializing(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setCurrentIndex(0);
      setAuthors({});
      
      try {
        let feedPosts = [];
        let targetIndex = -1;
        
        // Build query params based on location
        let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
        if (locationParam && locationParam !== "feed") {
          feedUrl += `&location=${locationParam}`;
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
              // Check if post already exists in feed
              const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              
              if (existingIndex === -1) {
                // Insert at top for immediate visibility
                feedPosts = [singlePost, ...feedPosts];
                targetIndex = 0;
              } else {
                targetIndex = existingIndex;
              }
            }
          } catch (err) {
            console.error("Error fetching single post:", err);
          }
        }
        
        if (isMounted.current) {
          setPosts(feedPosts);
          setPage(2);
          
          // IMPORTANT: Wait for DOM to render before scrolling
          if (targetIndex !== -1) {
            setTimeout(() => {
              if (containerRef.current) {
                // Force scroll without animation for initial positioning
                containerRef.current.scrollTo({
                  top: targetIndex * window.innerHeight,
                  behavior: "auto",
                });
                setCurrentIndex(targetIndex);
                
                // Reset scrolling flag after manual scroll
                setTimeout(() => {
                  isScrolling.current = false;
                }, 100);
              }
            }, 200);
          }
          
          initialLoadDone.current = true;
        }
      } catch (err) {
        console.error("Error initializing feed:", err);
      } finally {
        if (isMounted.current) {
          setInitializing(false);
        }
      }
    };
    
    initializeFeed();
  }, [locationParam, slug, location.key]);

  // 🔥 FETCH MORE POSTS (PAGINATION)
  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
    try {
      setLoading(true);
      
      let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
      if (locationParam && locationParam !== "feed") {
        feedUrl += `&location=${locationParam}`;
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
  }, [loading, hasMore, page, initializing, locationParam]);

  // 🔥 TOUCH SWIPE HANDLER
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let touchStart = 0;
    let touchEnd = 0;
    
    const handleTouchStart = (e) => {
      touchStart = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      if (isScrolling.current) return;
      
      touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart - touchEnd;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up - next post
          if (currentIndex + 1 < posts.length) {
            goToIndex(currentIndex + 1, true);
          }
        } else {
          // Swipe down - previous post
          if (currentIndex - 1 >= 0) {
            goToIndex(currentIndex - 1, true);
          }
        }
      }
    };
    
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, posts.length, goToIndex]);

  // 🔥 KEYBOARD SUPPORT (Arrow keys)
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
        if (currentIndex + 1 < posts.length) {
          goToIndex(currentIndex + 1, true);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, posts.length, goToIndex]);

  // 🔥 INFINITE SCROLL OBSERVER
  const lastPostRef = useCallback((node) => {
    if (loading || !hasMore || initializing) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
          fetchMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMorePosts, initializing]);

  // 🔥 SHARE HANDLER
  const handleShare = async (e, post) => {
    e.stopPropagation();
    
    const url = `https://www.trendkari.in/feed/${locationParam || "all"}/${post.slug}`;
    
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

  // 🔥 LOADING STATE
  if (initializing && posts.length === 0) {
    return (
      <div className="feed-container loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="feed-container" ref={containerRef}>
      {posts.map((post, index) => {
        if (!post) return null;
        
        const isLast = index === posts.length - 1;
        const author = authors[post.author];
        
        return (
          <div
            key={`${post._id}-${index}`}
            ref={isLast ? lastPostRef : null}
            className="feed-card"
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
              
              <button
                className="share-btn"
                onClick={(e) => handleShare(e, post)}
                aria-label="Share"
              >
                🔗
              </button>
            </div>
            
            <div className="feed-content px-3">
              <div className="feed-meta">
                {author && (
                  <span className="feed-author">
                    ✍️ {post.author  || "लेखक"}
                  </span>
                )}
                <span className="feed-time">
                  🕒 {timeAgo(post.createdAt)}
                </span>
              </div>
              <h3 className="feed-title">{post.title}</h3>
              <p className="feed-desc">
                {post.description || post.content?.substring(0, 150) || ""}
                {(post.description?.length > 150 || post.content?.length > 150) && "..."}
              </p>
            </div>
          </div>
        );
      })}
      
      {loading && (
        <div className="loader-wrapper">
          <div className="loader">Loading more...</div>
        </div>
      )}
    </div>
  );
};

export default SwipeFeed;