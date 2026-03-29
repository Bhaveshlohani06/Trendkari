import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as timeago from 'timeago.js';
import { 
  FaHeart, 
  FaShareAlt, 
  FaBookmark, 
  FaComment,
  FaRegHeart,
  FaRegBookmark,
  FaRegComment,
  FaUserCircle,
  FaTimes,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLink,
  FaMapMarkerAlt,
  FaTag
} from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import LikeButton from './LikeButton.jsx';
import { useAuth } from '../context/auth.jsx';

const MiniCard = ({ 
  post, 
  showCloseButton = false, 
  onClose, 
  className = '',
  onRemove 
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [readTime, setReadTime] = useState('0 min');
  const [auth] = useAuth();
  const userId = auth?.user?._id;

  // Calculate read time based on content
  useEffect(() => {
    const calculateReadTime = () => {
      const content = post.description || '';
      const title = post.title || '';
      const totalWords = (content + ' ' + title).split(/\s+/).length;
      const minutes = Math.ceil(totalWords / 200);
      return minutes > 0 ? `${minutes} min read` : '1 min read';
    };
    setReadTime(calculateReadTime());
  }, [post.description, post.title]);

  // Format date smartly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) return 'अभी';
      if (diffMins < 60) return `${diffMins} मिनट पहले`;
      if (diffHours < 24) return `${diffHours} घंटे पहले`;
      if (diffDays < 7) return `${diffDays} दिन पहले`;
      
      return date.toLocaleDateString('hi-IN', { 
        day: 'numeric',
        month: 'short',
        year: diffDays > 30 ? 'numeric' : undefined
      });
    } catch {
      return timeago.format(dateString);
    }
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle like
  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  // Handle bookmark
  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  // Handle share
  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  // Navigate to post
  const handleCardClick = () => {
    navigate(`/article/${encodeURIComponent(post.slug)}`);
  };

  // Navigate to author profile
  const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (post?.author?._id) {
      navigate(`/dashboard/user/profile/${post.author._id}`);
    }
  };

  // Get correct post URL based on location
  const getPostUrl = () => {
    const baseUrl = 'https://www.trendkari.in';
    if (post.location) {
      return `${baseUrl}/${post.location}/article/${post.slug}`;
    }
    return `${baseUrl}/article/${post.slug}`;
  };

  // Get location display name
  const getLocationDisplayName = (location) => {
    const cityMap = {
      'kota': 'कोटा',
      'ramganjmandi': 'रामगंजमंडी',
      'sangod': 'सांगोद',
      'ladpura': 'लाडपुरा',
      'rural-kota': 'ग्रामीण कोटा'
    };
    return cityMap[location] || location;
  };

  // Share functions
  const shareOnPlatform = (platform) => {
    const shareUrl = getPostUrl();
    const shareText = `${post.title} - TrendKari.in`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    };
    
    window.open(urls[platform], '_blank');
    setShowShareModal(false);
  };

  const copyToClipboard = async () => {
    const shareUrl = getPostUrl();
    await navigator.clipboard.writeText(shareUrl);
    alert('लिंक कॉपी हो गया!');
    setShowShareModal(false);
  };

  // Get author avatar
  const getAuthorAvatar = () => {
    if (post?.author?.avatar) {
      return post.author.avatar;
    }
    if (post?.author?.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random&color=fff&bold=true&font-size=0.5`;
    }
    return 'https://ui-avatars.com/api/?name=User&background=random&color=fff';
  };

  // Get city color
  const getCityColor = (city) => {
    const cityColors = {
      'kota': '#1E3A8A',
      'ramganjmandi': '#059669',
      'sangod': '#7C3AED',
      'ladpura': '#0EA5E9',
      'rural-kota': '#EA580C'
    };
    return cityColors[city] || '#6c757d';
  };

  return (
    <>
      {/* Main Card */}
      <div 
        className={`card border-0 shadow-sm hover-shadow position-relative overflow-hidden transition-all ${className}`}
        style={{ 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          height: '140px',
          maxHeight: '140px'
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(post._id);
              if (onClose) onClose();
            }}
            className="btn btn-sm btn-light rounded-circle position-absolute"
            style={{
              top: '8px',
              right: '8px',
              zIndex: 10,
              width: '28px',
              height: '28px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
            title="Remove this post"
          >
            <FaTimes size={12} style={{ color: '#dc3545' }} />
          </button>
        )}

        <div className="row g-0 h-100">
          {/* Image Column */}
          <div className="col-4 position-relative">
            <div 
              className="h-100 w-100 position-relative overflow-hidden"
              style={{ 
                backgroundColor: '#f8f9fa',
                minHeight: '140px'
              }}
            >
              <img
                src={imageError 
                  ? 'https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png' 
                  : post.image || 'https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png'
                }
                alt={post.title}
                className="w-100 h-100"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                }}
                onError={handleImageError}
                loading="lazy"
              />
              
              {/* Location badge */}
              {post.location && (
                <span 
                  className="badge position-absolute bottom-0 start-0 m-2 text-white"
                  style={{
                    backgroundColor: getCityColor(post.location),
                    fontSize: '8px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}
                >
                  <FaMapMarkerAlt size={8} className="me-1" />
                  {getLocationDisplayName(post.location)}
                </span>
              )}
              
              {/* Category badge */}
              {post.category && (
                <span 
                  className="badge position-absolute top-0 start-0 m-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: '#495057',
                    fontSize: '8px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    textTransform: 'uppercase'
                  }}
                >
                  <FaTag size={8} className="me-1" />
                  {post.category.name || 'सामान्य'}
                </span>
              )}
            </div>
          </div>

          {/* Content Column */}
          <div className="col-8">
            <div className="card-body h-100 d-flex flex-column p-3">
              {/* Title */}
              <h6 
                className="card-title mb-1 fw-bold text-dark"
                style={{
                  fontSize: '14px',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '2.6em'
                }}
              >
                {post.title}
              </h6>

              {/* Author & Date */}
              <div className="d-flex align-items-center mb-2">
                {/* Author Avatar */}
                <div 
                  className="rounded-circle overflow-hidden me-2 border"
                  style={{
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    borderWidth: '1px',
                    borderColor: '#dee2e6'
                  }}
                  onClick={handleAuthorClick}
                >
                  <img
                    src={getAuthorAvatar()}
                    alt={post.author?.name}
                    className="w-100 h-100"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                <div className="d-flex flex-column">
                  {post.author ? (
                    <Link
                      to={`/dashboard/user/profile/${post.author._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-decoration-none"
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        lineHeight: '1.2'
                      }}
                    >
                      {post.author.name}
                    </Link>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '12px' }}>अज्ञात</span>
                  )}
                  
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <small className="text-muted" style={{ fontSize: '10px' }}>
                      {formatDate(post.createdAt)}
                    </small>
                  </div>
                </div>
              </div>

              {/* Description */}
              {post.description && (  
                <p 
                  className="text-muted mb-2"
                  style={{
                    fontSize: '11px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '2.8em'
                  }}
                >
                  {post.description}
                </p>
              )}

              {/* Stats & Actions */}
              <div className="mt-auto d-flex align-items-center justify-content-between">
                {/* Stats */}
                <div className="d-flex align-items-center gap-3">
                  {/* Likes */}
                  <div className="d-flex align-items-center gap-1">
                    <LikeButton
                      postId={post._id}
                      initialLiked={Boolean(userId && post.likes?.includes(userId))}
                      initialCount={post.likes?.length || 0}
                      size="sm"
                      showCount
                      className="text-decoration-none"
                    />
                  </div>
                  
                  {/* Comments */}
                  <div 
                    className="d-flex align-items-center gap-1 text-muted"
                    style={{ fontSize: '12px' }}
                  >
                    <FaRegComment size={12} />
                    <span className="fw-medium" style={{ fontSize: '11px' }}>
                      {post.comments?.length || 0}
                    </span>
                  </div>
                  
                  {/* Read Time */}
                  <small className="text-muted" style={{ fontSize: '10px' }}>
                    {readTime}
                  </small>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="btn btn-link p-0 text-decoration-none"
                  style={{
                    color: '#6c757d',
                    fontSize: '14px',
                    lineHeight: 1
                  }}
                  title="Share"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="modal show d-block"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 1050,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              {/* Modal Header */}
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">शेयर करें</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowShareModal(false)}
                />
              </div>

              {/* Modal Body */}
              <div className="modal-body py-0">
                {/* Post Preview */}
                <div className="card border mb-4" style={{ borderRadius: '8px' }}>
                  <div className="row g-0 align-items-center">
                    <div className="col-3">
                      <img
                        src={post.image || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=TrendKari'}
                        alt={post.title}
                        className="img-fluid rounded-start"
                        style={{ 
                          height: '80px', 
                          objectFit: 'cover',
                          width: '100%'
                        }}
                      />
                    </div>
                    <div className="col-9">
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1" style={{ fontSize: '14px', fontWeight: '600' }}>
                          {post.title?.substring(0, 60)}...
                        </h6>
                        <p className="card-text text-muted mb-0" style={{ fontSize: '12px' }}>
                          www.trendkari.in
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link Copy Section */}
                <div className="input-group mb-4">
                  <input
                    type="text"
                    className="form-control form-control-sm border-end-0"
                    value={getPostUrl()}
                    readOnly
                    style={{ 
                      fontSize: '12px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={copyToClipboard}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }}
                  >
                    <FaLink className="me-1" />
                    कॉपी करें
                  </button>
                </div>

                {/* Share Options */}
                <div className="row g-3 text-center mb-3">
                  <div className="col-4">
                    <button
                      className="btn btn-light w-100 py-3 border rounded-3"
                      onClick={() => shareOnPlatform('whatsapp')}
                      style={{ 
                        transition: 'all 0.2s',
                        borderColor: '#e0e0e0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <div className="mb-2">
                        <FaWhatsapp size={24} style={{ color: '#25D366' }} />
                      </div>
                      <small className="d-block fw-medium">WhatsApp</small>
                    </button>
                  </div>
                  
                  <div className="col-4">
                    <button
                      className="btn btn-light w-100 py-3 border rounded-3"
                      onClick={() => shareOnPlatform('facebook')}
                      style={{ 
                        transition: 'all 0.2s',
                        borderColor: '#e0e0e0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <div className="mb-2">
                        <FaFacebook size={24} style={{ color: '#1877F2' }} />
                      </div>
                      <small className="d-block fw-medium">Facebook</small>
                    </button>
                  </div>
                  
                  <div className="col-4">
                    <button
                      className="btn btn-light w-100 py-3 border rounded-3"
                      onClick={() => shareOnPlatform('twitter')}
                      style={{ 
                        transition: 'all 0.2s',
                        borderColor: '#e0e0e0'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <div className="mb-2">
                        <FaTwitter size={24} style={{ color: '#1DA1F2' }} />
                      </div>
                      <small className="d-block fw-medium">Twitter</small>
                    </button>
                  </div>
                </div>

                {/* Native Share (Mobile) */}
                {navigator.share && (
                  <button
                    className="btn btn-outline-primary w-100 mb-3 rounded-3"
                    onClick={() => {
                      navigator.share({
                        title: post.title,
                        text: `${post.title} - TrendKari.in पर पढ़ें`,
                        url: getPostUrl()
                      });
                      setShowShareModal(false);
                    }}
                  >
                    और विकल्प...
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniCard;