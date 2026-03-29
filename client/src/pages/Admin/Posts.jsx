// import React, { useState, useEffect } from 'react';
// import AdminMenu from '../../Layout/AdminMenu';
// import Layout from '../../Layout/Layout';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';
// import API from '../../../utils/api';

// const Posts = () => {
//   const [posts, setPosts] = useState([]);

//   // Fetch all posts
//   const getAllPosts = async () => {
//     try {
//     const { data } = await API.get('/admin/posts', {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

//       if (data?.success) {
//         setPosts(data.posts);
//       } else {
//         toast.error('Failed to fetch posts');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Something went wrong while fetching posts');
//     }
//   };


//   const approvePost = async (id) => {
//   try {
//     const { data } = await API.put(
//       `/admin/post/${id}/approve`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     if (data?.success) {
//       toast.success("Post approved");
//       getAllPosts();
//     }
//   } catch (error) {
//     toast.error("Failed to approve post");
//   }
// };

// const rejectPost = async (id) => {
//   try {
//     const { data } = await API.put(
//       `/admin/post/${id}/reject`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     if (data?.success) {
//       toast.success("Post rejected");
//       getAllPosts();
//     }
//   } catch (error) {
//     toast.error("Failed to reject post");
//   }
// };


//   useEffect(() => {
//     getAllPosts();
//   }, []);



//   return (
//     <Layout>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center mb-4">All Blog Posts</h1>
//           <div className="d-flex flex-wrap">
//          {posts?.map((post) => (
//   <div key={post._id} className="card m-2" style={{ width: '18rem' }}>
//     <Link
//       to={`/dashboard/admin/post/${post.slug}`}
//       className="product-link"
//     >
//       <img
//         src={post.image}
//         className="card-img-top"
//         alt={post.title}
//         style={{ height: '200px', objectFit: 'cover' }}
//       />
//     </Link>

//     <div className="card-body">
//       <h5 className="card-title">{post.title}</h5>

//       <p className="card-text">
//         {post.content.length > 80
//           ? post.content.substring(0, 80) + '...'
//           : post.content}
//       </p>

//       <p className="text-muted">
//         {post.category?.name || 'Uncategorized'} |{' '}
//         <span
//           className={
//             post.status === 'published'
//               ? 'text-success'
//               : post.status === 'pending'
//               ? 'text-warning'
//               : 'text-danger'
//           }
//         >
//           {post.status}
//         </span>
//       </p>

//       {post.status === 'pending' && (
//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-success btn-sm"
//             onClick={() => approvePost(post._id)}
//           >
//             Approve
//           </button>

//           <button
//             className="btn btn-danger btn-sm"
//             onClick={() => rejectPost(post._id)}
//           >
//             Reject
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// ))}

//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Posts;


// import { useEffect, useState } from "react";
// import API from "../../../utils/api";
// import Layout from "../../Layout/Layout";

// const Posts = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPendingPosts = async () => {
//     try {
//       const { data } = await API.get("/post/admin/posts");

//       if (data?.success) {
//         setPosts(data.posts); // ✅ NO frontend filter
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingPosts();
//   }, []);

//   const approvePost = async (id) => {
//     try {
//       await API.put(`/post/admin/posts/${id}/approve`);
//       setPosts(prev => prev.filter(p => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const rejectPost = async (id) => {
//     try {
//       await API.put(`/post/admin/posts/${id}/reject`);
//       setPosts(prev => prev.filter(p => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//          <Layout>
//    <div>

//       <h2>Pending Posts</h2>

//       {posts.length === 0 && <p>No pending posts</p>}

//       {posts.map(post => (
//         <div key={post._id} className="post-card">
//           <h4>{post.title}</h4>

//           <button onClick={() => approvePost(post._id)}>
//             Approve
//           </button>

//           <button onClick={() => rejectPost(post._id)} className="danger">
//             Reject
//           </button>
//         </div>
//       ))}
//     </div>
//     </Layout>
//   );
// };

// export default Posts;













// import { useEffect, useState } from "react";
// import API from "../../../utils/api";
// import Layout from "../../Layout/Layout";
// import { Link } from "react-router-dom";

// const Posts = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPendingPosts = async () => {
//     try {
//       const { data } = await API.get("/post/admin/posts");
//       if (data?.success) {
//         setPosts(data.posts);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingPosts();
//   }, []);

//   const approvePost = async (id) => {
//     try {
//       await API.put(`/post/admin/posts/${id}/approve`);
//       setPosts(prev => prev.filter(p => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const rejectPost = async (id) => {
//     try {
//       await API.put(`/post/admin/posts/${id}/reject`);
//       setPosts(prev => prev.filter(p => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-6">📝 Pending Posts</h2>

