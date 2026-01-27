// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Layout from '../Layout/Layout';
// import { FiCalendar, FiArrowRight } from 'react-icons/fi';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import API from '../../utils/api';
// import { formatTimeAgo } from '../../utils/timeago';

// const AllBlogs = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getAllPosts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get('/post/get-posts');
//       if (data?.success) {
//         setPosts(data.posts);
//       }
//     } catch (err) {
//       console.error('Failed to fetch posts:', err);
//       setError('Failed to load blog posts. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllPosts();
//   }, []);

//   const BlogSkeleton = () => (
//     <div className="card mb-4">
//       <div className="row g-0">
//         <div className="col-md-4">
//           <Skeleton height={200} width="100%" />
//         </div>
//         <div className="col-md-8 p-3">
//           <Skeleton count={2} />
//           <Skeleton width={100} />
//           <Skeleton count={3} />
//           <Skeleton width={120} height={40} />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <Layout>
//       <div className="container py-5">
//         <div className="text-center mb-5">
//           <h1 className="display-5 fw-bold">Insights & Updates</h1>
//           <p className="lead text-muted">
//             Discover the latest articles, news, and stories from our team of experts.
//           </p>
//         </div>

//         {error ? (
//           <div className="text-center">
//             <p className="text-danger mb-3">{error}</p>
//             <button className="btn btn-primary" onClick={getAllPosts}>
//               Retry
//             </button>
//           </div>
//         ) : loading ? (
//           <>{[...Array(6)].map((_, i) => <BlogSkeleton key={i} />)}</>
//         ) : posts.length === 0 ? (
//           <div className="text-center">
//             <p className="text-muted">No blog posts available yet.</p>
//             <p className="text-secondary">Check back later for updates.</p>
//           </div>
//         ) : (
//           <div className="row">
//             <div className="col-md-8">

//               {posts.map((post) => (
//   <Link
//     key={post._id}
//     to={`/${post.location}/article/${post.slug}`}
//     className="text-decoration-none text-dark"
//   >
//     <div className="card explore-card mb-4 border-0 shadow-sm">
//       <div className="row g-0 align-items-center">

//         {/* Image */}
//         {post.image && (
//           <div className="col-md-4">
//             <img
//               src={post.image}
//               alt={post.title}
//               loading="lazy"
//               className="img-fluid explore-image"
//             />
//           </div>
//         )}

//         {/* Content */}
//         <div className="col-md-8">
//           <div className="card-body">

//             {/* Meta */}
//             <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
//               <span className="badge bg-light text-dark">
//                 {post.location}
//               </span>
//               <span>
//                 {formatTimeAgo(post.createdAt)}
//               </span>
//             </div>

//             {/* Title */}
//             <h5 className="fw-bold explore-title">
//               {post.title}
//             </h5>

//             {/* Author */}
//             <div className="text-muted small mt-2">
//               {post?.author?.name || "Trendkari"}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   </Link>
// ))}

//             </div>

//             <div className="col-md-4">
//               <div className="bg-light rounded p-4 shadow-sm">
//                 <h5 className="fw-bold mb-3">Quick Links</h5>
//                 <ul className="list-unstyled">
//                   <li className="mb-2">
//                     <Link to="/blog/categories" className="text-decoration-none text-dark">
//                       Browse Categories
//                     </Link>
//                   </li>
//                   <li className="mb-2">
//                     <Link to="/trending" className="text-decoration-none text-dark">
//                       Trending Now
//                     </Link>
//                   </li>
//                   <li className="mb-2">
//                     <Link to="/newsletter" className="text-decoration-none text-dark">
//                       Join Newsletter
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default AllBlogs;



// import React, { useEffect, useState } from "react";
// import Layout from "../Layout/Layout";
// import MiniCard from "../Components/MiniCard";
// import API from "../../utils/api";

// const ExplorePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all posts at once
//   const fetchAllPosts = async () => {
//     try {
//       const { data } = await API.get("/post/get-posts?status=approved");
//       if (data?.success) {
//         setPosts(data.posts || []);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   // Remove post
//   const handleRemovePost = (postId) => {
//     setPosts(prev => prev.filter(post => post._id !== postId));
//   };

