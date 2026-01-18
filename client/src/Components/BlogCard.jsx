// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import * as timeago from 'timeago.js';
// import { FaHeart, FaShareAlt } from "react-icons/fa";

// const BlogCard = ({ post }) => {
//   const navigate = useNavigate();
//   const [liked, setLiked] = useState(false);

//   const handleLike = (e) => {
//     e.stopPropagation();
//     setLiked(!liked);
//   };

//   const handleShare = (e) => {
//     e.stopPropagation();

//     const shareUrl = `${window.location.origin}/article/${post.slug}`;
//     const shareText = `Check out this post: ${post.title}`;

//     if (navigator.share) {
//       navigator.share({
//         title: post.title,
//         text: shareText,
//         url: shareUrl,
//       }).catch(() => {});
//     } else {
//       const encodedUrl = encodeURIComponent(shareUrl);
//       const encodedText = encodeURIComponent(shareText);
//       window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, "_blank");
//     }
//   };

//   return (
//     <div
//       className="card h-100 shadow-sm border-0 d-flex flex-column"
//       onClick={() => navigate(`/article/${ encodeURIComponent(post.slug)}`)}
//       style={{ cursor: "pointer" }}
//     >
     
//       {/* Image (fixed ratio) */}
//       <div className="ratio ratio-16x9">
//         <img
//           src={post.image}
//           alt={post.title}
//           className="card-img-top object-fit-cover"
//         />
//       </div>

//       {/* Content */}
//       <div className="card-body d-flex flex-column">
//         <h6 className="fw-bold clamp-2 mb-2">
//           {post.title}
//         </h6>

//         <p className="text-muted small clamp-2 mb-3">
//           {post.description}
//         </p>

//         {/* Footer pinned at bottom */}
//         <div className="mt-auto d-flex justify-content-between align-items-center">
//           <small className="text-muted">
//             By{" "}
//             {post?.author ? (
//               <Link
//                 to={`/profile/${post.author._id}`}
//                 className="text-decoration-none fw-medium"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {post.author.name}
//               </Link>
//             ) : (
//               "Unknown"
//             )}{" "}
//             • {timeago.format(post.createdAt)}
//           </small>

//           <div className="d-flex align-items-center gap-3">
//             <FaHeart
//               onClick={handleLike}
//               style={{
//                 cursor: "pointer",
//                 color: liked ? "red" : "#aaa",
//               }}
//             />
//             <FaShareAlt
//               onClick={handleShare}
//               style={{ cursor: "pointer", color: "#aaa" }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogCard;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as timeago from 'timeago.js';
import { FaHeart, FaShareAlt, FaBookmark } from "react-icons/fa";

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/article/${post.slug}`;
    const shareText = `Check out this post: ${post.title}`;

    if (navigator.share) {
      navigator.share({ title: post.title, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);
      window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, "_blank");
    }
  };

  return (
    <div
      className="card h-100 shadow-sm border-0 d-flex flex-column"
      onClick={() => navigate(`/article/${ encodeURIComponent(post.slug)}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Image */}
      <div className="ratio ratio-16x9">
        <img
          src={post.image}
          alt={post.title}
          className="card-img-top object-fit-cover"
        />
      </div>

      {/* Content */}
      <div className="card-body d-flex flex-column">
        <h6 className="fw-bold clamp-2 mb-1">{post.title}</h6>
        <small className="text-muted d-block mb-1">
          📍 {post.location} • {timeago.format(post.createdAt)}
        </small>
        <p className="text-muted small clamp-2 mb-3">{post.description}</p>

        {/* Footer pinned at bottom */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By{" "}
            {post?.author ? (
              <Link
                to={`/profile/${post.author._id}`}
                className="text-decoration-none fw-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {post.author.name}
              </Link>
            ) : "Unknown"}
          </small>

          <div className="d-flex align-items-center gap-3">
            <FaHeart
              onClick={handleLike}
              style={{ cursor: "pointer", color: liked ? "red" : "#aaa" }}
            />
            <FaBookmark
              onClick={handleBookmark}
              style={{ cursor: "pointer", color: bookmarked ? "#0d6efd" : "#aaa" }}
            />
            <FaShareAlt
              onClick={handleShare}
              style={{ cursor: "pointer", color: "#aaa" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
