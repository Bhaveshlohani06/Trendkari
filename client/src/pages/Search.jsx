import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, FileText, User, Tag, ArrowRight } from "lucide-react";
import API from "../../utils/api";
import "./../../css/searchresult.css";
import Layout from "../Layout/Layout.jsx";


const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const locationState = useLocation();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(!locationState.state?.searchResults);
  const [resultsData, setResultsData] = useState(
    locationState.state?.searchResults || null
  );
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const { data } = await API.post("/search/ai-search", { query });
        if (isMounted) setResultsData(data);
      } catch (err) {
        console.error("Search fetch error:", err);
        if (isMounted) {
          setResultsData({ error: "Search failed. Please try again." });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!locationState.state?.searchResults) {
      fetchResults();
    } else {
      setResultsData(locationState.state.searchResults);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [query, locationState.state]);

  const posts = resultsData?.results?.posts || [];
  const users = resultsData?.results?.users || [];
  const categories = resultsData?.results?.categories || [];
  const aiSummary = resultsData?.aiSummary || resultsData?.response || null;
  const isAiFallback = resultsData?.source === "ai" || resultsData?.type === "ai_response";

  return (
    <Layout>
    <div className="tk-search-page">
      <div className="tk-search-page__header">
        <h1>
          Search results for <span>"{query}"</span>
        </h1>
        {resultsData && !loading && (
          <p className="tk-search-page__subtitle">
            {isAiFallback
              ? "No database match. Here is your AI summary:"
              : `Found ${posts.length} posts, ${users.length} users, and ${categories.length} categories.`}
          </p>
        )}
      </div>

      {!isAiFallback && !loading && (
        <div className="tk-search-tabs">
          <button
            className={`tk-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          {posts.length > 0 && (
            <button
              className={`tk-tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Posts ({posts.length})
            </button>
          )}

          {users.length > 0 && (
            <button
              className={`tk-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users ({users.length})
            </button>
          )}

          {categories.length > 0 && (
            <button
              className={`tk-tab ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              Categories ({categories.length})
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="tk-search-loading">
          <Sparkles size={28} className="tk-spin-icon text-accent" />
          <p>Searching Trendkari & generating AI insights...</p>
        </div>
      )}

      {!loading && (
        <div className="tk-search-results-content">
          {/* AI GEMINI CARD */}
          {aiSummary && (
            <div className="tk-ai-card">
              <div className="tk-ai-card__header">
                <Sparkles size={20} className="text-accent" />
                <h3>AI Insights</h3>
              </div>
              <div className="tk-ai-card__body">
                <p>{aiSummary}</p>
              </div>
            </div>
          )}

          {/* POSTS SECTION */}
          {(activeTab === "all" || activeTab === "posts") && posts.length > 0 && (
            <section className="tk-results-section">
              <h2><FileText size={18} /> Posts</h2>
              <div className="tk-posts-grid">
                {posts.map((post) => {
                  // Construct route as: /feed/:location/:slug
                  const postLocation = post.location || "kota";
                  const postLink = `/feed/${postLocation}/${post.slug}`;

                  return (
                    <Link key={post._id} to={postLink} className="tk-post-card">
                      {post.image && (
                        <img src={post.image} alt={post.title} className="tk-post-card__img" />
                      )}
                      <div className="tk-post-card__info">
                        <span className="tk-post-card__cat">
                          {post.category?.name || "News"}
                        </span>
                        <h3>{post.title}</h3>
                        <small className="text-muted">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* USERS SECTION */}
          {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
            <section className="tk-results-section">
              <h2><User size={18} /> Users</h2>
              <div className="tk-users-list">
                {users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/user/${user._id}`}
                    className="tk-user-card"
                  >
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="tk-user-card__avatar"
                      onError={(e) => { e.target.src = "/default-avatar.png"; }}
                    />
                    <div>
                      <h4>{user.name}</h4>
                      {user.bio && <p>{user.bio.substring(0, 60)}...</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CATEGORIES SECTION */}
          {(activeTab === "all" || activeTab === "categories") && categories.length > 0 && (
            <section className="tk-results-section">
              <h2><Tag size={18} /> Categories</h2>
              <div className="tk-categories-flex">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    className="tk-category-badge"
                  >
                    {cat.name} <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!aiSummary && posts.length === 0 && users.length === 0 && categories.length === 0 && (
            <div className="tk-empty-search">
              <Search size={40} className="text-muted mb-2" />
              <h3>No results found</h3>
            </div>
          )}
        </div>
      )}
    </div>
    </Layout>
  );
};

export default SearchResultsPage;