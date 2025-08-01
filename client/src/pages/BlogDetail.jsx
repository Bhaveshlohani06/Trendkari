import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Layout/Layout';
import MiniCard from '../Components/MiniCard';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [sameCategoryPosts, setSameCategoryPosts] = useState([]);
  const [otherCategoryPosts, setOtherCategoryPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/api/v1/post/get-post/${slug}`);
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
    const { data } = await axios.get('/api/v1/post/get-posts');
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

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <h1 className="fw-bold mb-3">{post.title}</h1>
            <p className="text-muted">
              {post.category?.name} • {post.author || 'Trendkari'}
            </p>
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
