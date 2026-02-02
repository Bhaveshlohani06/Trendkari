// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import Layout from "../Layout/Layout";
// import MiniCard from "../Components/MiniCard";
// import API from "../../utils/api";
// import * as timeago from "timeago.js";
// import { FaHeart, FaShareAlt } from "react-icons/fa";
// import EditorContent from "../Components/EditorContent";

// const BlogDetail = () => {
//   const { slug, location: routeLocation } = useParams();

//   const [post, setPost] = useState(null);
//   const [sameCityPosts, setSameCityPosts] = useState([]);
//   const [otherCityPosts, setOtherCityPosts] = useState([]);
//   const [liked, setLiked] = useState(false);

//   const cities = [
//     { name: "Kota", slug: "kota" },
//     { name: "Ramganjmandi", slug: "ramganjmandi" },
//     { name: "Ladpura", slug: "ladpura" },
//     { name: "Sangod", slug: "sangod" },
//     { name: "Rural Kota", slug: "rural-kota" },
//   ];

//   /* ================= FETCH POST ================= */
//   const fetchPost = async () => {
//     try {
//       const { data } = await API.get(`/post/get-post/${slug}`);
//       if (data?.success) {
//         setPost(data.post);
//         fetchRelatedPosts(data.post);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= FETCH RELATED ================= */
//   const fetchRelatedPosts = async (currentPost) => {
//     try {
//       const { data } = await API.get(`/post/get-posts?language=${currentPost.language || "hi"}`);

//       if (data?.success) {
//         const others = data.posts.filter(p => p._id !== currentPost._id);

//         const sameCity = currentPost.location
//           ? others.filter(p => p.location === currentPost.location).slice(0, 6)
//           : [];

//         const otherCities = others
//           .filter(p => p.location && p.location !== currentPost.location)
//           .slice(0, 8);

//         setSameCityPosts(sameCity);
//         setOtherCityPosts(otherCities);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchPost();
//   }, [slug]);

//   if (!post) {
//     return (
//       <Layout>
//         <div className="container py-5 text-center">Loading article…</div>
//       </Layout>
//     );
//   }

//   /* ================= SHARE ================= */
//   const shareUrl = post.location
//     ? `${window.location.origin}/${post.location}/article/${post.slug}`
//     : `${window.location.origin}/article/${post.slug}`;

//   const handleShare = () => {
//     navigator.share
//       ? navigator.share({ title: post.title, url: shareUrl })
//       : window.open(
//           `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + shareUrl)}`,
//           "_blank"
//         );
//   };

//   return (
//     <Layout>
//       <div className="container py-5">
//         <div className="row">
//           {/* ================= MAIN CONTENT ================= */}
//           <div className="col-md-8">
//             <h1 className="fw-bold mb-3">{post.title}</h1>

//             {/* META BAR */}
//             <div className="text-muted mb-3 small">
//               {post.location && (
//                 <>
//                   <Link to={`/city/${post.location}`} className="text-decoration-none">
//                     📍 {post.location.replace("-", " ")}
//                   </Link>{" "}
//                   •{" "}
//                 </>
//               )}

//               {post.category && (
//                 <>
//                   <Link to={`/category/${post.category.slug}`} className="text-decoration-none">
//                     {post.category.name}
//                   </Link>{" "}
//                   •{" "}
//                 </>
//               )}

//               <span>{post.language === "hi" ? "हिंदी" : "English"}</span> •{" "}
//               {post.author?.name || "Trendkari"} • {timeago.format(post.createdAt)}
//             </div>

//             {/* IMAGE */}
//             {post.image && (
//               <img src={post.image} alt={post.title} className="img-fluid rounded mb-4" />
//             )}

//             {/* CONTENT */}
//             <EditorContent content={post.content} />


//             {/* ACTIONS */}
//             <div className="d-flex gap-4 mb-5 text-muted">
//               <FaHeart
//                 onClick={() => setLiked(!liked)}
//                 style={{ cursor: "pointer", color: liked ? "red" : "gray" }}
//               />
//               <FaShareAlt onClick={handleShare} style={{ cursor: "pointer" }} />
//             </div>

//             {/* ================= SAME CITY ================= */}
//             {sameCityPosts.length > 0 && (
//               <>
//                 <h4 className="mb-3">
//                   More from {post.location.replace("-", " ")}
//                 </h4>
//                 <div className="row">
//                   {sameCityPosts.map(p => (
//                     <div className="col-md-6 mb-3" key={p._id}>
//                       <MiniCard post={p} />
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* ================= OTHER CITIES ================= */}
//             {otherCityPosts.length > 0 && (
//               <>
//                 <h4 className="mt-5 mb-3">Trending Across Other Cities</h4>
//                 <div className="row">
//                   {otherCityPosts.map(p => (
//                     <div className="col-md-6 mb-3" key={p._id}>
//                       <MiniCard post={p} />
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>

//           {/* ================= SIDEBAR ================= */}
//           <div className="col-md-4">
//             <h6 className="text-muted mb-3">Explore Cities</h6>
//             <div className="d-flex flex-wrap gap-3">
//               {cities
//                 .filter(city => city.slug !== post.location)
//                 .map(city => (
//                   <Link
//                     key={city.slug}
//                     to={`/city/${city.slug}`}
//                     className="text-decoration-none text-secondary fw-medium"
//                   >
//                     {city.name}
//                   </Link>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default BlogDetail;









// import { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import Layout from "../Layout/Layout";
// import API from "../../utils/api";
// import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
// import { useAuth } from "../context/auth";
// import MiniCard from "../Components/MiniCard";
// import EditorContent from "../Components/EditorContent";
// import { toast } from "react-hot-toast";

// const RELATED_LIMIT = 6;

// export default function BlogDetail() {
//   const { slug } = useParams();
//   const [auth] = useAuth();

//   const [post, setPost] = useState(null);
//   const [liked, setLiked] = useState(false);
//   const [likes, setLikes] = useState(0);

//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");

//   const [related, setRelated] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const observer = useRef();

