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



import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import API from "../../utils/api";
import { FaShareAlt, FaArrowRight, FaComments } from "react-icons/fa";
import { useAuth } from "../context/auth";
import MiniCard from "../Components/MiniCard";
import EditorContent from "../Components/EditorContent";
import LikeButton from "../Components/LikeButton";
import { toast } from "react-hot-toast";
import "../../css/BlogDetail.css";

const RELATED_LIMIT = 4;
const SUGGESTED_USERS_LIMIT = 9;

/* ================= SAFE AVATAR ================= */
const SafeAvatar = ({ src, alt, size = 40 }) => (
  <img
    src={src && src.startsWith("http") ? src : "/avatar.png"}
    alt={alt}
    width={size}
    height={size}
    className="rounded-circle"
    loading="lazy"
    onError={(e) => (e.target.src = "/avatar.png")}
    style={{ objectFit: "cover" }}
  />
);

export default function BlogDetail() {
  const { slug } = useParams();
  const [auth] = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [following, setFollowing] = useState({});

  const observer = useRef(null);
  const commentInputRef = useRef(null);

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/post/get-post/${slug}`);
        if (data?.success) setPost(data.post);
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  /* ================= COMMENTS ================= */
  useEffect(() => {
    if (!post) return;
    API.get(`/posts/${slug}/comments`).then(({ data }) => {
      if (data?.success) setComments(data.comments);
    });
  }, [post, slug]);

const fetchComments = async () => {
  try {
    const { data } = await API.get(`/posts/${post._id}/comments`);
    if (data?.success) {
      setComments(data.comments);
    }
  } catch (err) {
    console.error(err);
  }
};


useEffect(() => {
  if (!post?._id) return;
  fetchComments();
}, [post?._id]);


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
      `/posts/${post._id}/comments`,
      { content: commentText.trim() }
    );

    if (data?.success) {
      setCommentText("");
      await fetchComments(); // 🔥 guaranteed sync
      toast.success("Comment added");
    }
  } catch {
    toast.error("Failed to post comment");
  } finally {
    setPostingComment(false);
  }
};


  /* ================= RELATED POSTS ================= */
  const fetchRelatedPosts = async (pageNum) => {
    if (!post || loadingRelated || !hasMore) return;
    setLoadingRelated(true);
    try {
      const { data } = await API.get(
        `/post/get-posts`
      );
      if (data?.success) {
        setRelatedPosts((prev) => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
      }
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    if (!post) return;
    setRelatedPosts([]);
    setPage(1);
    setHasMore(true);
    fetchRelatedPosts(1);
  }, [post?._id]);

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

  const toggleFollow = async (id) => {
    if (!auth?.user) return toast.error("Login to follow");
    const isFollowing = following[id];
    await API[isFollowing ? "delete" : "post"](`/user/${id}/follow`);
    setFollowing({ ...following, [id]: !isFollowing });
  };

  /* ================= SHARE ================= */
  const sharePost = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  if (loading) {
    return <Layout title="Loading..." />;
  }

  if (!post) {
    return (
      <Layout title="Not Found">
        <div className="container py-5 text-center">
          <h3>Post not found</h3>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={post.title}>
      <div className="container py-4">
        {/* ================= BREADCRUMB ================= */}
        <nav className="breadcrumb mb-4">
          <Link to="/">Home</Link>
          {post.category && (
            <>
              <span>/</span>
              <Link to={`/category/${post.category.slug}`}>
                {post.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-muted">{post.title}</span>
        </nav>

        <div className="row g-4">
          {/* ================= MAIN ================= */}
          <div className="col-lg-8">
            <h1 className="fw-bold mb-3">{post.title}</h1>

            <div className="d-flex align-items-center gap-3 mb-4">
              <SafeAvatar src={post.author?.avatar} alt={post.author?.name} />
              <div>
                <Link to={`/dashboard/user/profile/${post.author?._id}`}>
                  <strong>{post.author?.name}</strong>
                </Link>
                <div className="text-muted small">
                  {new Date(post.createdAt).toDateString()}
                  {post.location && ` • ${post.location}`}
                </div>
              </div>
            </div>

            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="img-fluid rounded mb-4 shadow-sm"
              />
            )}

            <EditorContent content={post.content} />

            {/* ================= ACTIONS ================= */}
            <div className="d-flex justify-content-between border-top border-bottom py-3 my-4">
              <LikeButton
                postId={post._id}
                initialLiked={post.likes?.includes(auth?.user?._id)}
                initialCount={post.likes?.length}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => commentInputRef.current?.focus()}
              >
                <FaComments /> Comment
              </button>
              <button className="btn btn-outline-primary" onClick={sharePost}>
                <FaShareAlt /> Share
              </button>
            </div>

            {/* ================= COMMENTS ================= */}
      
{/* ================= COMMENTS ================= */}
<div className="comments-section mt-5">
  <h5 className="fw-bold mb-3">
    Comments <span className="text-muted">({comments.length})</span>
  </h5>

  {/* Comment box */}
  {auth?.user ? (
    <form onSubmit={submitComment} className="comment-box mb-4">
      <div className="d-flex gap-3">
        <SafeAvatar src={auth.user.avatar} />
        <div className="flex-grow-1">
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="form-control"
            placeholder="Write a thoughtful comment…"
            rows={2}
          />
          <div className="text-end mt-2">
            <button
              className="btn btn-primary btn-sm"
              disabled={postingComment}
            >
              {postingComment ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <p className="text-muted">
      <Link to="/login">Login</Link> to join the discussion
    </p>
  )}

  {/* Comments list */}
  {comments.length === 0 ? (
    <p className="text-muted">Be the first to comment.</p>
  ) : (
    comments.map((c) => (
      <div key={c._id} className="comment-item mb-3">
        <div className="d-flex gap-3">
          <SafeAvatar src={c.author?.avatar} size={36} />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              <strong>{c.author?.name || "User"}</strong>
              <small className="text-muted">
                {new Date(c.createdAt).toLocaleDateString()}
              </small>
            </div>
            <p className="mb-0">{c.content}</p>
          </div>
        </div>
      </div>
    ))
  )}
</div>

          
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: 80 }}>
              {/* Suggested Users */}
{suggestedUsers.length > 0 && (
  <div className="card mb-4 shadow-sm border-0">
    <div className="card-body pb-2">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 fw-bold">Suggested Writers</h6>
        <Link
          to="/users"
          className="text-decoration-none small fw-semibold"
        >
          See all →
        </Link>
      </div>

      {/* Carousel */}
      <div className="suggested-carousel d-flex gap-3 overflow-auto pb-2">

        {/* User cards */}
        {suggestedUsers.map((u) => (
          <div
            key={u._id}
            className="suggested-card text-center flex-shrink-0"
          >
            <SafeAvatar src={u.avatar} size={56} />

            <div className="mt-2 fw-semibold text-truncate px-1">
              {u.name}
            </div>

            <button
              className={`btn btn-sm mt-2 w-100 ${
                following[u._id]
                  ? "btn-outline-secondary"
                  : "btn-primary"
              }`}
              onClick={() => toggleFollow(u._id)}
            >
              {following[u._id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}

        {/* MORE USERS CARD */}
        <Link
          to="/users"
          className="suggested-card see-all-card text-decoration-none flex-shrink-0"
        >
          <div className="see-all-inner">
            <span className="see-all-arrow">→</span>
            <div className="fw-bold mt-1 text-primary text-center">
              View all
            </div>
          </div>
        </Link>

      </div>
    </div>
  </div>
)}



              {/* Related Posts */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Related Posts</h6>
                  {relatedPosts.map((rp, i) => (
                    <div
                      key={rp._id}
                      ref={i === relatedPosts.length - 1 ? lastPostRef : null}
                      className="mb-3"
                    >
                      <MiniCard post={rp} compact />
                    </div>
                  ))}
                  {loadingRelated && <div className="text-center">Loading...</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}
