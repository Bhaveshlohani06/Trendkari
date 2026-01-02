import {React, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as timeago from 'timeago.js';
import { FaHeart, FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

      const handleLike = (e) => {
    e.stopPropagation(); // prevent navigating
    setLiked(!liked);
  };

   const handleShare = (e) => {
    e.stopPropagation(); // prevent navigating

    const shareUrl = `${window.location.origin}/article/${post.slug}`;
    const shareText = `Check out this post: ${post.title}`;

    // ✅ Modern share API (mobile/modern browsers)
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.log("Share error:", err));
    } else {
      // ✅ Fallback (open share options)
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);

      const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

      // Open in new tab (or show modal with options)
      window.open(whatsapp, "_blank");
      window.open(facebook, "_blank");
      window.open(twitter, "_blank");
    }
  };



  return (
    
    <div 
      className="card mb-4 shadow-sm border-0" 
      onClick={() => navigate(`/${post.location}/article/${post.slug}`)}        
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
            By <strong>{post?.author ? (
    <Link 
      to={`/profile/${post.author._id}`}
      className="text-decoration-none text-primary fw-medium mx-1"
      onClick={(e) => e.stopPropagation()}
    >
      {post.author.name}
    </Link>
  ) : (
    <span className="fw-medium mx-1">Unknown</span>
  )}</strong> • {timeago.format(post.createdAt)}
          </small>

                {/* Like + Share Buttons */}
          <div className="d-flex align-items-center gap-3">
            <FaHeart 
              onClick={handleLike}
              style={{ 
                cursor: "pointer", 
                color: liked ? "red" : "gray", 
                fontSize: "18px" 
              }} 
            />
            <FaShareAlt 
              onClick={handleShare}
              style={{ cursor: "pointer", fontSize: "18px", color: "gray" }} 
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
