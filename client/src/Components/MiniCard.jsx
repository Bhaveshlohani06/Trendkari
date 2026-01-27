// import {React, useState} from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import * as timeago from 'timeago.js';
// import { FaHeart, FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";


// const MiniCard = ({ post }) => {
//   const navigate = useNavigate();
//     const [liked, setLiked] = useState(false);


//         const handleLike = (e) => {
//     e.stopPropagation(); // prevent navigating
//     setLiked(!liked);
//   };

//    const handleShare = (e) => {
//     e.stopPropagation(); // prevent navigating

//     // const shareUrl = `${window.location.origin}/${post.location}/article/${post.slug}`;
// const shareUrl = post.location
//   ? `${window.location.origin}/${post.location}/article/${post.slug}`
//   : `${window.location.origin}/article/${post.slug}`;


//     const shareText = `Check out this post: ${post.title}`;

//     // ✅ Modern share API (mobile/modern browsers)
//     if (navigator.share) {
//       navigator.share({
//         title: post.title,
//         text: shareText,
//         url: shareUrl,
//       }).catch((err) => console.log("Share error:", err));
//     } else {
//       // ✅ Fallback (open share options)
//       const encodedUrl = encodeURIComponent(shareUrl);
//       const encodedText = encodeURIComponent(shareText);

//       const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
//       const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
//       const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

//       // Open in new tab (or show modal with options)
//       window.open(whatsapp, "_blank");
//       window.open(facebook, "_blank");
//       window.open(twitter, "_blank");
//     }
//   };


//   return (
//     <div
//       className="card mb-3 shadow-sm"
// onClick={() =>
//   navigate(
//     post.location
//       ? `/${post.location}/article/${post.slug}`
//       : `/article/${post.slug}`
//   )
// }

//       style={{ cursor: 'pointer', height: '120px', overflow: 'hidden' }}
//     >
//       <div className="row g-0 h-100">
//         <div className="col-4">
//           <img
//             src={post.image}
//             alt={post.title}
//             className="img-fluid w-100"
//            style={{
//     objectFit: 'contain',
//     objectPosition: 'center',
//     backgroundColor: '#fff',
//     height: 'auto',
//     maxHeight: '300px', // adjust based on your card design
//   }}
//           />
//         </div>
//         <div className="col-8">
//           <div className="card-body p-2">
//             <h6 className="card-title mb-1 fw-semibold">{post.title?.substring(0,36)}</h6>
//             {/* <p className="card-text text-muted small mb-1">
//               {post.description?.substring(0, 60)}
//             </p> */}
//             <small className="text-muted">
//              <small className="text-muted">#{post.category?.name || "General"}</small>
//              <br/>
//               By <strong>{post?.author ? (
//     <Link 
//       to={`/profile/${post.author._id}`}
//       className="text-decoration-none text-primary fw-medium mx-1"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {post.author.name}
//     </Link>
//   ) : (
//     <span className="fw-medium mx-1">Unknown</span>
//   )}</strong> • {timeago.format(post.createdAt)}
            
//             </small>

//                             {/* Like + Share Buttons */}
//                       <div className="d-flex align-items-center gap-3">
//                         <FaHeart 
//                           onClick={handleLike}
//                           style={{ 
//                             cursor: "pointer", 
//                             color: liked ? "red" : "gray", 
//                             fontSize: "18px" 
//                           }} 
//                         />
//                         <FaShareAlt 
//                           onClick={handleShare}
//                           style={{ cursor: "pointer", fontSize: "18px", color: "gray" }} 
//                         />
//                       </div>
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MiniCard;



// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import * as timeago from 'timeago.js';
// import { 
//   FaHeart, 
//   FaShareAlt, 
//   FaComment, 
//   FaBookmark,
//   FaEllipsisV,
//   FaTimes,
//   FaFacebook,
//   FaTwitter,
//   FaWhatsapp,
//   FaLink,
//   FaExternalLinkAlt
// } from "react-icons/fa";
// import { FiHeart, FiMessageCircle } from 'react-icons/fi';
// import LikeButton from './LikeButton'; 

// const MiniCard = ({ post, showCloseButton = false, onClose, isCompact = false }) => {
//   const navigate = useNavigate();
//   const [liked, setLiked] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);

//   const handleCardClick = () => {
//     navigate(
//       post.location
//         ? `/${post.location}/article/${post.slug}`
//         : `/article/${post.slug}`
//     );
//   };

