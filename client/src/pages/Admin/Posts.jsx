import React, { useState, useEffect } from 'react';
import AdminMenu from '../../Layout/AdminMenu';
import Layout from '../../Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  // Fetch all posts
  const getAllPosts = async () => {
    try {
      const { data } = await axios.get('/api/v1/post/get-posts');
      if (data?.success) {
        setPosts(data.posts);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching posts');
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Blog Posts</h1>
          <div className="d-flex flex-wrap">
            {posts?.map((post) => (
              <Link
                key={post._id}
                to={`/dashboard/admin/post/${post.slug}`}
                className="product-link"
              >
                <div className="card m-2" style={{ width: '18rem' }}>
                  <img
                    src={post.image}
                    className="card-img-top"
                    alt={post.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">
                      {post.content.length > 80
                        ? post.content.substring(0, 80) + '...'
                        : post.content}
                    </p>
                    <p className="text-muted">
                      {post.category?.name || 'Uncategorized'} |{' '}
                      <span className={post.status === 'published' ? 'text-success' : 'text-warning'}>
                        {post.status}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Posts;
