import React, { useEffect, useState, useRef } from "react";
import "../../css/Swipe.css";
import API from "../../utils/api";

const SwipeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);
  const observer = useRef();
  const isScrolling = useRef(false);

  // 🔥 FETCH POSTS
  const fetchPosts = async (pageNo = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const { data } = await API.get(
        `/post/get-posts?status=approved&page=${pageNo}&limit=8`
      );

      if (!data?.posts || data.posts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...data.posts]);
      setPage(pageNo + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  // 🔥 SCROLL TO INDEX (CORE ENGINE)
  const goToIndex = (index) => {
    if (index < 0 || index >= posts.length) return;
    if (isScrolling.current) return;

    isScrolling.current = true;

    const container = containerRef.current;
    const height = window.innerHeight;

    container.scrollTo({
      top: index * height,
      behavior: "smooth",
    });

    setCurrentIndex(index);

    setTimeout(() => {
      isScrolling.current = false;
    }, 400);
  };

  // 🔥 TOUCH SWIPE
  useEffect(() => {
    const container = containerRef.current;

    let startY = 0;
    let endY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      endY = e.changedTouches[0].clientY;

      const diff = startY - endY;

        if (currentIndex === 0 && diff < -80) {
    refreshFeed();
    return;
  }

      if (Math.abs(diff) < 50) return;

      if (diff > 0) goToIndex(currentIndex + 1);
      else goToIndex(currentIndex - 1);
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, posts]);

  // 🔥 DESKTOP SCROLL (WHEEL)
  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      if (isScrolling.current) return;

      if (e.deltaY > 0) goToIndex(currentIndex + 1);
      else goToIndex(currentIndex - 1);
    };

    container.addEventListener("wheel", handleWheel);

    return () => container.removeEventListener("wheel", handleWheel);
  }, [currentIndex, posts]);

  // 🔥 LOAD MORE (INTERSECTION)
  const lastPostRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts(page);
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="feed-container" ref={containerRef}>
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;

        return (
          <div
            key={post._id || index}
            ref={isLast ? lastPostRef : null}
            className="feed-card"
          >
            {/* 🖼 IMAGE */}
            <div className="feed-image-wrapper">
              <img
                src={
                  post.image ||
                  "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"
                }
                alt={post.title}
                className="feed-image"
              />
            </div>

            {/* 📝 CONTENT */}
            <div className="feed-content">
              <h3 className="feed-title">{post.title}</h3>

              <p className="feed-desc">
                {post.content || "No description available"}
              </p>

              <span className="read-more">पूरा पढ़ें →</span>
            </div>
          </div>
        );
      })}

      {loading && <div className="loader">Loading...</div>}
    </div>
  );
};

export default SwipeFeed;