//   /* ================= POST ================= */
//   useEffect(() => {
//     (async () => {
//       const { data } = await API.get(`/post/get-post/${slug}`);
//       if (data?.success) {
//         setPost(data.post);
//         setLikes(data.post.likes.length);
//         setLiked(data.post.likes.includes(auth?.user?._id));
//       }
//     })();
//   }, [slug, auth?.user?._id]);

//   /* ================= COMMENTS ================= */
//   const fetchComments = async () => {
//     const { data } = await API.get(`/posts/${slug}/comments`);
//     if (data?.success) setComments(data.comments);
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [slug]);

//   const submitComment = async (e) => {
//     e.preventDefault();
//     if (!auth?.user) return toast.error("Login required");

//     const { data } = await API.post(`/posts/${slug}/comments`, {
//       content: commentText,
//     });

//     if (data?.success) {
//       setComments(prev => [data.comment, ...prev]);
//       setCommentText("");
//     }
//   };

//   /* ================= LIKE ================= */
//   const toggleLike = async () => {
//     if (!auth?.user) return toast.error("Login required");

//     const method = liked ? "delete" : "post";
//     await API[method](`/post/${post._id}/like`);

//     setLiked(!liked);
//     setLikes(prev => liked ? prev - 1 : prev + 1);
//   };

//   /* ================= SHARE ================= */
//   const sharePost = () => {
//     const url = window.location.href;
//     navigator.share
//       ? navigator.share({ title: post.title, url })
//       : window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
//   };

//   /* ================= RELATED POSTS (INFINITE) ================= */
//   const fetchRelated = async () => {
//     if (!hasMore) return;

//     const { data } = await API.get(
//       `/post/get-posts?status=approved&page=${page}&limit=${RELATED_LIMIT}`
//     );

//     if (data?.success) {
//       setRelated(prev => [...prev, ...data.posts]);
//       setHasMore(data.hasMore);
//     }
//   };

//   useEffect(() => {
//     fetchRelated();
//   }, [page]);

//   const lastPostRef = useCallback(node => {
//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(p => p + 1);
//       }
//     });

//     if (node) observer.current.observe(node);
//   }, [hasMore]);

//   if (!post) return null;

//   return (
//     <Layout title={post.title}>
//       <div className="container py-4 row mx-auto">
//         {/* MAIN */}
//         <div className="col-lg-8">
//           <h1 className="fw-bold">{post.title}</h1>
//           {/* META */}
//           <div className="text-muted mb-3 small">
//             {post.location && (

//               <>
//                 <Link to={`/${post.location}/articles`} className="text-decoration-none">

                


//                   📍 {post.location}
//                 </Link>{" "}•{" "}
//               </>
//             )}    
//             {post.category && (
//               <>
//                 <Link to={`/category/${post.category.slug}`} className="text-decoration-none">
//                   {post.category.name}
//                 </Link>{" "}•{" "}
//               </>
//             )}
//             <span>{post.language === "hi" ? "हिंदी" : "English"}</span> •{" "}
//             {post.author?.name || "Trendkari"} • {new Date(post.createdAt).toLocaleDateString()}
//           </div>
//           {/* IMAGE */}
//           {post.image && (
//             <img src={post.image} alt={post.title} className="img-fluid rounded mb-4" />
//           )}
//           {/* CONTENT */}


//           <EditorContent content={post.content} />

//           {/* ACTIONS */}
//           <div className="d-flex gap-4 my-4">
//             <button onClick={toggleLike} className="btn btn-link p-0">
//               {liked ? <FaHeart color="red" /> : <FaRegHeart />} {likes}
//             </button>

//             <button onClick={sharePost} className="btn btn-link p-0">
//               <FaShareAlt /> Share
//             </button>
//           </div>

//           {/* COMMENTS */}
//           <h5>Comments ({comments.length})</h5>

//           {auth?.user && (
//             <form onSubmit={submitComment} className="mb-3">
//               <textarea
//                 className="form-control"
//                 value={commentText}
//                 onChange={e => setCommentText(e.target.value)}
//                 placeholder="Write a comment…"
//                 required
//               />
//               <button className="btn btn-primary mt-2">Post</button>
//             </form>
//           )}

//           {comments.map(c => (
//             <div key={c._id} className="border rounded p-2 mb-2">
//               <Link to={`/dashboard/user/profile/${c.author._id}`}>
//                 <strong>{c.author.name}</strong>
//               </Link>
//               <p className="mb-0">{c.content}</p>
//             </div>
//           ))}
//         </div>

//         {/* SIDEBAR */}
//         <div className="col-lg-4">
//           <h5>Related Posts</h5>

//           {related.map((p, i) => (
//             <div
//               key={p._id}
//               ref={i === related.length - 1 ? lastPostRef : null}
//             >
//               <MiniCard post={p} />
//             </div>
//           ))}

//           {!hasMore && <p className="text-muted text-center">No more posts</p>}
//         </div>
//       </div>
//     </Layout>
//   );
// }



// import { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import Layout from "../Layout/Layout";
// import API from "../../utils/api";
// import { FaShareAlt, FaArrowRight, FaComments } from "react-icons/fa";
// import { useAuth } from "../context/auth";
// import MiniCard from "../Components/MiniCard";
// import EditorContent from "../Components/EditorContent";
// import LikeButton from "../Components/LikeButton";
// import { toast } from "react-hot-toast";
// import "../../css/BlogDetail.css";

// const RELATED_LIMIT = 4;
// const SUGGESTED_USERS_LIMIT = 9;

// /* ================= SAFE AVATAR ================= */
// const SafeAvatar = ({ src, alt, size = 40 }) => (
//   <img
//     src={src && src.startsWith("http") ? src : "/avatar.png"}
//     alt={alt}
//     width={size}
//     height={size}
//     className="rounded-circle"
//     loading="lazy"
//     onError={(e) => (e.target.src = "/avatar.png")}
//     style={{ objectFit: "cover" }}
//   />
// );

// export default function BlogDetail() {
//   const { slug } = useParams();
//   const [auth] = useAuth();

