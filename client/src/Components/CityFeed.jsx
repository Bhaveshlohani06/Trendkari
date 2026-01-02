import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import Layout from "../Layout/Layout";
import BlogCard from "../Components/BlogCard";

const cities = [
  { name: "Kota", slug: "kota" },
  { name: "Ramganjmandi", slug: "ramganjmandi" },
  { name: "Ladpura", slug: "ladpura" },
  { name: "Sangod", slug: "sangod" },
  { name: "Rural Kota", slug: "rural-kota" }
];

const CityFeed = () => {
  const { location } = useParams();
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get(
        `/post/get-posts?location=${location}&language=hi`
      );
      if (data?.success) setPosts(data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [location]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "trending") {
      return (b.views || 0) - (a.views || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <Layout>
      {/* City Context */}
      <div className="container py-4">
        <h1 className="fw-bold text-capitalize mb-1">
          {location.replace("-", " ")}
        </h1>
        <p className="text-muted mb-1">
          Local stories, updates & insights
        </p>
        <hr/>

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

        <hr/>

        {/* Soft Tabs */}
        <div className="d-flex gap-3 mb-4">
          <span
            role="button"
            className={`fw-medium ${
              sortBy === "latest" ? "text-dark" : "text-muted"
            }`}
            onClick={() => setSortBy("latest")}
          >
            Latest
          </span>
          <span className="text-muted">•</span>
          <span
            role="button"
            className={`fw-medium ${
              sortBy === "trending" ? "text-dark" : "text-muted"
            }`}
            onClick={() => setSortBy("trending")}
          >
            Trending
          </span>
        </div>

        {/* Feed */}
        {loading ? (
          <p className="text-muted">Loading stories...</p>
        ) : sortedPosts.length === 0 ? (
          <p>No stories yet.</p>
        ) : (
          <div className="row">
            {sortedPosts.map(post => (
              <div key={post._id} className="col-md-6 mb-4">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CityFeed;
