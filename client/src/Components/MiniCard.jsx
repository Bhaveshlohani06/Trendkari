import {React, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as timeago from 'timeago.js';
import { FaHeart, FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";


const MiniCard = ({ post }) => {
  const navigate = useNavigate();
    const [liked, setLiked] = useState(false);


        const handleLike = (e) => {
    e.stopPropagation(); // prevent navigating
    setLiked(!liked);
  };

   const handleShare = (e) => {
    e.stopPropagation(); // prevent navigating

    // const shareUrl = `${window.location.origin}/${post.location}/article/${post.slug}`;
const shareUrl = post.location
  ? `${window.location.origin}/${post.location}/article/${post.slug}`
  : `${window.location.origin}/article/${post.slug}`;


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
      className="card mb-3 shadow-sm"
onClick={() =>
  navigate(
    post.location
      ? `/${post.location}/article/${post.slug}`
      : `/article/${post.slug}`
  )
}

      style={{ cursor: 'pointer', height: '120px', overflow: 'hidden' }}
    >
      <div className="row g-0 h-100">
        <div className="col-4">
          <img
            src={post.image}
            alt={post.title}
            className="img-fluid w-100"
           style={{
    objectFit: 'contain',
    objectPosition: 'center',
    backgroundColor: '#fff',
    height: 'auto',
    maxHeight: '300px', // adjust based on your card design
  }}
          />
        </div>
        <div className="col-8">
          <div className="card-body p-2">
            <h6 className="card-title mb-1 fw-semibold">{post.title?.substring(0,36)}</h6>
            {/* <p className="card-text text-muted small mb-1">
              {post.description?.substring(0, 60)}
            </p> */}
            <small className="text-muted">
             <small className="text-muted">#{post.category?.name || "General"}</small>
             <br/>
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
    </div>
  );
};

export default MiniCard;
