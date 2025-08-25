import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Layout/Layout';
import MiniCard from '../Components/MiniCard';
import API from '../../utils/api';
import * as timeago from 'timeago.js';
import { useAuth } from '../context/auth';
import { FaHeart, FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";


const BlogDetail = () => {
  const { slug } = useParams();
  const [auth] = useAuth(); 
  const [post, setPost] = useState(null);
  const [sameCategoryPosts, setSameCategoryPosts] = useState([]);
  const [otherCategoryPosts, setOtherCategoryPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  
  
     const handleLike = (e) => {
    e.stopPropagation(); // prevent navigating
    setLiked(!liked);
  };

   const handleShare = (e) => {
    e.stopPropagation(); // prevent navigating

    const shareUrl = `${window.location.origin}/blog/${post.slug}`;
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


    const handleDelete = async () => {

    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    const token = localStorage.getItem("token");

    try {
      const res = await API.delete(`post/delete-post/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post deleted successfully!");
        window.location.reload(); 
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting post");
    }
  };


  ///Fetching the post by slug
  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/post/get-post/${slug}`);
      console.log("Current User ID:", auth?.user?._id);
console.log("Post Author ID:", post?.author?._id || post?.author);
      console.log("Post Data:", data);

      if (data?.success) {
        setPost(data?.post);
        fetchRelatedPosts(data.post.category._id);
      }
    } catch (err) {
      console.log('Error fetching blog post:', err);
    }
  };
    


  const fetchRelatedPosts = async () => {
  try {
    const { data } = await API.get('/post/get-posts');
    if (data?.success) {
      const posts = data.posts;

      // Find current post by slug
      const currentPost = posts.find(p => p.slug === slug);
      if (!currentPost) {
        console.warn('Current post not found in all posts');
        return;
      }

      const currentCategoryId = currentPost.category._id;
      console.log('Current Post Category ID:', currentCategoryId);

      // Filter out the current post
      const otherPosts = posts.filter(p => p.slug !== slug);

      const sameCategory = otherPosts.filter(
        p => p.category._id === currentCategoryId
      ).slice(0, 4);

      const otherCategory = otherPosts.filter(
        p => p.category._id !== currentCategoryId
      ).slice(0, 6);

      setSameCategoryPosts(sameCategory);
      setOtherCategoryPosts(otherCategory);

      // Debug logs
      console.log('Same Category Posts:', sameCategory);
      console.log('Other Category Posts:', otherCategory);
    }
  } catch (err) {
    console.error('Error fetching related posts:', err);
  }
};


  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  if (!post) {
    return (
      <Layout>
        <div className="container text-center mt-5">Loading blog post...</div>
      </Layout>
    );
  }

              const currentUser = JSON.parse(localStorage.getItem("user")); // Logged-in user

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <h1 className="fw-bold mb-3">{post.title}</h1>
            <p className="text-muted">
              {post.category?.name} • {post?.author?.name || 'Trendkari'} • {timeago.format(post.createdAt)}
            </p>

                     {/* Like + Share Buttons */}
                                  {/* <div className="d-flex align-items-center gap-3"> */}
                                   
                                    <FaShareAlt 
                                      onClick={handleShare}
                                      style={{ cursor: "pointer", fontSize: "18px", color: "gray" }} 
                                    />
                                  {/* </div> */}

            {currentUser && post.author === currentUser._id && (
  <div className="btn-group">
    {/* <button onClick={handleEdit}>Edit</button> */}
    <button onClick={handleDelete}>Delete</button>
  </div>
)}
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="img-fluid rounded mb-4"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            )}
            <div  
              className="blog-content mb-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>

            {/* Comment Section */}
            <div className="col-md-8 mb-5">
              <h4>Comments</h4>
              <form onSubmit={handleCommentSubmit} className="mb-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Write a comment..."
                ></textarea>
                <button className="btn btn-primary" type="submit">Post Comment</button>
              </form>
              <ul className="list-group">
                {comments.map((c, i) => (
                  <li key={i} className="list-group-item">{c}</li>
                ))}
              </ul>

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

            

            {/* More From Same Category */}
            <div className="mb-5">
              <h4>More from {post.category?.name}</h4>
              <div className="row">
                {sameCategoryPosts.map((p) => (
                  <div className="col-md-6 mb-3" key={p._id}>
                    <MiniCard post={p} />
                  </div>
                ))}
              </div>
            </div>

            {/* Other Trending Categories */}
            <div>
              <h4>Explore Other Categories</h4>
              <div className="row">
                {otherCategoryPosts.map((p) => (
                  <div className="col-md-6 mb-3" key={p._id}>
                    <MiniCard post={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-md-4">
            <h5>Latest Trends</h5>
            {otherCategoryPosts.slice(0, 8).map((p) => (
              <MiniCard post={p} key={p._id} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// const MiniCard = ({ post }) => (
//   <div className="card mb-3">
//     {post.image && (
//       <img
//         src={post.image}
//         alt={post.title}
//         className="card-img-top"
//         style={{ height: '150px', objectFit: 'cover' }}
//       />
//     )}
//     <div className="card-body">
//       <h6 className="card-title mb-1">{post.title}</h6>
//       <p className="card-text text-muted small">#{post.category?.name}</p>
//     </div>
//   </div>
// );

export default BlogDetail;
