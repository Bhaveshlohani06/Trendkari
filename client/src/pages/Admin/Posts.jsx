import React, { useState, useEffect } from 'react';
import AdminMenu from '../../Layout/AdminMenu';
import Layout from '../../Layout/Layout';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import API from '../../../utils/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  // Fetch all posts
  const getAllPosts = async () => {
    try {
    const { data } = await API.get('/admin/posts', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

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


  const approvePost = async (id) => {
  try {
    const { data } = await API.put(
      `/admin/post/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (data?.success) {
      toast.success("Post approved");
      getAllPosts();
    }
  } catch (error) {
    toast.error("Failed to approve post");
  }
};

const rejectPost = async (id) => {
  try {
    const { data } = await API.put(
      `/admin/post/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (data?.success) {
      toast.success("Post rejected");
      getAllPosts();
    }
  } catch (error) {
    toast.error("Failed to reject post");
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
  <div key={post._id} className="card m-2" style={{ width: '18rem' }}>
    <Link
      to={`/dashboard/admin/post/${post.slug}`}
      className="product-link"
    >
      <img
        src={post.image}
        className="card-img-top"
        alt={post.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
    </Link>

    <div className="card-body">
      <h5 className="card-title">{post.title}</h5>

      <p className="card-text">
        {post.content.length > 80
          ? post.content.substring(0, 80) + '...'
          : post.content}
      </p>

      <p className="text-muted">
        {post.category?.name || 'Uncategorized'} |{' '}
        <span
          className={
            post.status === 'published'
              ? 'text-success'
              : post.status === 'pending'
              ? 'text-warning'
              : 'text-danger'
          }
        >
          {post.status}
        </span>
      </p>

      {post.status === 'pending' && (
        <div className="d-flex gap-2">
          <button
            className="btn btn-success btn-sm"
            onClick={() => approvePost(post._id)}
          >
            Approve
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => rejectPost(post._id)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
))}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Posts;
