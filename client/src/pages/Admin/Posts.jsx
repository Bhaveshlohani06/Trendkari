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













import { useEffect, useState } from "react";
import API from "../../../utils/api";
import Layout from "../../Layout/Layout";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPosts = async () => {
    try {
      const { data } = await API.get("/post/admin/posts");
      if (data?.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const approvePost = async (id) => {
    try {
      await API.put(`/post/admin/posts/${id}/approve`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectPost = async (id) => {
    try {
      await API.put(`/post/admin/posts/${id}/reject`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">📝 Pending Posts</h2>

        {posts.length === 0 && (
          <p className="text-gray-500">No pending posts</p>
        )}

        <div className="space-y-4">
          {posts.map(post => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-xl p-4 border"
            >
              {/* Title */}
              <h4 className="text-lg font-semibold mb-2">
                {post.title}
              </h4>

              {/* Meta */}
              <div className="text-sm text-gray-500 mb-3">
                Author: {post.author?.name || "Unknown"} •{" "}
                {new Date(post.createdAt).toLocaleString()}
              </div>

              {/* Preview Link */}
              <Link
                to={`/article/${post.slug}`}
                className="text-blue-600 text-sm underline"
              >
                🔗 Preview Post
              </Link>

              {/* Actions */}
              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => approvePost(post._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
               bg-green-50 text-green-700 border border-green-300 
               hover:bg-green-100 hover:border-green-400 
               active:scale-95 transition-all duration-150 shadow-sm"
                >
                  <span>✅</span>
                  <span className="font-medium">Approve</span>
                </button>

                <button
                  onClick={() => rejectPost(post._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
               bg-red-50 text-red-700 border border-red-300 
               hover:bg-red-100 hover:border-red-400 
               active:scale-95 transition-all duration-150 shadow-sm"
                >
                  <span>❌</span>
                  <span className="font-medium">Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Posts;