//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [comments, setComments] = useState([]);
//   const [commentText, setCommentText] = useState("");
//   const [postingComment, setPostingComment] = useState(false);

//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingRelated, setLoadingRelated] = useState(false);

//   const [suggestedUsers, setSuggestedUsers] = useState([]);
//   const [following, setFollowing] = useState({});

//   const observer = useRef(null);
//   const commentInputRef = useRef(null);

//   /* ================= FETCH POST ================= */
//   useEffect(() => {
//     const fetchPost = async () => {
//       setLoading(true);
//       try {
//         const { data } = await API.get(`/post/get-post/${slug}`);
//         if (data?.success) setPost(data.post);
//       } catch {
//         toast.error("Failed to load post");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [slug]);

//   /* ================= COMMENTS ================= */
//   useEffect(() => {
//     if (!post) return;
//     API.get(`/posts/${slug}/comments`).then(({ data }) => {
//       if (data?.success) setComments(data.comments);
//     });
//   }, [post, slug]);

// const fetchComments = async () => {
//   try {
//     const { data } = await API.get(`/posts/${post._id}/comments`);
//     if (data?.success) {
//       setComments(data.comments);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };


// useEffect(() => {
//   if (!post?._id) return;
//   fetchComments();
// }, [post?._id]);


// const submitComment = async (e) => {
//   e.preventDefault();

//   if (!auth?.user) {
//     toast.error("Login to comment");
//     return;
//   }

//   if (!commentText.trim()) return;

//   setPostingComment(true);

//   try {
//     const { data } = await API.post(
//       `/posts/${post._id}/comments`,
//       { content: commentText.trim() }
//     );

//     if (data?.success) {
//       setCommentText("");
//       await fetchComments(); // 🔥 guaranteed sync
//       toast.success("Comment added");
//     }
//   } catch {
//     toast.error("Failed to post comment");
//   } finally {
//     setPostingComment(false);
//   }
// };


//   /* ================= RELATED POSTS ================= */
//   const fetchRelatedPosts = async (pageNum) => {
//     if (!post || loadingRelated || !hasMore) return;
//     setLoadingRelated(true);
//     try {
//       const { data } = await API.get(
//         `/post/get-posts`
//       );
//       if (data?.success) {
//         setRelatedPosts((prev) => [...prev, ...data.posts]);
//         setHasMore(data.hasMore);
//       }
//     } finally {
//       setLoadingRelated(false);
//     }
//   };

//   useEffect(() => {
//     if (!post) return;
//     setRelatedPosts([]);
//     setPage(1);
//     setHasMore(true);
//     fetchRelatedPosts(1);
//   }, [post?._id]);

//   const lastPostRef = useCallback(
//     (node) => {
//       if (loadingRelated) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           fetchRelatedPosts(nextPage);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loadingRelated, hasMore, page]
//   );

//   /* ================= SUGGESTED USERS ================= */
//   useEffect(() => {
//     if (!auth?.user) return;
//     API.get(`/user/suggested?limit=${SUGGESTED_USERS_LIMIT}`).then(({ data }) => {
//       if (data?.success) {
//         setSuggestedUsers(data.users);
//         const map = {};
//         data.users.forEach((u) => {
//           map[u._id] = u.followers?.includes(auth.user._id);
//         });
//         setFollowing(map);
//       }
//     });
//   }, [auth]);

//   const toggleFollow = async (id) => {
//     if (!auth?.user) return toast.error("Login to follow");
//     const isFollowing = following[id];
//     await API[isFollowing ? "delete" : "post"](`/user/${id}/follow`);
//     setFollowing({ ...following, [id]: !isFollowing });
//   };

//   /* ================= SHARE ================= */
//   const sharePost = () => {
//     const url = window.location.href;
//     if (navigator.share) {
//       navigator.share({ title: post.title, url });
//     } else {
//       navigator.clipboard.writeText(url);
//       toast.success("Link copied");
//     }
//   };

//   if (loading) {
//     return <Layout title="Loading..." />;
//   }

//   if (!post) {
//     return (
//       <Layout title="Not Found">
//         <div className="container py-5 text-center">
//           <h3>Post not found</h3>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title={post.title}>
//       <div className="container py-4">
//         {/* ================= BREADCRUMB ================= */}
//         <nav className="breadcrumb mb-4">
//           <Link to="/">Home</Link>
//           {post.category && (
//             <>
//               <span>/</span>
//               <Link to={`/category/${post.category.slug}`}>
//                 {post.category.name}
//               </Link>
//             </>
//           )}
//           <span>/</span>
//           <span className="text-muted">{post.title}</span>
//         </nav>

//         <div className="row g-4">
//           {/* ================= MAIN ================= */}
//           <div className="col-lg-8">
//             <h1 className="fw-bold mb-3">{post.title}</h1>

//             <div className="d-flex align-items-center gap-3 mb-4">
//               <SafeAvatar src={post.author?.avatar} alt={post.author?.name} />
//               <div>
//                 <Link to={`/dashboard/user/profile/${post.author?._id}`}>
//                   <strong>{post.author?.name}</strong>
//                 </Link>
//                 <div className="text-muted small">
//                   {new Date(post.createdAt).toDateString()}
//                   {post.location && ` • ${post.location}`}
//                 </div>
//               </div>
//             </div>

//             {post.image && (
//               <img
//                 src={post.image}
//                 alt={post.title}
//                 className="img-fluid rounded mb-4 shadow-sm"
//               />
//             )}

//             <EditorContent content={post.content} />

//             {/* ================= ACTIONS ================= */}
//             <div className="d-flex justify-content-between border-top border-bottom py-3 my-4">
//               <LikeButton
//                 postId={post._id}
//                 initialLiked={post.likes?.includes(auth?.user?._id)}
//                 initialCount={post.likes?.length}
//               />
//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={() => commentInputRef.current?.focus()}
//               >
//                 <FaComments /> Comment
//               </button>
//               <button className="btn btn-outline-primary" onClick={sharePost}>
//                 <FaShareAlt /> Share
//               </button>
//             </div>

