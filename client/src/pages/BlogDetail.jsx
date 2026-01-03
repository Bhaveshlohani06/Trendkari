import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import MiniCard from "../Components/MiniCard";
import API from "../../utils/api";
import * as timeago from "timeago.js";
import { FaHeart, FaShareAlt } from "react-icons/fa";

const BlogDetail = () => {
  const { slug, location: routeLocation } = useParams();

  const [post, setPost] = useState(null);
  const [sameCityPosts, setSameCityPosts] = useState([]);
  const [otherCityPosts, setOtherCityPosts] = useState([]);
  const [liked, setLiked] = useState(false);

  const cities = [
    { name: "Kota", slug: "kota" },
    { name: "Ramganjmandi", slug: "ramganjmandi" },
    { name: "Ladpura", slug: "ladpura" },
    { name: "Sangod", slug: "sangod" },
    { name: "Rural Kota", slug: "rural-kota" },
  ];

  /* ================= FETCH POST ================= */
  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/post/get-post/${slug}`);
      if (data?.success) {
        setPost(data.post);
        fetchRelatedPosts(data.post);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH RELATED ================= */
  const fetchRelatedPosts = async (currentPost) => {
    try {
      const { data } = await API.get(`/post/get-posts?language=${currentPost.language || "hi"}`);

      if (data?.success) {
        const others = data.posts.filter(p => p._id !== currentPost._id);

        const sameCity = currentPost.location
          ? others.filter(p => p.location === currentPost.location).slice(0, 6)
          : [];

        const otherCities = others
          .filter(p => p.location && p.location !== currentPost.location)
          .slice(0, 8);

        setSameCityPosts(sameCity);
        setOtherCityPosts(otherCities);
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
        <div className="container py-5 text-center">Loading article…</div>
      </Layout>
    );
  }

  /* ================= SHARE ================= */
  const shareUrl = post.location
    ? `${window.location.origin}/${post.location}/article/${post.slug}`
    : `${window.location.origin}/article/${post.slug}`;

  const handleShare = () => {
    navigator.share
      ? navigator.share({ title: post.title, url: shareUrl })
      : window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " " + shareUrl)}`,
          "_blank"
        );
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          {/* ================= MAIN CONTENT ================= */}
          <div className="col-md-8">
            <h1 className="fw-bold mb-3">{post.title}</h1>

            {/* META BAR */}
            <div className="text-muted mb-3 small">
              {post.location && (
                <>
                  <Link to={`/city/${post.location}`} className="text-decoration-none">
                    📍 {post.location.replace("-", " ")}
                  </Link>{" "}
                  •{" "}
                </>
              )}

              {post.category && (
                <>
                  <Link to={`/category/${post.category.slug}`} className="text-decoration-none">
                    {post.category.name}
                  </Link>{" "}
                  •{" "}
                </>
              )}

              <span>{post.language === "hi" ? "हिंदी" : "English"}</span> •{" "}
              {post.author?.name || "Trendkari"} • {timeago.format(post.createdAt)}
            </div>

            {/* IMAGE */}
            {post.image && (
              <img src={post.image} alt={post.title} className="img-fluid rounded mb-4" />
            )}

            {/* CONTENT */}
            <div
              className="blog-content mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* ACTIONS */}
            <div className="d-flex gap-4 mb-5 text-muted">
              <FaHeart
                onClick={() => setLiked(!liked)}
                style={{ cursor: "pointer", color: liked ? "red" : "gray" }}
              />
              <FaShareAlt onClick={handleShare} style={{ cursor: "pointer" }} />
            </div>

            {/* ================= SAME CITY ================= */}
            {sameCityPosts.length > 0 && (
              <>
                <h4 className="mb-3">
                  More from {post.location.replace("-", " ")}
                </h4>
                <div className="row">
                  {sameCityPosts.map(p => (
                    <div className="col-md-6 mb-3" key={p._id}>
                      <MiniCard post={p} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ================= OTHER CITIES ================= */}
            {otherCityPosts.length > 0 && (
              <>
                <h4 className="mt-5 mb-3">Trending Across Other Cities</h4>
                <div className="row">
                  {otherCityPosts.map(p => (
                    <div className="col-md-6 mb-3" key={p._id}>
                      <MiniCard post={p} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="col-md-4">
            <h6 className="text-muted mb-3">Explore Cities</h6>
            <div className="d-flex flex-wrap gap-3">
              {cities
                .filter(city => city.slug !== post.location)
                .map(city => (
                  <Link
                    key={city.slug}
                    to={`/city/${city.slug}`}
                    className="text-decoration-none text-secondary fw-medium"
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
