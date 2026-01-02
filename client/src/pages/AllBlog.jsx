import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import API from '../../utils/api';

const AllBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/post/get-posts');
      if (data?.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const BlogSkeleton = () => (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <Skeleton height={200} width="100%" />
        </div>
        <div className="col-md-8 p-3">
          <Skeleton count={2} />
          <Skeleton width={100} />
          <Skeleton count={3} />
          <Skeleton width={120} height={40} />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Insights & Updates</h1>
          <p className="lead text-muted">
            Discover the latest articles, news, and stories from our team of experts.
          </p>
        </div>

        {error ? (
          <div className="text-center">
            <p className="text-danger mb-3">{error}</p>
            <button className="btn btn-primary" onClick={getAllPosts}>
              Retry
            </button>
          </div>
        ) : loading ? (
          <>{[...Array(6)].map((_, i) => <BlogSkeleton key={i} />)}</>
        ) : posts.length === 0 ? (
          <div className="text-center">
            <p className="text-muted">No blog posts available yet.</p>
            <p className="text-secondary">Check back later for updates.</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              {posts.map((post) => (
                <div key={post._id} className="card mb-4 border-0 shadow-sm">
                  <div className="row g-0">
                    {post.image && (
                      <div className="col-md-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="img-fluid rounded-start h-100 object-fit-cover"
                          style={{ maxHeight: '200px', objectFit: 'contain' }}
                        />
                      </div>
                    )}
                    {post?.author ? (
                        <Link 
                          to={`/profile/${post.author._id}`}
                          className="text-decoration-none text-primary fw-medium mx-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.author.name}
                        </Link>
                      ) : (
                        <span className="fw-medium mx-1">Trendkari</span>
                      )}
                    <div className="col-md-8">
                      <div className="card-body">
                        <div className="d-flex align-items-center text-muted mb-2">
                          <FiCalendar className="me-2" />
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <h5 className="card-title fw-bold">{post.title}</h5>
                        <p className="card-text">
                          {post.content.replace(/<[^>]+>/g, '').slice(0, 160)}...
                        </p>
                        <Link to={`/article/${post.slug}`} className="text-primary text-decoration-none">
                          Read more <FiArrowRight className="ms-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <div className="bg-light rounded p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/blog/categories" className="text-decoration-none text-dark">
                      Browse Categories
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/trending" className="text-decoration-none text-dark">
                      Trending Now
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/newsletter" className="text-decoration-none text-dark">
                      Join Newsletter
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllBlogs;