//             {/* ================= COMMENTS ================= */}
      
// {/* ================= COMMENTS ================= */}
// <div className="comments-section mt-5">
//   <h5 className="fw-bold mb-3">
//     Comments <span className="text-muted">({comments.length})</span>
//   </h5>

//   {/* Comment box */}
//   {auth?.user ? (
//     <form onSubmit={submitComment} className="comment-box mb-4">
//       <div className="d-flex gap-3">
//         <SafeAvatar src={auth.user.avatar} />
//         <div className="flex-grow-1">
//           <textarea
//             ref={commentInputRef}
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             className="form-control"
//             placeholder="Write a thoughtful comment…"
//             rows={2}
//           />
//           <div className="text-end mt-2">
//             <button
//               className="btn btn-primary btn-sm"
//               disabled={postingComment}
//             >
//               {postingComment ? "Posting…" : "Post"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   ) : (
//     <p className="text-muted">
//       <Link to="/login">Login</Link> to join the discussion
//     </p>
//   )}

//   {/* Comments list */}
//   {comments.length === 0 ? (
//     <p className="text-muted">Be the first to comment.</p>
//   ) : (
//     comments.map((c) => (
//       <div key={c._id} className="comment-item mb-3">
//         <div className="d-flex gap-3">
//           <SafeAvatar src={c.author?.avatar} size={36} />
//           <div className="flex-grow-1">
//             <div className="d-flex justify-content-between">
//               <strong>{c.author?.name || "User"}</strong>
//               <small className="text-muted">
//                 {new Date(c.createdAt).toLocaleDateString()}
//               </small>
//             </div>
//             <p className="mb-0">{c.content}</p>
//           </div>
//         </div>
//       </div>
//     ))
//   )}
// </div>

          
//           </div>

//           {/* ================= SIDEBAR ================= */}
//           <div className="col-lg-4">
//             <div className="sticky-top" style={{ top: 80 }}>
//               {/* Suggested Users */}
// {suggestedUsers.length > 0 && (
//   <div className="card mb-4 shadow-sm border-0">
//     <div className="card-body pb-2">

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h6 className="mb-0 fw-bold">Suggested Writers</h6>
//         <Link
//           to="/users"
//           className="text-decoration-none small fw-semibold"
//         >
//           See all →
//         </Link>
//       </div>

//       {/* Carousel */}
//       <div className="suggested-carousel d-flex gap-3 overflow-auto pb-2">

//         {/* User cards */}
//         {suggestedUsers.map((u) => (
//           <div
//             key={u._id}
//             className="suggested-card text-center flex-shrink-0"
//           >
//             <SafeAvatar src={u.avatar} size={56} />

//             <div className="mt-2 fw-semibold text-truncate px-1">
//               {u.name}
//             </div>

//             <button
//               className={`btn btn-sm mt-2 w-100 ${
//                 following[u._id]
//                   ? "btn-outline-secondary"
//                   : "btn-primary"
//               }`}
//               onClick={() => toggleFollow(u._id)}
//             >
//               {following[u._id] ? "Following" : "Follow"}
//             </button>
//           </div>
//         ))}

//         {/* MORE USERS CARD */}
//         <Link
//           to="/users"
//           className="suggested-card see-all-card text-decoration-none flex-shrink-0"
//         >
//           <div className="see-all-inner">
//             <span className="see-all-arrow">→</span>
//             <div className="fw-bold mt-1 text-primary text-center">
//               View all
//             </div>
//           </div>
//         </Link>

//       </div>
//     </div>
//   </div>
// )}



//               {/* Related Posts */}
//               <div className="card shadow-sm">
//                 <div className="card-body">
//                   <h6 className="mb-3">Related Posts</h6>
//                   {relatedPosts.map((rp, i) => (
//                     <div
//                       key={rp._id}
//                       ref={i === relatedPosts.length - 1 ? lastPostRef : null}
//                       className="mb-3"
//                     >
//                       <MiniCard post={rp} compact />
//                     </div>
//                   ))}
//                   {loadingRelated && <div className="text-center">Loading...</div>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </Layout>
//   );
// }






import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import API from "../../utils/api";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Image,
  Form,
  Dropdown,
  ProgressBar,
  Spinner,
  Placeholder,
  Navbar,
  Nav
} from "react-bootstrap";
import { 
  FaShareAlt, 
  FaComments, 
  FaHeart, 
  FaBookmark, 
  FaMapMarkerAlt, 
  FaClock,
  FaUser,
  FaEllipsisH,
  FaChevronRight,
  FaFire,
  FaArrowLeft,
  FaFilter,
  FaEye,
  FaBookOpen,
  FaChevronDown
} from "react-icons/fa";
import { useAuth } from "../context/auth";
import MiniCard from "../Components/MiniCard";
import EditorContent from "../Components/EditorContent";
import LikeButton from "../Components/LikeButton";
import { toast } from "react-hot-toast";
import "../../css/BlogDetail.css";

const RELATED_LIMIT = 10;
const SUGGESTED_USERS_LIMIT = 6;

/* ================= CUSTOM HOOKS ================= */

const useStickyHeader = (offset = 100) => {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => {
      setHeaderHeight(header.offsetHeight);
    };

    const handleScroll = () => {
      setIsSticky(window.scrollY > offset);
    };

    updateHeight();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, [offset]);

  return { headerRef, isSticky, headerHeight };
};

const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      
      const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      setScrollProgress(progress);
      
      setShowProgressBar(progress > 10 && progress < 95);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollProgress, showProgressBar };
};

/* ================= COMPONENTS ================= */

// const StickyHeader = ({ 
//   post, 
//   categories = [], 
//   onLocationChange,
//   onCategorySelect,
//   isSticky,
//   headerHeight 
// }) => {
//   const [localCategories, setLocalCategories] = useState([]);

//   useEffect(() => {
//     if (categories.length === 0) {
//       API.get('/categories').then(({ data }) => {
//         if (data?.success) setLocalCategories(data.categories);
//       });
//     }
//   }, [categories]);

