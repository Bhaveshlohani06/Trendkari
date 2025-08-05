import React from 'react';
import { useNavigate } from 'react-router-dom';

const MiniCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card mb-3 shadow-sm"
      onClick={() => navigate(`/blog/${post.slug}`)}
      style={{ cursor: 'pointer', height: '120px', overflow: 'hidden' }}
    >
      <div className="row g-0 h-100">
        <div className="col-4">
          <img
            src={post.image}
            alt={post.title}
            className="img-fluid w-100"
            style={{ objectFit: 'contain',  backgroundColor: '#ffffffff', height: '100%' }}
          />
        </div>
        <div className="col-8">
          <div className="card-body p-2">
            <h6 className="card-title mb-1 fw-semibold">{post.title}</h6>
            <p className="card-text text-muted small mb-1">
              {post.description?.substring(0, 60)}
            </p>
            <small className="text-muted">
             <small className="text-muted">#{post.category?.name || "General"}</small>
             <br/>
            <small className="text-muted">{post.author?.name || "Trendkari"}</small>
            </small>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCard;