//   const handleLike = (e) => {
//     e.stopPropagation();
//     setLiked(!liked);
//     // You can integrate with your LikeButton component logic here
//   };

//   const handleSave = (e) => {
//     e.stopPropagation();
//     setSaved(!saved);
//   };

//   const handleShare = (e) => {
//     e.stopPropagation();
//     setShowShareModal(true);
//   };

//   const handleShareClick = (platform) => {
//     const shareUrl = post.location
//       ? `${window.location.origin}/${post.location}/article/${post.slug}`
//       : `${window.location.origin}/article/${post.slug}`;

//     const shareText = `Check out this post: ${post.title}`;
//     const encodedUrl = encodeURIComponent(shareUrl);
//     const encodedText = encodeURIComponent(shareText);

//     const platforms = {
//       whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
//       twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
//     };

//     if (platform === 'copy') {
//       navigator.clipboard.writeText(shareUrl);
//       alert('Link copied to clipboard!');
//       return;
//     }

//     window.open(platforms[platform], '_blank');
//     setShowShareModal(false);
//   };

//   const handleAuthorClick = (e) => {
//     e.stopPropagation();
//     if (post?.author?._id) {
//       navigate(`/dashboard/user/profile/${user._id}`);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
//     if (diffHours < 24) {
//       return timeago.format(date);
//     } else {
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         year: diffHours > 24 * 30 ? 'numeric' : undefined
//       });
//     }
//   };

//   if (isCompact) {
//     return (
//       <div className="relative group">
//         {showCloseButton && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onClose?.();
//             }}
//             className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
//           >
//             <FaTimes className="text-gray-600" size={14} />
//           </button>
//         )}
        
//         <div
//           className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white"
//           onClick={handleCardClick}
//         >
//           <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
//             <img
//               src={post.image}
//               alt={post.title}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=No+Image';
//               }}
//             />
//           </div>
          
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between">
//               <h6 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
//                 {post.title}
//               </h6>
//               {showOptions && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowOptions(false);
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FaEllipsisV size={12} />
//                 </button>
//               )}
//             </div>
            
//             <div className="flex items-center gap-2 text-xs text-gray-500">
//               <span className="px-2 py-0.5 bg-gray-100 rounded-full">
//                 {post.category?.name || "General"}
//               </span>
//               <span>•</span>
//               <span>{formatDate(post.createdAt)}</span>
//             </div>
            
//             {post?.author && (
//               <div className="flex items-center gap-2 mt-2">
//                 <div className="flex items-center gap-1.5">
//                   <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
//                   <span 
//                     onClick={handleAuthorClick}
//                     className="text-xs font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
//                   >
//                     {post.author.name}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="relative group">
//         {showCloseButton && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onClose?.();
//             }}
//             className="absolute -top-2 -right-2 z-20 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
//           >
//             <FaTimes className="text-gray-700" size={16} />
//           </button>
//         )}
        
//         <div
//           className="card overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
//           onClick={handleCardClick}
//           style={{ 
//             maxHeight: '280px',
//             minHeight: '250px'
//           }}
//         >
//           <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//             <img
//               src={post.image}
//               alt={post.title}
//               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/400x160/CCCCCC/FFFFFF?text=Featured+Image';
//               }}
//             />
//             <div className="absolute top-3 left-3">
//               <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
//                 {post.category?.name || "General"}
//               </span>
//             </div>
            
//             <div className="absolute top-3 right-3 flex gap-2">
//               <button
//                 onClick={handleSave}
//                 className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
//               >
//                 <FaBookmark 
//                   className={saved ? "text-blue-600" : "text-gray-600"} 
//                   size={14}
//                 />
//               </button>
//             </div>
//           </div>
          
//           <div className="p-4">
//             <div className="flex items-start justify-between mb-2">
//               <h6 className="text-base font-bold text-gray-900 line-clamp-2 flex-1 pr-2">
//                 {post.title}
//               </h6>
              
//               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <button
//                   onClick={handleShare}
//                   className="text-gray-500 hover:text-blue-600 p-1"
//                 >
//                   <FaShareAlt size={14} />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowOptions(!showOptions);
//                   }}
//                   className="text-gray-500 hover:text-gray-700 p-1"
//                 >
//                   <FaEllipsisV size={14} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {post?.author && (
//                   <div 
//                     className="flex items-center gap-2 group/author"
//                     onClick={handleAuthorClick}
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
//                       {post.author.name?.charAt(0).toUpperCase() || 'U'}
//                     </div>
//                     <span className="text-sm font-medium text-gray-700 group-hover/author:text-blue-600 transition-colors cursor-pointer">
//                       {post.author.name}
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               <span className="text-xs text-gray-500">
//                 {formatDate(post.createdAt)}
//               </span>
//             </div>
            
