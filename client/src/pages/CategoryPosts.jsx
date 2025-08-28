import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import MiniCard from '../Components/MiniCard';
import API from '../../utils/api';

const CategoryPosts = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [otherCategoryPosts, setOtherCategoryPosts] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchCategoryPosts();
      fetchAllPosts();
    }
  }, [slug]);

  const fetchCategoryPosts = async () => {
    try {
      const { data } = await API.get(`/category/get-category/${slug}`);
      setPosts(data?.posts || []);
      setCategory(data?.category || null);
    } catch (err) {
      console.error('Error fetching category posts', err);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const { data } = await API.get('/post/get-posts');
      if (data?.success) {
        setBlogs(data.posts);
        // Get trending posts (assuming there's an isTrending field)
        const trending = data.posts.filter(post => post.isTrending).slice(0, 8);
        setTrendingPosts(trending);
        
        // Get posts from other categories
        const otherCategories = data.posts
          .filter(post => post.category?.slug !== slug)
          .slice(0, 5);
        setOtherCategoryPosts(otherCategories);
      }
    } catch (err) {
      console.error('Error fetching all posts', err);
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="fw-bold text-capitalize mb-4 border-bottom pb-2">
          {category ? category.name : 'Category'} Article
        </h2>

        <div className="row">
          {/* Main Content - 8 columns */}
          <div className="col-md-8">
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <p className="fs-5 text-muted">No posts in this category yet.</p>
                <Link to="/" className="btn btn-primary">
                  Browse All Posts
                </Link>
              </div>
            ) : (
              <div className="row">
                {posts.map((post) => (
                  <div key={post._id} className="col-md-6 mb-4">
                    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                        <img
                          src={post.image}
                          className="card-img-top rounded-top"
                          alt={post.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h5 className="card-title fw-semibold">{post.title}</h5>
                          {/* <p className="card-text text-muted small">
                            {post.content.slice(0, 120)}...
                          </p> */}
                          <div className="d-flex align-items-center mt-2">
                            <small className="text-muted">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </small>
                              <span className="mx-1">•</span>
                      {post?.author ? (
                        <Link
                          to={`/profile/${post.author._id}`}
                          className="text-decoration-none text-primary fw-medium"
                        >
                          {post.author.name}
                        </Link>
                      ) : (
                        <span className="fw-medium">Trendkari</span>
                      )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-md-4">
            {/* Trending Posts Section */}
            {/* <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold border-bottom pb-2 mb-3">🔥 Trending Now</h5>
                <div className="d-flex flex-column gap-3">
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map((post) => (
                      <MiniCard key={post._id} post={post} />
                    ))
                  ) : (
                    <p className="text-muted small">No trending posts available</p>
                  )}
                </div>
              </div>
            </div> */}

            {/* Other Categories Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold border-bottom pb-2 mb-3">🌐 Explore More</h5>
                <div className="d-flex flex-column gap-3">
                  {otherCategoryPosts.length > 0 ? (
                    otherCategoryPosts.map((post) => (
                      <MiniCard key={post._id} post={post} />
                    ))
                  ) : (
                    <p className="text-muted small">No posts from other categories</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPosts;