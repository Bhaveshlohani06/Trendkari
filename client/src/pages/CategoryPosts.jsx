// pages/CategoryPosts.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Layout/Layout';

const CategoryPosts = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCategoryPosts();
    }
  }, [slug]);

  const fetchCategoryPosts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category/${slug}`);
      setPosts(data?.posts || []);
      setCategory(data?.category || null);
    } catch (err) {
      console.error('Error fetching category posts', err);
    }
  };

  return (
    <Layout>
    <div className="container mt-4">
      <h3 className="fw-bold mb-3 text-capitalize">
        {category ? category.name : 'Category'} Blogs
      </h3>
      {posts.length === 0 ? (
        <p>No posts found in this category.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={post.image} className="card-img-top" alt={post.title} />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </Layout>
  );
};

export default CategoryPosts;