//             {/* Stats Bar */}
//             <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
//               <div className="flex items-center gap-6">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={handleLike}
//                     className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors"
//                   >
//                     {liked ? (
//                       <FaHeart className="text-red-500" />
//                     ) : (
//                       <FiHeart />
//                     )}
//                     <span className="text-xs font-medium">
//                       {post.likesCount || 0}
//                     </span>
//                   </button>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors">
//                     <FiMessageCircle />
//                     <span className="text-xs font-medium">
//                       {post.commentsCount || 0}
//                     </span>
//                   </button>
//                 </div>
                
//                 <div className="text-xs text-gray-500">
//                   {post.readTime || '3 min read'}
//                 </div>
//               </div>
              
//               {/* LikeButton integration */}
//               <LikeButton 
//                 postId={post._id}
//                 initialLikes={post.likesCount || 0}
//                 onLike={handleLike}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Share Modal */}
//       {showShareModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div 
//             className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scale-in"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-bold text-gray-900">Share this post</h3>
//                 <button
//                   onClick={() => setShowShareModal(false)}
//                   className="text-gray-400 hover:text-gray-600 p-2"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>
              
//               <div className="mb-6">
//                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
//                   <img
//                     src={post.image}
//                     alt={post.title}
//                     className="w-16 h-16 rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-900 line-clamp-2">
//                       {post.title}
//                     </h4>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {window.location.hostname}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//                   <FaLink className="text-gray-400" />
//                   <input
//                     type="text"
//                     readOnly
//                     value={post.location ? `${window.location.origin}/${post.location}/article/${post.slug}` : `${window.location.origin}/article/${post.slug}`}
//                     className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700"
//                   />
//                   <button
//                     onClick={() => handleShareClick('copy')}
//                     className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 bg-blue-50 rounded-lg"
//                   >
//                     Copy
//                   </button>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-4 gap-4">
//                 <button
//                   onClick={() => handleShareClick('whatsapp')}
//                   className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-green-50 transition-colors"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
//                     <FaWhatsapp className="text-green-600" size={24} />
//                   </div>
//                   <span className="text-xs font-medium text-gray-700">WhatsApp</span>
//                 </button>
                
//                 <button
//                   onClick={() => handleShareClick('facebook')}
//                   className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 transition-colors"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                     <FaFacebook className="text-blue-600" size={24} />
//                   </div>
//                   <span className="text-xs font-medium text-gray-700">Facebook</span>
//                 </button>
                
//                 <button
//                   onClick={() => handleShareClick('twitter')}
//                   className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 transition-colors"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                     <FaTwitter className="text-blue-600" size={24} />
//                   </div>
//                   <span className="text-xs font-medium text-gray-700">Twitter</span>
//                 </button>
                
//                 <button
//                   onClick={() => handleShareClick('copy')}
//                   className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
//                     <FaLink className="text-gray-600" size={24} />
//                   </div>
//                   <span className="text-xs font-medium text-gray-700">Copy Link</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default MiniCard;













// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import * as timeago from 'timeago.js';
// import { 
//   FaHeart, 
//   FaShareAlt, 
//   FaBookmark, 
//   FaComment,
//   FaRegHeart,
//   FaRegBookmark,
//   FaRegComment,
//   FaUserCircle,
//   FaTimes,
//   FaExternalLinkAlt,
//   FaWhatsapp,
//   FaFacebook,
//   FaTwitter,
//   FaLink
// } from "react-icons/fa";
// import { MdLocationOn } from 'react-icons/md';
// import LikeButton from './LikeButton.jsx';
// import { useAuth } from '../context/auth.jsx';

// const MiniCard = ({ post, showCloseButton = false, onClose, className = '' }) => {
//   const navigate = useNavigate();
//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const [auth] = useAuth();
//   const userId = auth?.user?._id;

//   // Smart date formatting
//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / (1000 * 60));
//       const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//       const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
//       if (diffMins < 1) return 'Just now';
//       if (diffMins < 60) return `${diffMins}m ago`;
//       if (diffHours < 24) return `${diffHours}h ago`;
//       if (diffDays < 7) return `${diffDays}d ago`;
      