//         {posts.length === 0 && (
//           <p className="text-gray-500">No pending posts</p>
//         )}

//         <div className="space-y-4">
//           {posts.map(post => (
//             <div
//               key={post._id}
//               className="bg-white shadow-md rounded-xl p-4 border"
//             >
//               {/* Title */}
//               <h4 className="text-lg font-semibold mb-2">
//                 {post.title}
//               </h4>


//               <div>
//                 {/* Category & Status */}
//                 <span className="text-sm text-gray-500">
//                   {post.category?.name || "Uncategorized"}
//                 </span>
//                 <span
//                   className={`text-sm ml-2 ${ 
//                     post.status === "published"
//                       ? "text-green-600"
//                       : post.status === "pending"
//                       ? "text-yellow-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {post.status}
//                 </span>

//               </div>

//               <div>
//                 {/* Image */}
//                 {post.image && (
//                   <img
//                     src={post.image}
//                     alt={post.title}
//                     className="w-full h-48 object-cover rounded-md my-3"
//                   />
//                 )}

//               </div>

//               {/* Meta */}
//               <div className="text-sm text-gray-500 mb-3">
//                 Author: {post.author?.name || "Unknown"} •{" "}
//                 {new Date(post.createdAt).toLocaleString()}
//               </div>

//               {/* Preview Link */}
//               <Link
//                 to={`/article/${post.slug}`}
//                 className="text-blue-600 text-sm underline"
//               >
//                 🔗 Preview Post
//               </Link>

//               {/* Actions */}
//               <div className="flex gap-4 mt-5">
//                 <button
//                   onClick={() => approvePost(post._id)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg mx-3 
//                bg-green-50 text-green-700 border border-green-300 
//                hover:bg-green-100 hover:border-green-400 
//                active:scale-95 transition-all duration-150 shadow-sm"
//                 >
//                   <span>✅</span>
//                   <span className="font-medium">Approve</span>
//                 </button>

//                 <button
//                   onClick={() => rejectPost(post._id)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg 
//                bg-red-50 text-red-700 border border-red-300 
//                hover:bg-red-100 hover:border-red-400 
//                active:scale-95 transition-all duration-150 shadow-sm"
//                 >
//                   <span>❌</span>
//                   <span className="font-medium">Reject</span>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Posts;


// import { useEffect, useState } from "react";
// import API from "../../../utils/api";
// import Layout from "../../Layout/Layout";
// import { Link } from "react-router-dom";

// const Posts = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null); // 👈 track button loading

//   const fetchPendingPosts = async () => {
//     try {
//       const { data } = await API.get("/post/admin/posts");
//       if (data?.success) {
//         setPosts(data.posts || []);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingPosts();
//   }, []);

//   // ✅ APPROVE
//   const approvePost = async (id) => {
//     try {
//       setActionLoading(id);

//       await API.put(`/post/admin/posts/${id}/approve`);

//       // 🔥 instant UI update (no refresh needed)
//       setPosts((prev) => prev.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ✅ REJECT
//   const rejectPost = async (id) => {
//     try {
//       setActionLoading(id);

//       await API.put(`/post/admin/posts/${id}/reject`);

//       setPosts((prev) => prev.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <p className="text-center mt-10">Loading posts...</p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-6">📝 Pending Posts</h2>

//         {posts.length === 0 && (
//           <p className="text-gray-500">No pending posts</p>
//         )}

//         <div className="space-y-4">
//           {posts.map((post) => (
//             <div
//               key={post._id}
//               className="bg-white shadow-sm rounded-xl border overflow-hidden"
//             >
//               {/* 🔥 IMAGE (FIXED HEIGHT) */}
//               <div
//                 style={{
//                   width: "100%",
//                   height: "200px",
//                   backgroundColor: "#f3f4f6",
//                 }}
//               >
//                 <img
//                   src={
//                     post.image ||
//                     "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"
//                   }
//                   alt={post.title}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />
//               </div>

//               {/* CONTENT */}
//               <div className="p-4">
//                 {/* TITLE */}
//                 <h4 className="text-lg font-semibold line-clamp-2">
//                   {post.title}
//                 </h4>

//                 {/* CATEGORY + STATUS */}
//                 <div className="mt-1 text-sm text-gray-500">
//                   {post.category?.name || "Uncategorized"}
//                   <span
//                     className={`ml-2 ${
//                       post.status === "published"
//                         ? "text-green-600"
//                         : post.status === "pending"
//                         ? "text-yellow-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     • {post.status}
//                   </span>
//                 </div>

//                 {/* DESCRIPTION */}
//                 {/* <p className="text-sm text-gray-600 mt-2 line-clamp-3">
//                   {post.content || post.description || "No description"}
//                 </p> */}

//                 {/* META */}
//                 <div className="text-xs text-gray-500 mt-2">
//                   {post.author?.name || "Unknown"} •{" "}
//                   {post.createdAt
//                     ? new Date(post.createdAt).toLocaleString()
//                     : ""}
//                 </div>

//                 {/* PREVIEW */}
//                 <Link
//                   to={`/feed/${post.location || "kota"}/${post.slug}`}
//                   className="text-blue-600 text-sm underline mt-2 inline-block"
//                 >
//                   🔗 Preview in Feed
//                 </Link>

//                 {/* ACTIONS */}
//                 <div className="flex gap-3 mt-4">
//                   <button
//                     disabled={actionLoading === post._id}
//                     onClick={() => approvePost(post._id)}
//                     className="px-4 py-2 rounded-lg 
//                     bg-green-50 text-green-700 border border-green-300 
//                     hover:bg-green-100 active:scale-95 transition disabled:opacity-50"
//                   >
//                     {actionLoading === post._id ? "..." : "✅ Approve"}
//                   </button>

//                   <button
//                     disabled={actionLoading === post._id}
//                     onClick={() => rejectPost(post._id)}
//                     className="px-4 py-2 rounded-lg 
//                     bg-red-50 text-red-700 border border-red-300 
//                     hover:bg-red-100 active:scale-95 transition disabled:opacity-50"
//                   >
//                     {actionLoading === post._id ? "..." : "❌ Reject"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Posts;











import { useEffect, useState, useRef, useCallback } from "react";
import API from "../../../utils/api";
import Layout from "../../Layout/Layout";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaTelegram, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../.../../../context/auth";

const LIMIT = 8;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const observer = useRef();
  const navigate = useNavigate();
  const { auth } = useAuth();
  

  // 🔥 FETCH POSTS (PAGINATED)
  const fetchPosts = useCallback(async (pageNo = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const { data } = await API.get(
        `/post/admin/posts?page=${pageNo}&limit=${LIMIT}`
      );

      if (!data?.posts?.length) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const newPosts = data.posts.filter((p) => !ids.has(p._id));
        return [...prev, ...newPosts];
      });

      setPage(pageNo + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  // 🔥 INTERSECTION OBSERVER (AUTO LOAD MORE)
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

  // ✅ APPROVE
  const approvePost = async (id) => {
    try {
      setActionLoading(id);
      await API.put(`/post/admin/posts/${id}/approve`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // ❌ REJECT
  const rejectPost = async (id) => {
    try {
      setActionLoading(id);
      await API.put(`/post/admin/posts/${id}/reject`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <p className="text-center mt-10">Loading posts...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">📝 Pending Posts</h2>

        {posts.length === 0 && (
          <p className="text-gray-500">No pending posts</p>
        )}

        <div className="space-y-4">
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;

            return (
              <div
                key={post._id}
                ref={isLast ? lastPostRef : null}
                className="bg-white shadow-sm rounded-xl border overflow-hidden"
              >
                {/* IMAGE */}
                <div style={{ height: "200px", background: "#f3f4f6" }}>
                  <img
                    src={
                      post.image ||
                      "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"
                    }
                    alt={post.title}
                    loading={index < 3 ? "eager" : "lazy"} // 🚀 LAZY LOAD
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h4 className="text-lg font-semibold line-clamp-2">
                    {post.title}
                  </h4>

                  <div className="text-sm text-gray-500 mt-1">
                    {post.category?.name || "Uncategorized"}
                    <span className="ml-2">• {post.status}</span>
                  </div>

                  {/* <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {post.content || post.description || "No description"}
                  </p> */}

                  <div className="text-xs text-gray-500 mt-2">
                    {post.author?.name || "Unknown"} •{" "}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : ""}
                  </div>

                  <Link
                    to={`/feed/${post.location || "kota"}/${post.slug}`}
                    className="text-blue-600 text-sm underline mt-2 inline-block"
                  >
                    🔗 Preview
                  </Link>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-4">
                    <button
                      disabled={actionLoading === post._id}
                      onClick={() => approvePost(post._id)}
                      className="px-4 py-2 rounded-lg bg-green-50 border hover:bg-green-100"
                    >
                      {actionLoading === post._id ? "..." : "✅ Approve"}
                    </button>

                    <button
                      disabled={actionLoading === post._id}
                      onClick={() => rejectPost(post._id)}
                      className="px-4 py-2 rounded-lg bg-red-50 border hover:bg-red-100"
                    >
                      {actionLoading === post._id ? "..." : "❌ Reject"}
                    </button>

                      <Link
    to={`/dashboard/admin/edit-post/${post.slug}`}
    className="btn btn-warning btn-sm"
  >
    ✏️ Edit
  </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LOADER */}
        {loading && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Loading more...
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Posts;