//   return (
//     <Layout title="Explore | Trendkari">
//       <div className="container py-4">
//         {/* Simple Heading */}
//         <div className="mb-4">
//           <h1 className="fw-bold">Explore Kota District</h1>
//           <p className="text-muted">All posts from every city</p>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-5">
//             <div className="spinner-border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         )}

//         {/* Posts Grid */}
//         <div className="row g-3">
//           {posts.map((post) => (
//             <div className="col-md-6 col-lg-4" key={post._id}>
//               <MiniCard 
//                 post={post} 
//                 showCloseButton={true} 
//                 onRemove={handleRemovePost}
//               />
//             </div>
//           ))}
//         </div>

//         {/* No Posts */}
//         {!loading && posts.length === 0 && (
//           <div className="text-center py-5">
//             <p className="text-muted">No posts to show</p>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default ExplorePage;










// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Layout from "../Layout/Layout";
// import MiniCard from "../Components/MiniCard";
// import API from "../../utils/api";


// const ExplorePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const observer = useRef();

//   // 📥 Fetch posts
//   const fetchPosts = async () => {
//     if (!hasMore) return;

//     setLoading(true);
//     try {
//       const { data } = await API.get(
//         `/post/get-posts?status=approved`
//       );

//       if (data?.success) {
//         setPosts(prev => [...prev, ...(data.posts || [])]);
//         setHasMore(data.hasMore);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔁 Fetch on page change
//   useEffect(() => {
//     fetchPosts();
//   }, [page]);

//   // 👀 Observer callback
//   const lastPostRef = useCallback(node => {
//     if (loading) return;

//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prev => prev + 1);
//       }
//     });

//     if (node) observer.current.observe(node);
//   }, [loading, hasMore]);

//   // ❌ Remove post locally
//   const handleRemovePost = (postId) => {
//     setPosts(prev => prev.filter(p => p._id !== postId));
//   };

//   return (
//     <Layout title="Explore | Trendkari">
//       <div className="container py-4">
//         <div className="mb-4">
//           <h1 className="fw-bold">Explore Kota District</h1>
//           <p className="text-muted">All posts from every city</p>
//         </div>

//         <div className="row g-3">
//           {posts.map((post, index) => {
//             const isLast = index === posts.length - 1;

//             return (
//               <div
//                 className="col-md-6 col-lg-4"
//                 key={post._id}
//                 ref={isLast ? lastPostRef : null}
//               >
//                 <MiniCard
//                   post={post}
//                   showCloseButton
//                   onRemove={handleRemovePost}
//                 />
//               </div>
//             );
//           })}
//         </div>

//         {loading && (
//           <div className="text-center py-4">
//             <div className="spinner-border" />
//           </div>
//         )}

//         {!hasMore && !loading && (
//           <div className="text-center py-4 text-muted">
//             You’ve reached the end 🚀
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default ExplorePage;



import React, { useEffect, useState, useRef, useCallback } from "react";
import Layout from "../Layout/Layout";
import MiniCard from "../Components/MiniCard";
import API from "../../utils/api";

const LIMIT = 9; // cards per fetch

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef(null);

  // 📥 Fetch posts
  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await API.get(
        `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`
      );

      if (data?.success) {
        setPosts(prev => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch on page change
  useEffect(() => {
    fetchPosts();
  }, [page]);

  // 👀 Intersection Observer
  const lastPostRef = useCallback(
    node => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // ❌ Remove post locally
  const handleRemovePost = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  return (
    <Layout title="Explore | Trendkari">
      <div className="container py-4">
        <div className="mb-4">
          <h1 className="fw-bold">Explore Kota District</h1>
          <p className="text-muted">All posts from every city</p>
        </div>

        <div className="row g-3">
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;

            return (
              <div
                className="col-md-6 col-lg-4"
                key={post._id}
                ref={isLast ? lastPostRef : null}
              >
                <MiniCard
                  post={post}
                  showCloseButton
                  onRemove={handleRemovePost}
                />
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border" />
          </div>
        )}

        {!hasMore && !loading && (
          <div className="text-center py-4 text-muted">
            You’ve reached the end 🚀
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