//       return date.toLocaleDateString('en-US', { 
//         month: 'short', 
//         day: 'numeric',
//         year: diffDays > 30 ? 'numeric' : undefined
//       });
//     } catch {
//       return timeago.format(dateString);
//     }
//   };

//   // Handle image load
//   const handleImageLoad = () => {
//     setImageLoaded(true);
//     setImageError(false);
//   };

//   const handleImageError = () => {
//     setImageLoaded(false);
//     setImageError(true);
//   };

//   // Handle interactions
//   const handleLike = (e) => {
//     e.stopPropagation();
//     setLiked(!liked);
//   };

//   const handleBookmark = (e) => {
//     e.stopPropagation();
//     setBookmarked(!bookmarked);
//     // TODO: Implement bookmark API call
//   };

//   const handleShare = (e) => {
//     e.stopPropagation();
//     setShowShareModal(true);
//   };

//   const handleCardClick = () => {
//     navigate(`/article/${encodeURIComponent(post.slug)}`);
//   };

//   const handleAuthorClick = (e) => {
//     e.stopPropagation();
//     if (post?.author?._id) {
//       navigate(`/profile/${post.author._id}`);
//     }
//   };

//   // Share functions
//   const shareOnPlatform = (platform) => {
//     const shareUrl = `${window.location.origin}/article/${post.slug}`;
//     const shareText = `Check out: ${post.title}`;
//     const encodedUrl = encodeURIComponent(shareUrl);
//     const encodedText = encodeURIComponent(shareText);
    
//     const urls = {
//       whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
//       facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
//       twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
//     };
    
//     window.open(urls[platform], '_blank');
//     setShowShareModal(false);
//   };

//   const copyToClipboard = async () => {
//     const shareUrl = `${window.location.origin}/article/${post.slug}`;
//     await navigator.clipboard.writeText(shareUrl);
//     // You can add a toast notification here
//     alert('Link copied to clipboard!');
//     setShowShareModal(false);
//   };

//   // Get author avatar
//   const getAuthorAvatar = () => {
//     if (post?.author?.profilePicture) {
//       return post.author.profilePicture;
//     }
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(post?.author?.name || 'User')}&background=random&color=fff&bold=true`;
//   };

//   // Get author initials
//   const getAuthorInitials = () => {
//     if (!post?.author?.name) return 'U';
//     return post.author.name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Calculate read time
//   const calculateReadTime = (text) => {
//     const words = text?.split(/\s+/)?.length || 0;
//     const minutes = Math.ceil(words / 200);
//     return `${minutes} min read`;
//   };

//   return (
//     <>
//       {/* Main Card */}
//       <div 
//         className={`card border-0 shadow-sm hover-shadow position-relative overflow-hidden transition-all ${className}`}
//         style={{ 
//           cursor: 'pointer',
//           transition: 'all 0.3s ease',
//           height: '140px',
//           maxHeight: '140px'
//         }}
//         onClick={handleCardClick}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Close Button */}
//         {showCloseButton && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onClose?.();
//             }}
//             className="btn btn-sm btn-light rounded-circle position-absolute"
//             style={{
//               top: '8px',
//               right: '8px',
//               zIndex: 10,
//               width: '28px',
//               height: '28px',
//               padding: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               opacity: isHovered ? 1 : 0.7,
//               transition: 'all 0.3s ease',
//               boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
//             }}
//           >
//             <FaTimes className="text-secondary" size={12} />
//           </button>
//         )}

//         <div className="row g-0 h-100">
//           {/* Image Column */}
//           <div className="col-4 position-relative">
//             <div 
//               className="h-100 w-100 position-relative overflow-hidden"
//               style={{ 
//                 backgroundColor: '#f8f9fa',
//                 minHeight: '140px'
//               }}
//             >
//               <img
//                 src={post.image || 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Post+Image'}
//                 alt={post.title}
//                 className={`w-100 h-100 ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
//                 style={{
//                   objectFit: 'cover',
//                   transition: 'transform 0.5s ease, opacity 0.3s ease',
//                   transform: isHovered ? 'scale(1.05)' : 'scale(1)'
//                 }}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//                 loading="lazy"
//               />
              
