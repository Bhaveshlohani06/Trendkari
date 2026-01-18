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



import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import API from "../../utils/api";
import { formatTimeAgo } from "../../utils/timeago";

const PAGE_LIMIT = 10; // posts per fetch

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/post/get-posts?page=${page}&limit=${PAGE_LIMIT}`
      );

      if (data?.success) {
        setPosts((prev) => [...prev, ...data.posts]);
        setHasMore(data.posts.length === PAGE_LIMIT);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const BlogSkeleton = () => (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="row g-0">
        <div className="col-md-4">
          <Skeleton height={200} />
        </div>
        <div className="col-md-8 p-3">
          <Skeleton width="80%" />
          <Skeleton width="40%" />
          <Skeleton width="60%" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-6">Explore Kota District</h1>
          <p className="text-muted">Latest updates from all tehsils</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {posts.map((post, index) => {
              const isLast = index === posts.length - 1;

              return (
                <Link
                  key={post._id}
                  to={`/${post.location}/article/${post.slug}`}
                  ref={isLast ? lastPostRef : null}
                  className="text-decoration-none text-dark"
                >
                  <div className="card explore-card mb-4 border-0 shadow-sm">
                    <div className="row g-0 align-items-center">
                      {post.image && (
                        <div className="col-md-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="img-fluid explore-image rounded-start"
                          />
                        </div>
                      )}

                      <div className="col-md-8">
                        <div className="card-body">
                          <div className="d-flex justify-content-between text-muted small mb-2">
                            <span className="badge bg-light text-dark">
                              {post.location}
                            </span>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>

                          <h5 className="fw-bold explore-title mb-1">
                            {post.title}
                          </h5>

                          <div className="text-muted small">
                            {post?.author?.name || "Trendkari"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {loading && [...Array(3)].map((_, i) => <BlogSkeleton key={i} />)}

            {!hasMore && (
              <div className="text-center my-5">
                <p className="text-muted">You’ve reached the end</p>
                <Link to="/blog/categories" className="btn btn-outline-dark">
                  Browse Categories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
