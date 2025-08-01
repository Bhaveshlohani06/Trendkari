import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  
  return (
    <div className="card mb-4 shadow-sm" onClick={() => navigate(`/blog/${post.slug}`)} style={{ cursor: "pointer" }}>
      <img src={post.image} className="card-img-top" 
      alt={post.title}
       style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title fw-bold">{post.title}</h5>
        <p className="card-text text-muted">{post.description?.substring(0, 100)}</p>
        
        <small className="text-muted">#{post.category?.name || "General"}</small>
        
      </div>
    </div>
  );
};

export default BlogCard;