//               {/* Image overlay on hover */}
//               <div 
//                 className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
//                 style={{
//                   opacity: isHovered ? 0.1 : 0,
//                   transition: 'opacity 0.3s ease',
//                   pointerEvents: 'none'
//                 }}
//               />
              
//               {/* Category badge */}
//               {post.category && (
//                 <span 
//                   className="badge position-absolute top-0 start-0 m-2"
//                   style={{
//                     backgroundColor: 'rgba(255,255,255,0.95)',
//                     color: '#495057',
//                     fontSize: '10px',
//                     fontWeight: '600',
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.5px'
//                   }}
//                 >
//                   {post.category.name || 'General'}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Content Column */}
//           <div className="col-8">
//             <div className="card-body h-100 d-flex flex-column p-3">
//               {/* Title */}
//               <h6 
//                 className="card-title mb-1 fw-bold text-dark"
//                 style={{
//                   fontSize: '14px',
//                   lineHeight: '1.3',
//                   display: '-webkit-box',
//                   WebkitLineClamp: 2,
//                   WebkitBoxOrient: 'vertical',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis'
//                 }}
//               >
//                 {post.title}
//               </h6>

//               {/* Author & Date */}
//               <div className="d-flex align-items-center mb-2">
//                 {/* Author Avatar */}
//                 <div 
//                   className="rounded-circle overflow-hidden me-2"
//                   style={{
//                     width: '24px',
//                     height: '24px',
//                     flexShrink: 0
//                   }}
//                   onClick={handleAuthorClick}
//                 >
//                   <img
//                     src={getAuthorAvatar()}
//                     alt={post.author?.name}
//                     className="w-100 h-100 object-fit-cover"
//                     style={{
//                       objectFit: 'cover'
//                     }}
//                   />
//                 </div>
                
//                 <div className="d-flex flex-column">
//                   {post.author ? (
//                     <Link
//                       to={`/profile/${post.author._id}`}
//                       onClick={(e) => e.stopPropagation()}
//                       className="text-decoration-none"
//                       style={{
//                         fontSize: '12px',
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         lineHeight: '1.2'
//                       }}
//                     >
//                       {post.author.name}
//                     </Link>
//                   ) : (
//                     <span className="text-muted" style={{ fontSize: '12px' }}>Unknown</span>
//                   )}
                  
//                   <div className="d-flex align-items-center gap-2 mt-1">
//                     <small className="text-muted" style={{ fontSize: '10px' }}>
//                       {formatDate(post.createdAt)}
//                     </small>
                    
//                     {/* Location */}
//                     {post.location && (
//                       <>
//                         <span className="text-muted" style={{ fontSize: '8px' }}>•</span>
//                         <small 
//                           className="text-muted d-flex align-items-center gap-1"
//                           style={{ fontSize: '10px' }}
//                         >
//                           <MdLocationOn size={8} />
//                           {post.location}
//                         </small>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Description (hidden on small cards) */}
//               {post.description && (
//                 <p 
//                   className="text-muted mb-2"
//                   style={{
//                     fontSize: '11px',
//                     lineHeight: '1.4',
//                     display: '-webkit-box',
//                     WebkitLineClamp: 2,
//                     WebkitBoxOrient: 'vertical',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis'
//                   }}
//                 >
//                   {post.description}
//                 </p>
//               )}

//               {/* Stats & Actions */}
//               <div className="mt-auto d-flex align-items-center justify-content-between">
//                 {/* Stats */}
//                 <div className="d-flex align-items-center gap-3">
//                   {/* Likes */}
//                   <div className="d-flex align-items-center gap-1">
//                     <LikeButton
//                       postId={post._id}
//                       initialLiked={Boolean(userId && post.likes?.includes(userId))}
//                       initialCount={post.likes?.length || 0}
//                       size="sm"
//                       showCount
//                       className="text-decoration-none"
//                     />
//                   </div>
                  
//                   {/* Comments */}
//                   <div 
//                     className="d-flex align-items-center gap-1 text-muted"
//                     style={{ fontSize: '12px' }}
//                   >
//                     <FaRegComment size={12} />
//                     <span className="fw-medium" style={{ fontSize: '11px' }}>
//                       {post.comments?.length || 0}
//                     </span>
//                   </div>
                  
//                   {/* Read Time */}
//                   <small className="text-muted" style={{ fontSize: '10px' }}>
//                     {calculateReadTime(post.description)}
//                   </small>
//                 </div>