//   const displayCategories = categories.length > 0 ? categories : localCategories;

//   return (
//     <Navbar 
//       bg="white" 
//       expand="lg" 
//       className={`border-bottom shadow-sm transition-all ${isSticky ? 'sticky-top' : ''}`}
//       style={{
//         top: 0,
//         zIndex: 1020,
//         marginBottom: isSticky ? `${headerHeight}px` : '0',
//         transition: 'all 0.3s ease'
//       }}
//     >
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
//           <FaArrowLeft className="me-2" />
//           Back
//         </Navbar.Brand>

//         <Nav className="ms-auto">
//           <Dropdown className="me-3">
//             <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-pill">
//               <FaMapMarkerAlt className="me-1" />
//               {post?.location || "Nearby"}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => onLocationChange("area")}>
//                 <span className="me-2">📍</span> My Area
//               </Dropdown.Item>
//               <Dropdown.Item onClick={() => onLocationChange("city")}>
//                 <span className="me-2">🏙️</span> City Level
//               </Dropdown.Item>
//               <Dropdown.Item onClick={() => onLocationChange("district")}>
//                 <span className="me-2">🗺️</span> District
//               </Dropdown.Item>
//               <Dropdown.Item onClick={() => onLocationChange("state")}>
//                 <span className="me-2">🌍</span> State
//               </Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>

//           <Button variant="outline-secondary" size="sm" className="me-2 rounded-pill">
//             <FaShareAlt />
//           </Button>

//           <Dropdown className="d-lg-none">
//             <Dropdown.Toggle variant="outline-secondary" size="sm">
//               <FaEllipsisH />
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Header>Categories</Dropdown.Header>
//               {displayCategories.slice(0, 5).map((cat) => (
//                 <Dropdown.Item key={cat._id || cat} onClick={() => onCategorySelect(cat)}>
//                   {cat.name || cat}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };

