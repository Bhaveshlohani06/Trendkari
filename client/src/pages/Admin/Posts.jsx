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


import { useEffect, useState } from "react";
import API from "../../../utils/api";
import Layout from "../../Layout/Layout";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPosts = async () => {
    try {
      const { data } = await API.get("/post/admin/posts");

      if (data?.success) {
        setPosts(data.posts); // ✅ NO frontend filter
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

  if (loading) return <p>Loading...</p>;

  return (
         <Layout>
   <div>

      <h2>Pending Posts</h2>

      {posts.length === 0 && <p>No pending posts</p>}

      {posts.map(post => (
        <div key={post._id} className="post-card">
          <h4>{post.title}</h4>

          <button onClick={() => approvePost(post._id)}>
            Approve
          </button>

          <button onClick={() => rejectPost(post._id)} className="danger">
            Reject
          </button>
        </div>
      ))}
    </div>
    </Layout>
  );
};

export default Posts;
