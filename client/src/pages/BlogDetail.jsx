import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import MiniCard from "../Components/MiniCard";
import API from "../../utils/api";
import * as timeago from "timeago.js";
import { useAuth } from "../context/auth";
import { FaHeart, FaShareAlt } from "react-icons/fa";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);

  const cities = [
  { name: "Kota", slug: "kota" },
  { name: "Ramganjmandi", slug: "ramganjmandi" },
  { name: "Ladpura", slug: "ladpura" },
  { name: "Sangod", slug: "sangod" },
  { name: "Rural Kota", slug: "rural-kota" }
];

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🔹 Fetch single post
  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/post/get-post/${slug}`);
      if (data?.success) {
        setPost(data.post);
        fetchRelated(data.post);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch related posts (same city + same category)
  const fetchRelated = async (currentPost) => {
    try {
      const { data } = await API.get(
        `/post/get-posts?location=${currentPost.location}&language=${currentPost.language}`
      );

      if (data?.success) {
        const filtered = data.posts.filter(
          (p) => p._id !== currentPost._id
        );

        setRelatedPosts(filtered.slice(0, 8));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  if (!post) {
    return (
      <Layout>
        <div className="container py-5 text-center">Loading article...</div>
      </Layout>
    );
  }

  // 🔹 Share
  const handleShare = () => {
    const url = `${window.location.origin}/${post.location}/article/${post.slug}`;
    navigator.share
      ? navigator.share({ title: post.title, url })
      : window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            post.title + " " + url
          )}`,
          "_blank"
        );
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          {/* MAIN */}
          <div className="col-md-8">
            <h1 className="fw-bold mb-3">{post.title}</h1>

            {/* META LINE */}
            <div className="text-muted mb-3 fs-6">
              <Link to={`/city/${post.location}`} className="text-decoration-none">
                📍 {post.location.replace("-", " ")}
              </Link>
              {" • "}
              <Link
                to={`/category/${post.category?.slug}`}
                className="text-decoration-none"
              >
                {post.category?.name}
              </Link>
              {" • "}
              <span>{post.language === "hi" ? "हिंदी" : "English"}</span>
              {" • "}
              {post.author && (
                <Link
                  to={`/profile/${post.author._id}`}
                  className="text-decoration-none"
                >
                  {post.author.name}
                </Link>
              )}
              {" • "}
              {timeago.format(post.createdAt)}
            </div>

            {/* IMAGE */}
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="img-fluid rounded mb-4"
              />
            )}

            {/* CONTENT */}
            <div
              className="blog-content mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* ACTIONS */}
            <div className="d-flex gap-4 text-muted mb-5">
              <FaHeart
                onClick={() => setLiked(!liked)}
                style={{
                  cursor: "pointer",
                  color: liked ? "red" : "gray",
                }}
              />
              <FaShareAlt
                onClick={handleShare}
                style={{ cursor: "pointer" }}
              />
            </div>

            {/* RELATED */}
            <h4 className="mb-3">
              More from {post.location.replace("-", " ")}
            </h4>

            <div className="row">
              {relatedPosts.map((p) => (
                <div className="col-md-6 mb-3" key={p._id}>
                  <MiniCard post={p} />
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-md-4">
            <h5 className="mb-3">Trending in {post.location}</h5>
            {relatedPosts.slice(0, 5).map((p) => (
              <MiniCard key={p._id} post={p} />
            ))}
          </div>

                          {/* Soft City Discovery */}
          <div className="mt-2">
            <p className="text-muted mb-2">Explore nearby</p>
          
            <div className="d-flex align-items-center gap-3 overflow-auto">
              {cities
                .filter(city => city.slug !== location)
                .map(city => (
                  <Link
                    key={city.slug}
                    to={`/city/${city.slug}`}
                    className="text-decoration-none text-secondary fw-medium fs-6 text-nowrap"
                  >
                    {city.name}
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