//                 {/* Actions */}
//                 <div className="d-flex align-items-center gap-2">
//                   {/* Bookmark */}
//                   <button
//                     onClick={handleBookmark}
//                     className="btn btn-link p-0 text-decoration-none"
//                     style={{
//                       color: bookmarked ? '#0d6efd' : '#6c757d',
//                       fontSize: '14px',
//                       lineHeight: 1
//                     }}
//                   >
//                     {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
//                   </button>
                  
//                   {/* Share */}
//                   <button
//                     onClick={handleShare}
//                     className="btn btn-link p-0 text-decoration-none"
//                     style={{
//                       color: '#6c757d',
//                       fontSize: '14px',
//                       lineHeight: 1
//                     }}
//                   >
//                     <FaShareAlt />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Share Modal */}
//       {showShareModal && (
//         <div 
//           className="modal show d-block"
//           style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
//           onClick={() => setShowShareModal(false)}
//         >
//           <div 
//             className="modal-dialog modal-dialog-centered"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content border-0 shadow-lg">
//               {/* Modal Header */}
//               <div className="modal-header border-0 pb-0">
//                 <h5 className="modal-title fw-bold">Share this post</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowShareModal(false)}
//                 />
//               </div>

//               {/* Modal Body */}
//               <div className="modal-body">
//                 {/* Post Preview */}
//                 <div className="card border mb-4">
//                   <div className="row g-0 align-items-center">
//                     <div className="col-3">
//                       <img
//                         src={post.image || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Post'}
//                         alt={post.title}
//                         className="img-fluid rounded-start"
//                         style={{ height: '80px', objectFit: 'cover' }}
//                       />
//                     </div>
//                     <div className="col-9">
//                       <div className="card-body p-2">
//                         <h6 className="card-title mb-1" style={{ fontSize: '14px' }}>
//                           {post.title?.substring(0, 60)}...
//                         </h6>
//                         <p className="card-text text-muted mb-0" style={{ fontSize: '12px' }}>
//                           {window.location.hostname}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Link Copy Section */}
//                 <div className="input-group mb-4">
//                   <input
//                     type="text"
//                     className="form-control form-control-sm"
//                     value={`${window.location.origin}/article/${post.slug}`}
//                     readOnly
//                     style={{ fontSize: '12px' }}
//                   />
//                   <button
//                     className="btn btn-primary btn-sm"
//                     type="button"
//                     onClick={copyToClipboard}
//                   >
//                     <FaLink className="me-1" />
//                     Copy
//                   </button>
//                 </div>

//                 {/* Share Options */}
//                 <div className="row g-3 text-center">
//                   <div className="col-4">
//                     <button
//                       className="btn btn-light w-100 py-3 border"
//                       onClick={() => shareOnPlatform('whatsapp')}
//                     >
//                       <div className="mb-2">
//                         <FaWhatsapp size={24} className="text-success" />
//                       </div>
//                       <small className="d-block fw-medium">WhatsApp</small>
//                     </button>
//                   </div>
                  
//                   <div className="col-4">
//                     <button
//                       className="btn btn-light w-100 py-3 border"
//                       onClick={() => shareOnPlatform('facebook')}
//                     >
//                       <div className="mb-2">
//                         <FaFacebook size={24} className="text-primary" />
//                       </div>
//                       <small className="d-block fw-medium">Facebook</small>
//                     </button>
//                   </div>
                  
//                   <div className="col-4">
//                     <button
//                       className="btn btn-light w-100 py-3 border"
//                       onClick={() => shareOnPlatform('twitter')}
//                     >
//                       <div className="mb-2">
//                         <FaTwitter size={24} className="text-info" />
//                       </div>
//                       <small className="d-block fw-medium">Twitter</small>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Direct Share API (for mobile) */}
//                 {navigator.share && (
//                   <button
//                     className="btn btn-outline-primary w-100 mt-4"
//                     onClick={() => {
//                       navigator.share({
//                         title: post.title,
//                         text: `Check out: ${post.title}`,
//                         url: `${window.location.origin}/article/${post.slug}`
//                       });
//                       setShowShareModal(false);
//                     }}
//                   >
//                     <FaExternalLinkAlt className="me-2" />
//                     Share via...
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default MiniCard;






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
    if (post?.author?.profilePicture) {
      return post.author.profilePicture;
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
                  ? 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=TrendKari' 
                  : post.image || 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=TrendKari'
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