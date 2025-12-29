import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import MiniCard from '../Components/MiniCard';
import API from '../../utils/api';
import * as timeago from 'timeago.js';
import { useAuth } from '../context/auth';
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { Helmet } from 'react-helmet';
import AdBanner from '../Components/AdBanner';

const BlogDetail = () => {
  const { slug } = useParams();
  const [auth] = useAuth(); 
  const [post, setPost] = useState(null);
  const [sameCategoryPosts, setSameCategoryPosts] = useState([]);
  const [otherCategoryPosts, setOtherCategoryPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user")); // Logged-in user

  // 🔹 LIKE TOGGLE
  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  // 🔹 SHARE
  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/blog/${post.slug}`;
    const shareText = `Check out this post: ${post.title}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.log("Share error:", err));
    } else {
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);
      const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
      window.open(whatsapp, "_blank");
      window.open(facebook, "_blank");
      window.open(twitter, "_blank");
    }
  };

  // 🔹 DELETE POST
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      await API.delete(`post/delete-post/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted successfully!");
      window.location.href = "/"; 
    } catch (error) {
      console.error(error);
      alert("Error deleting post");
    }
  };

  // 🔹 FETCH SINGLE POST
  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/post/get-post/${slug}`);
      if (data?.success) {
        setPost(data.post);
        fetchRelatedPosts(data.post.category._id);
      }
    } catch (err) {
      console.log('Error fetching blog post:', err);
    }
  };

  // 🔹 FETCH RELATED POSTS
  const fetchRelatedPosts = async () => {
    try {
      const { data } = await API.get('/post/get-posts');
      if (data?.success) {
        const posts = data.posts;
        const currentPost = posts.find(p => p.slug === slug);
        if (!currentPost) return;

        const currentCategoryId = currentPost.category._id;
        const otherPosts = posts.filter(p => p.slug !== slug);

        const sameCategory = otherPosts.filter(
          p => p.category._id === currentCategoryId
        ).slice(0, 4);

        const otherCategory = otherPosts.filter(
          p => p.category._id !== currentCategoryId
        ).slice(0, 6);

        setSameCategoryPosts(sameCategory);
        setOtherCategoryPosts(otherCategory);
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
    }
  };

  // 🔹 FETCH COMMENTS
  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/posts/${slug}/comments`);
      setComments(data.items || []);   // ✅ use items array
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // 🔹 SUBMIT COMMENT
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post(
        `/posts/${slug}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // backend likely returns {ok:true, comment:{...}}
      setComments([data.comment, ...comments]); // prepend new comment
      setComment('');
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // 🔹 CALL FETCHERS
  useEffect(() => {
    fetchPost();
    fetchComments();  // ✅ added this
  }, [slug]);

  if (!post) {
    return (
      <Layout>
        <div className="container text-center mt-5">Loading blog post...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <h1 className="fw-bold mb-3">{post.title}</h1>

          {/* <AdBanner/> */}
            <p className="text-muted">
              <div className="post-meta text-muted mb-2">
  {post.category?.name && (
    <>
      <span className="category-badge bg-info text-white px-2 py-1 rounded me-2">
        {post.category.name}
      </span>
      • 
    </>
  )}
  
  {post?.author ? (
    <Link 
      to={`/profile/${post.author._id}`}
      className="text-decoration-none text-primary fw-medium mx-1"
      onClick={(e) => e.stopPropagation()}
    >
      {post.author.name}
    </Link>
  ) : (
    <span className="fw-medium mx-1">Trendkari</span>
  )}
  
  • 
  <span className="ms-1">{timeago.format(post.createdAt)}</span>
</div>  
            </p>

            {/* Share Button */}
            <FaShareAlt 
              onClick={handleShare}
              style={{ cursor: "pointer", fontSize: "18px", color: "gray" }} 
            />

            {/* Author Delete */}
            {currentUser && post.author === currentUser._id && (
              <div className="btn-group">
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}

            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="img-fluid rounded mb-4"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            )}

            {/* Post Content */}
            <div  
              className="blog-content mb-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>

            {/* ✅ Comment Section */}
            <div className="col-md-8 mb-5">
              <h4>Comments</h4>
              {auth?.user ? (
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
              ) : (
                <p>Please <a href="/login">login</a> to comment.</p>
              )}

              <ul className="list-group">
                {comments.map((c) => (
                  <li key={c._id} className="list-group-item">
                    <img 
                      src={c.author?.avatar} 
                      alt={c.author?.name} 
                      style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "8px" }}
                    />

{c.author ? (
  <Link 
    to={`/profile/${c.author._id}`}
    className="text-decoration-none text-primary fw-medium"
    onClick={(e) => e.stopPropagation()} // Prevent navigation if inside a clickable container
  >
    {c.author.name || "Anonymous"}
  </Link>
) : (
  <span className="fw-medium">Anonymous</span>
)}
: {c.content}
                  </li>
                ))}
              </ul>

              {/* Like + Share */}
              <div className="d-flex align-items-center gap-3 mt-3">
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

            {/* Same Category */}
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

            {/* Other Categories */}
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

          {/* Sidebar */}
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

export default BlogDetail;
