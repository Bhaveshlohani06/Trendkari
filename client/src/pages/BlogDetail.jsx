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









import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import API from "../../utils/api";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";
import { useAuth } from "../context/auth";
import MiniCard from "../Components/MiniCard";
import EditorContent from "../Components/EditorContent";
import { toast } from "react-hot-toast";

const RELATED_LIMIT = 6;

export default function BlogDetail() {
  const { slug } = useParams();
  const [auth] = useAuth();

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [related, setRelated] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  /* ================= POST ================= */
  useEffect(() => {
    (async () => {
      const { data } = await API.get(`/post/get-post/${slug}`);
      if (data?.success) {
        setPost(data.post);
        setLikes(data.post.likes.length);
        setLiked(data.post.likes.includes(auth?.user?._id));
      }
    })();
  }, [slug, auth?.user?._id]);

  /* ================= COMMENTS ================= */
  const fetchComments = async () => {
    const { data } = await API.get(`/posts/${slug}/comments`);
    if (data?.success) setComments(data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!auth?.user) return toast.error("Login required");

    const { data } = await API.post(`/posts/${slug}/comments`, {
      content: commentText,
    });

    if (data?.success) {
      setComments(prev => [data.comment, ...prev]);
      setCommentText("");
    }
  };

  /* ================= LIKE ================= */
  const toggleLike = async () => {
    if (!auth?.user) return toast.error("Login required");

    const method = liked ? "delete" : "post";
    await API[method](`/post/${post._id}/like`);

    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  /* ================= SHARE ================= */
  const sharePost = () => {
    const url = window.location.href;
    navigator.share
      ? navigator.share({ title: post.title, url })
      : window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
  };

  /* ================= RELATED POSTS (INFINITE) ================= */
  const fetchRelated = async () => {
    if (!hasMore) return;

    const { data } = await API.get(
      `/post/get-posts?status=approved&page=${page}&limit=${RELATED_LIMIT}`
    );

    if (data?.success) {
      setRelated(prev => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    }
  };

  useEffect(() => {
    fetchRelated();
  }, [page]);

  const lastPostRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [hasMore]);

  if (!post) return null;

  return (
    <Layout title={post.title}>
      <div className="container py-4 row mx-auto">
        {/* MAIN */}
        <div className="col-lg-8">
          <h1 className="fw-bold">{post.title}</h1>
          {/* META */}
          <div className="text-muted mb-3 small">
            {post.location && (

              <>
                <Link to={`/${post.location}/articles`} className="text-decoration-none">

                


                  📍 {post.location}
                </Link>{" "}•{" "}
              </>
            )}    
            {post.category && (
              <>
                <Link to={`/category/${post.category.slug}`} className="text-decoration-none">
                  {post.category.name}
                </Link>{" "}•{" "}
              </>
            )}
            <span>{post.language === "hi" ? "हिंदी" : "English"}</span> •{" "}
            {post.author?.name || "Trendkari"} • {new Date(post.createdAt).toLocaleDateString()}
          </div>
          {/* IMAGE */}
          {post.image && (
            <img src={post.image} alt={post.title} className="img-fluid rounded mb-4" />
          )}
          {/* CONTENT */}


          <EditorContent content={post.content} />

          {/* ACTIONS */}
          <div className="d-flex gap-4 my-4">
            <button onClick={toggleLike} className="btn btn-link p-0">
              {liked ? <FaHeart color="red" /> : <FaRegHeart />} {likes}
            </button>

            <button onClick={sharePost} className="btn btn-link p-0">
              <FaShareAlt /> Share
            </button>
          </div>

          {/* COMMENTS */}
          <h5>Comments ({comments.length})</h5>

          {auth?.user && (
            <form onSubmit={submitComment} className="mb-3">
              <textarea
                className="form-control"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                required
              />
              <button className="btn btn-primary mt-2">Post</button>
            </form>
          )}

          {comments.map(c => (
            <div key={c._id} className="border rounded p-2 mb-2">
              <Link to={`/dashboard/user/profile/${c.author._id}`}>
                <strong>{c.author.name}</strong>
              </Link>
              <p className="mb-0">{c.content}</p>
            </div>
          ))}
        </div>

        {/* SIDEBAR */}
        <div className="col-lg-4">
          <h5>Related Posts</h5>

          {related.map((p, i) => (
            <div
              key={p._id}
              ref={i === related.length - 1 ? lastPostRef : null}
            >
              <MiniCard post={p} />
            </div>
          ))}

          {!hasMore && <p className="text-muted text-center">No more posts</p>}
        </div>
      </div>
    </Layout>
  );
}