const SmartFeedSection = ({ 
  posts, 
  title, 
  subtitle,
  loading,
  onLoadMore,
  hasMore
}) => {
  if (!posts.length && !loading) return null;

  return (
    <section className="smart-feed-section mt-5 py-4 border-top">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            <FaFire className="me-2 text-warning" />
            {title}
          </h4>
          {subtitle && (
            <p className="text-muted mb-0">{subtitle}</p>
          )}
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" size="sm" className="rounded-pill">
            <FaFilter className="me-1" />
            Sort
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Trending</Dropdown.Item>
            <Dropdown.Item>Latest</Dropdown.Item>
            <Dropdown.Item>Most Discussed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Row className="g-4">
        {posts.map((post) => (
          <Col md={6} lg={4} key={post._id}>
            <Card className="h-100 border-0 shadow-sm hover-lift">
              <Link to={`/post/${post.slug}`} className="text-decoration-none text-dark">
                {post.image && (
                  <Card.Img 
                    variant="top" 
                    src={post.image} 
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="light" text="dark">
                      {post.category?.name || "General"}
                    </Badge>
                    <small className="text-muted">
                      <FaClock className="me-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <Card.Title className="fs-6 fw-bold mb-2 line-clamp-2">
                    {post.title}
                  </Card.Title>
                  <div className="d-flex align-items-center text-muted small">
                    <FaMapMarkerAlt className="me-1" />
                    <span className="text-truncate">{post.location || "Nearby"}</span>
                  </div>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" variant="primary" />
          <span className="ms-2 text-muted">Loading more stories...</span>
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <Button 
            variant="outline-primary" 
            onClick={onLoadMore}
            className="rounded-pill px-4"
          >
            Load More Stories
          </Button>
        </div>
      )}
    </section>
  );
};

const ReadingProgressBar = ({ progress, show }) => {
  if (!show) return null;

  return (
    <div className="reading-progress-container">
      <ProgressBar 
        now={progress} 
        className="rounded-0" 
        style={{ 
          height: '3px',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

const FloatingActions = ({ postId, onCommentClick, onShare, onSave, isSaved }) => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY.current || currentScrollY < 100);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="floating-actions">
      <div className="d-flex align-items-center bg-white rounded-pill shadow-lg px-3 py-2">
        <LikeButton postId={postId} compact />
        <Button variant="link" className="text-dark" onClick={onCommentClick}>
          <FaComments size={20} />
        </Button>
        <Button 
          variant="link" 
          className={isSaved ? 'text-warning' : 'text-dark'}
          onClick={onSave}
        >
          <FaBookmark size={20} />
        </Button>
        <Button variant="link" className="text-dark" onClick={onShare}>
          <FaShareAlt size={20} />
        </Button>
        
        <div className="ms-3" style={{ width: '80px' }}>
          <div className="small text-muted mb-1">Reading</div>
          <ProgressBar now={60} style={{ height: '3px' }} />
        </div>
      </div>
    </div>
  );
};

const LocationSelector = ({ currentLocation, onLocationChange }) => {
  const locations = [
    { level: "area", label: "My Area", icon: "📍" },
    { level: "city", label: "City", icon: "🏙️" },
    { level: "district", label: "District", icon: "🗺️" },
    { level: "state", label: "State", icon: "🌍" }
  ];

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-pill">
        <FaMapMarkerAlt className="me-2" />
        {locations.find(l => l.level === currentLocation)?.label || "Select Location"}
        <FaChevronDown className="ms-2" size={12} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {locations.map((loc) => (
          <Dropdown.Item 
            key={loc.level}
            active={currentLocation === loc.level}
            onClick={() => onLocationChange(loc.level)}
          >
            <span className="me-2">{loc.icon}</span>
            {loc.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

/* ================= SAFE AVATAR ================= */
const SafeAvatar = ({ src, alt, size = 40 }) => (
  <Image
    src={src && src.startsWith("http") ? src : "/avatar.png"}
    alt={alt}
    roundedCircle
    width={size}
    height={size}
    className="border object-fit-cover"
    onError={(e) => (e.target.src = "/avatar.png")}
  />
);

/* ================= MAIN COMPONENT ================= */
export default function BlogDetail() {
  const { slug } = useParams();
  const [auth] = useAuth();

  // Core states
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [smartFeedPosts, setSmartFeedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [following, setFollowing] = useState({});
const [followLoading, setFollowLoading] = useState({});

  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("area");
  const [isSaved, setIsSaved] = useState(false);
  
  // Refs
  const commentInputRef = useRef(null);
  const commentsRef = useRef(null);
  const observer = useRef(null);
  
  // Custom hooks
  const { headerRef, isSticky, headerHeight } = useStickyHeader();
  const { scrollProgress, showProgressBar } = useScrollProgress();

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/post/get-post/${slug}`);
        if (data?.success) {
          setPost(data.post);
        }
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  /* ================= COMMENTS ================= */
//   const fetchComments = async () => {
//     try {
//       const { data } = await API.get(`/posts/${post.slug}/comments`);
//       if (data?.success) {
//         setComments(data.comments);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

// useEffect(() => {
//   if (!post?.slug) return; 
//   fetchComments();
// }, [post?.slug]);



// const fetchComments = async () => {
//   if (!post?.slug) return;
//   try {
//     const { data } = await API.get(`/comment/posts/${post.slug}/comments`);

//             console.log("COMMENTS RESPONSE:", data); // 🔥 DEBUG


//     if (data?.success) setComments(data.comments);


//   } catch (err) {
//     console.error("Failed to fetch comments:", err);
//   }
// };

const fetchComments = async () => {
  if (!post?.slug) return;

  try {
    const { data } = await API.get(
      `/comment/posts/${post.slug}/comments`
    );

    console.log("🔥 COMMENTS FROM API:", data);


        setComments(Array.isArray(data.items) ? data.items : []);


  } catch (err) {
    console.error("Fetch comments error:", err);
  }
};



useEffect(() => {
  fetchComments();
}, [post?.slug]);



const submitComment = async (e) => {
  e.preventDefault();

  if (!auth?.user) {
    toast.error("Login to comment");
    return;
  }

  if (!commentText.trim()) return;

  setPostingComment(true);

  try {
    const { data } = await API.post(
      `/comment/posts/${post.slug}/comments`,
      { content: commentText.trim() }
    );

    if (data?.success) {
      setCommentText("");
      setComments((prev) => [data.comment, ...prev]); // ⚡ instant UI
      toast.success("Comment added");
    }

  } catch (err) {
    toast.error("Failed to post comment");
  } finally {
    setPostingComment(false);
  }
};

  /* ================= RELATED & SUGGESTED POSTS ================= */
  const fetchRelatedPosts = async (pageNum) => {
    if (!post || loadingRelated || !hasMore) return;
    setLoadingRelated(true);
    try {
      const { data } = await API.get(
        `/post/get-posts?page=${pageNum}&limit=${RELATED_LIMIT}`
      );
      if (data?.success) {
        if (pageNum === 1) {
          setRelatedPosts(data.posts);
          // Filter out current post and take first 6 for smart feed
          const filteredPosts = data.posts.filter(p => p._id !== post._id).slice(0, 6);
          setSmartFeedPosts(filteredPosts);
        } else {
          setRelatedPosts(prev => [...prev, ...data.posts]);
          // Add more posts to smart feed (skip first 6 already shown)
          const newPosts = data.posts.filter(p => p._id !== post._id).slice(0, 3);
          setSmartFeedPosts(prev => [...prev, ...newPosts]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Failed to load related posts:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  // Load initial related posts and categories
  useEffect(() => {
    if (!post) return;
    
    // Reset states
    setRelatedPosts([]);
    setSmartFeedPosts([]);
    setPage(1);
    setHasMore(true);
    
    // Fetch related posts
    fetchRelatedPosts(1);
    
    // Fetch categories
    API.get('/category/categories').then(({ data }) => {
      if (data?.success) setCategories(data.categories);
    });
  }, [post?._id]);

  // Intersection observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (loadingRelated) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchRelatedPosts(nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingRelated, hasMore, page]
  );

  /* ================= SUGGESTED USERS ================= */
  useEffect(() => {
    if (!auth?.user) return;
    API.get(`/user/suggested?limit=${SUGGESTED_USERS_LIMIT}`).then(({ data }) => {
      if (data?.success) {
        setSuggestedUsers(data.users);
        const map = {};
        data.users.forEach((u) => {
          map[u._id] = u.followers?.includes(auth.user._id);
        });
        setFollowing(map);
      }
    });
  }, [auth]);


 const toggleFollow = async (userId) => {
  if (!auth?.user) {
    toast.error("Login to follow");
    return;
  }

  if (followLoading[userId]) return;

  const isFollowing = !!following[userId];

  try {
    setFollowLoading((prev) => ({ ...prev, [userId]: true }));

    if (isFollowing) {
      // UNFOLLOW
      await API.post(`/user/${userId}/unfollow`);
    } else {
      // FOLLOW
      await API.post(`/user/${userId}/follow`);
    }

    setFollowing((prev) => ({
      ...prev,
      [userId]: !isFollowing,
    }));

    toast.success(isFollowing ? "Unfollowed" : "Following");
  } catch (err) {
    toast.error("Failed to update follow status");
  } finally {
    setFollowLoading((prev) => ({ ...prev, [userId]: false }));
  }
};



  /* ================= LOCATION HANDLER ================= */
  const handleLocationChange = async (level) => {
    setSelectedLocation(level);
    setPage(1);
    setRelatedPosts([]);
    setSmartFeedPosts([]);
    
    try {
      const params = {
        page: 1,
        limit: RELATED_LIMIT,
        locationLevel: level,
        ...(post?.category && { category: post.category._id }),
        exclude: post?._id
      };

      const { data } = await API.get(`/post/get-posts`, { params });
      if (data?.success) {
        setRelatedPosts(data.posts);
        setSmartFeedPosts(data.posts.slice(0, 6));
        setHasMore(data.hasMore);
      }
    } catch (error) {
      toast.error("Failed to update location feed");
    }
  };

  /* ================= CATEGORY HANDLER ================= */
  const handleCategorySelect = async (category) => {
    setPage(1);
    setRelatedPosts([]);
    setSmartFeedPosts([]);
    
    try {
      const params = {
        page: 1,
        limit: RELATED_LIMIT,
        category: category._id,
        ...(post?.location && { location: post.location }),
        exclude: post?._id
      };

      const { data } = await API.get(`/post/get-posts`, { params });
      if (data?.success) {
        setRelatedPosts(data.posts);
        setSmartFeedPosts(data.posts.slice(0, 6));
        setHasMore(data.hasMore);
      }
    } catch (error) {
      toast.error("Failed to load category posts");
    }
  };

  /* ================= ENGAGEMENT HANDLERS ================= */
  const sharePost = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const handleSave = async () => {
    if (!auth?.user) {
      toast.error("Login to save articles");
      return;
    }

    try {
      if (isSaved) {
        await API.delete(`/post/${post._id}/save`);
        toast.success("Removed from saved");
      } else {
        await API.post(`/post/${post._id}/save`);
        toast.success("Saved for later");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Failed to update save status");
    }
  };

  const scrollToComments = () => {
    setTimeout(() => {
      commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  /* ================= LOAD MORE HANDLER ================= */
  const handleLoadMore = () => {
    if (!loadingRelated && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRelatedPosts(nextPage);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <Layout title="Loading...">
        <Container className="py-4">
          <Placeholder as="div" animation="wave">
            <Placeholder xs={12} className="mb-4" style={{ height: '40px' }} />
            <Placeholder xs={12} md={8} className="mb-4" style={{ height: '300px' }} />
            <Row>
              <Col md={8}>
                <Placeholder xs={12} style={{ height: '200px' }} />
              </Col>
              <Col md={4}>
                <Placeholder xs={12} style={{ height: '400px' }} />
              </Col>
            </Row>
          </Placeholder>
        </Container>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout title="Not Found">
        <Container className="py-5 text-center">
          <h3>Post not found</h3>
          <p className="text-muted mb-4">This post may have been removed or doesn't exist.</p>
          <Button as={Link} to="/" variant="primary" className="rounded-pill px-4">
            Browse Trending
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title={post.title}>
      {/* Reading Progress Bar */}
      <ReadingProgressBar progress={scrollProgress} show={showProgressBar} />

      {/* Sticky Header */}
      {/* <StickyHeader
        ref={headerRef}
        post={post}
        categories={categories}
        onLocationChange={handleLocationChange}
        onCategorySelect={handleCategorySelect}
        isSticky={isSticky}
        headerHeight={headerHeight}
      /> */}

      <Container className="py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                <FaArrowLeft className="me-1" />
                Home
              </Link>
            </li>
            {post.category && (
              <li className="breadcrumb-item">
                <Link to={`/category/${post.category.slug}`} className="text-decoration-none">
                  {post.category.name}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {post.title.substring(0, 30)}...
            </li>
          </ol>
        </nav>

        <Row className="g-4">
          {/* Main Content */}
          <Col lg={8}>
            {/* Article Header */}
            <div className="mb-4">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {post.category && (
                  <Badge bg="primary" pill className="px-3 py-2">
                    {post.category.name}
                  </Badge>
                )}
                <Badge bg="light" text="dark" pill className="px-3 py-2">
                  <FaMapMarkerAlt className="me-1" />
                  {post.location || "Nearby"}
                </Badge>
                <Badge bg="light" text="dark" pill className="px-3 py-2">
                  <FaClock className="me-1" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </Badge>
                {/* <Badge bg="warning" pill className="px-3 py-2 ms-auto">
                  <FaEye className="me-1" />
                  {post.views || "0"} views
                </Badge> */}
              </div>

              <h1 className="display-5 fw-bold mb-4">{post.title}</h1>

              {/* Author Info */}
           <div className="d-flex align-items-start gap-3 mb-4 p-3 bg-light rounded-3">
  <SafeAvatar
    src={post.author?.avatar}
    alt={post.author?.name}
    size={9}
  />

  <div className="flex-grow-1">
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
      <div>
        <Link
          to={`/dashboard/user/profile/${post.author?._id}`}
          className="fw-bold text-decoration-none text-dark"
        >
          {post.author?.name}
        </Link>

        <div className="small text-muted mt-1">
          {new Date(post.createdAt).toDateString()}
          {post.location && ` • ${post.location}`}
        </div>

        {/* Category */}
        {/* {post.category && (
          <span className="badge bg-primary-subtle text-primary mt-2">
            {post.category}
          </span>
        )} */}
      </div>

      {/* Follow Button */}
      {post.author?._id !== auth?.user?._id && (
  <Button
    variant={following[post.author?._id] ? "outline-secondary" : "primary"}
    size="sm"
    className="rounded-pill px-3"
    disabled={followLoading[post.author?._id]}
    onClick={() => toggleFollow(post.author?._id)}
  >
    {followLoading[post.author?._id]
      ? "Please wait..."
      : following[post.author?._id]
      ? "Following"
      : "+ Follow"}
  </Button>
)}

    </div>
  </div>

</div>



            </div>

            {/* Hero Image */}
            {post.image && (
              <div className="mb-5">
                <Image
                  src={post.image}
                  alt={post.title}
                  fluid
                  className="rounded-3 shadow"
                  style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="article-content mb-5">
              <EditorContent content={post.content} />
            </div>

            {/* Inline CTA */}
            {/* <Card className="mb-5 border-primary bg-gradient-light">
              <Card.Body className="text-center py-4">
                <FaBookOpen size={32} className="text-primary mb-3" />
                <h5 className="fw-bold">Want more from {post.location?.split(',')[0] || "your area"}?</h5>
                <p className="text-muted mb-4">
                  Follow this location to get daily updates in your feed
                </p>
                <Button variant="primary" size="lg" className="rounded-pill px-4">
                  Follow {post.location?.split(',')[0] || "Location"}
                </Button>
              </Card.Body>
            </Card> */}

            {/* Engagement Bar */}
            <div className="engagement-bar d-flex justify-content-between align-items-center border-top border-bottom py-3 mb-5">
              <div className="d-flex gap-3">
                <LikeButton
                  postId={post._id}
                  initialLiked={post.likes?.includes(auth?.user?._id)}
                  initialCount={post.likes?.length}
                  showCount
                  size="lg"
                />
                <Button 
                  variant="outline-secondary" 
                  className="rounded-pill"
                  onClick={scrollToComments}
                >
                  <FaComments className="me-2" />
                  Comment ({comments.length})
                </Button>
              </div>
              <div className="d-flex gap-2">

                {/* <Button 
                  variant={isSaved ? "warning" : "outline-secondary"}
                  className="rounded-pill"
                  onClick={handleSave}
                >
                  <FaBookmark className="me-2" />
                  {isSaved ? "Saved" : "Save"}
                </Button> */}

                <Button 
                  variant="outline-primary" 
                  className="rounded-pill"
                  onClick={sharePost}
                >
                  <FaShareAlt className="me-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Location Selector */}
            {/* <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  More from nearby
                </h4>
                <LocationSelector 
                  currentLocation={selectedLocation}
                  onLocationChange={handleLocationChange}
                />
              </div>
              <p className="text-muted mb-4">
                Stories from your selected area. Change location to see different content.
              </p>
            </div> */}

            {/* Smart Feed Section - Suggested Posts */}
      

            {/* Comments Section */}
            <section ref={commentsRef} className="comments-section mt-5 pt-5 border-top">
              <h4 className="fw-bold mb-4">
                <FaComments className="me-2" />
                Discussion ({comments.length})
              </h4>

              {/* Comment box */}
              {auth?.user ? (
                <Form onSubmit={submitComment} className="comment-box mb-4">
                  <div className="d-flex gap-3">
                    <SafeAvatar src={auth.user.avatar} />
                    <div className="flex-grow-1">
                      <Form.Control
                        as="textarea"
                        ref={commentInputRef}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a thoughtful comment…"
                        rows={3}
                        className="rounded-3"
                      />
                      <div className="text-end mt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          className="rounded-pill px-3"
                          disabled={postingComment}
                        >
                          {postingComment ? "Posting…" : "Post Comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              ) : (
                <p className="text-muted">
                  <Link to="/login" className="text-decoration-none">Login</Link> to join the discussion
                </p>
              )}

              {/* Comments list */}
              {comments.length === 0 ? (
                <p className="text-muted text-center py-4">Be the first to comment.</p>
              ) : (
                <div className="vstack gap-3">
                  {comments.map((c) => (
                    <div key={c._id} className="comment-item p-3 border rounded-3">
                      <div className="d-flex gap-3">
                        <SafeAvatar src={c.author?.avatar} size={36} />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <strong>{c.author?.name || "User"}</strong>
                            <small className="text-muted">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-0 mt-2">{c.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </Col>


                <SmartFeedSection
              posts={smartFeedPosts}
              title="Suggested for You"
              subtitle="Based on your location and interests"
              loading={loadingRelated}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />

          {/* Sidebar */}
          <Col lg={4}>
            <div className="sticky-sidebar">
              {/* Suggested Users */}
              {suggestedUsers.length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body className="pb-2">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 fw-bold">
                        <FaUser className="me-2" />
                        Suggested Writers
                      </h6>
                      <Link to="/users" className="text-decoration-none small fw-semibold">
                        See all <FaChevronRight />
                      </Link>
                    </div>

                    <div className="suggested-carousel d-flex gap-3 overflow-auto pb-2">
                      {suggestedUsers.map((u) => (
                        <div key={u._id} className="suggested-card text-center flex-shrink-0" style={{ width: '100px' }}>
                          <SafeAvatar src={u.avatar} size={56} />
                          <div className="mt-2 fw-semibold text-truncate px-1 small">
                            {u.name}
                          </div>
                          <div className="extra-small text-muted mb-2">
                            {u.followersCount || 0} followers
                          </div>
                          <Button
                            variant={following[u._id] ? "outline-secondary" : "primary"}
                            size="sm"
                            className="mt-1 w-100 rounded-pill"
                            onClick={() => toggleFollow(u._id)}
                          >
                            {following[u._id] ? "Following" : "Follow"}
                          </Button>
                        </div>
                      ))}
                      
                      {/* View All Card */}
                      <Link to="/users" className="suggested-card see-all-card text-decoration-none flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '100px' }}>
                        <div className="see-all-inner text-center">
                          <FaChevronRight size={24} className="text-primary mb-2" />
                          <div className="fw-bold text-primary small">
                            View all
                          </div>
                        </div>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Category Chips */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Explore Topics</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {categories.slice(0, 10).map((category) => (
                      <Button
                        key={category._id}
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Related Posts - Infinite Scroll */}
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">
                      <FaFire className="me-2 text-danger" />
                      More Stories
                    </h6>
                    <Badge bg="light" text="dark">
                      {relatedPosts.length} posts
                    </Badge>
                  </div>
                  <div className="vstack gap-3">
                    {relatedPosts.map((rp, i) => (
                      <div
                        key={rp._id}
                        ref={i === relatedPosts.length - 1 ? lastPostRef : null}
                      >
                        <MiniCard post={rp} compact />
                      </div>
                    ))}
                  </div>
                  {loadingRelated && (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" variant="primary" />
                      <span className="ms-2 text-muted">Loading more...</span>
                    </div>
                  )}
                  {!hasMore && relatedPosts.length > 0 && (
                    <div className="text-center text-muted small mt-3">
                      You've seen all related posts
                    </div>
                  )}
                  {!loadingRelated && relatedPosts.length === 0 && (
                    <div className="text-center text-muted py-3">
                      No related posts found
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Floating Actions */}
        <FloatingActions
          postId={post._id}
          onCommentClick={scrollToComments}
          onShare={sharePost}
          onSave={handleSave}
          isSaved={isSaved}
        />
      </Container>
    </Layout>
  );
}




