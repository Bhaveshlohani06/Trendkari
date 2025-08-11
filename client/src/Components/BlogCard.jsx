import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as timeago from 'timeago.js';

const BlogCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="card mb-4 shadow-sm border-0" 
      onClick={() => navigate(`/blog/${post.slug}`)} 
      style={{ cursor: "pointer" }}
    >
      {/* Blog Image */}
      <img 
        src={post.image} 
        alt={post.title} 
        className="card-img-top" 
        style={{ height: '200px', objectFit: 'contain', borderRadius: '10px 10px 0 0' }}
      />

      {/* Blog Content */}
      <div className="card-body">
        <h5 className="card-title fw-bold">{post.title}</h5>
        <p className="card-text text-muted">
          {post.description?.substring(0, 100)}...
        </p>

        {/* Blog Meta Info */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/* <small className="text-muted">#{post.category?.name || "General"}</small> */}
          <small className="text-muted">
            By <strong>{post.author?.name || "Unknown"}</strong> • {timeago.format(post.createdAt)}
          </small>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
