// import { useEffect, useState } from "react";
// import { useSearchParams, useLocation, Link, useNavigate } from "react-router-dom";
// import { Search, Sparkles, FileText, User, Tag, ArrowRight } from "lucide-react";
// import API from "../../utils/api";
// //import "./../../css/searchresult.css";
// import Layout from "../Layout/Layout.jsx";


// const SearchResultsPage = () => {
//   const [searchParams] = useSearchParams();
//   const locationState = useLocation();
//   const navigate = useNavigate();

//   const query = searchParams.get("q") || "";

//   const [loading, setLoading] = useState(!locationState.state?.searchResults);
//   const [resultsData, setResultsData] = useState(
//     locationState.state?.searchResults || null
//   );
//   const [activeTab, setActiveTab] = useState("all");

//   useEffect(() => {
//     let isMounted = true;

//     const fetchResults = async () => {
//       if (!query.trim()) return;

//       setLoading(true);
//       try {
//         const { data } = await API.post("/search/ai-search", { query });
//         if (isMounted) setResultsData(data);
//       } catch (err) {
//         console.error("Search fetch error:", err);
//         if (isMounted) {
//           setResultsData({ error: "Search failed. Please try again." });
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     if (!locationState.state?.searchResults) {
//       fetchResults();
//     } else {
//       setResultsData(locationState.state.searchResults);
//       setLoading(false);
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [query, locationState.state]);

//   const posts = resultsData?.results?.posts || [];
//   const users = resultsData?.results?.users || [];
//   const categories = resultsData?.results?.categories || [];
//   const aiSummary = resultsData?.aiSummary || resultsData?.response || null;
//   const isAiFallback = resultsData?.source === "ai" || resultsData?.type === "ai_response";

//   return (
//     <Layout>
//     <div className="tk-search-page">
//       <div className="tk-search-page__header">
//         <h1>
//           Search results for <span>"{query}"</span>
//         </h1>
//         {resultsData && !loading && (
//           <p className="tk-search-page__subtitle">
//             {isAiFallback
//               ? "No database match. Here is your AI summary:"
//               : `Found ${posts.length} posts, ${users.length} users, and ${categories.length} categories.`}
//           </p>
//         )}
//       </div>

//       {!isAiFallback && !loading && (
//         <div className="tk-search-tabs">
//           <button
//             className={`tk-tab ${activeTab === "all" ? "active" : ""}`}
//             onClick={() => setActiveTab("all")}
//           >
//             All
//           </button>

//           {posts.length > 0 && (
//             <button
//               className={`tk-tab ${activeTab === "posts" ? "active" : ""}`}
//               onClick={() => setActiveTab("posts")}
//             >
//               Posts ({posts.length})
//             </button>
//           )}

//           {users.length > 0 && (
//             <button
//               className={`tk-tab ${activeTab === "users" ? "active" : ""}`}
//               onClick={() => setActiveTab("users")}
//             >
//               Users ({users.length})
//             </button>
//           )}

//           {categories.length > 0 && (
//             <button
//               className={`tk-tab ${activeTab === "categories" ? "active" : ""}`}
//               onClick={() => setActiveTab("categories")}
//             >
//               Categories ({categories.length})
//             </button>
//           )}
//         </div>
//       )}

//       {loading && (
//         <div className="tk-search-loading">
//           <Sparkles size={28} className="tk-spin-icon text-accent" />
//           <p>Searching Trendkari & generating AI insights...</p>
//         </div>
//       )}

//       {!loading && (
//         <div className="tk-search-results-content">
//           {/* AI GEMINI CARD */}
//           {aiSummary && (
//             <div className="tk-ai-card">
//               <div className="tk-ai-card__header">
//                 <Sparkles size={20} className="text-accent" />
//                 <h3>AI Insights</h3>
//               </div>
//               <div className="tk-ai-card__body">
//                 <p>{aiSummary}</p>
//               </div>
//             </div>
//           )}

//           {/* POSTS SECTION */}
//           {(activeTab === "all" || activeTab === "posts") && posts.length > 0 && (
//             <section className="tk-results-section">
//               <h2><FileText size={18} /> Posts</h2>
//               <div className="tk-posts-grid">
//                 {posts.map((post) => {
//                   // Construct route as: /feed/:location/:slug
//                   const postLocation = post.location || "kota";
//                   const postLink = `/feed/${postLocation}/${post.slug}`;

//                   return (
//                     <Link key={post._id} to={postLink} className="tk-post-card">
//                       {post.image && (
//                         <img src={post.image} alt={post.title} className="tk-post-card__img" />
//                       )}
//                       <div className="tk-post-card__info">
//                         <span className="tk-post-card__cat">
//                           {post.category?.name || "News"}
//                         </span>
//                         <h3>{post.title}</h3>
//                         <small className="text-muted">
//                           {new Date(post.createdAt).toLocaleDateString()}
//                         </small>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </section>
//           )}

//           {/* USERS SECTION */}
//           {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
//             <section className="tk-results-section">
//               <h2><User size={18} /> Users</h2>
//               <div className="tk-users-list">
//                 {users.map((user) => (
//                   <Link
//                     key={user._id}
//                     to={`/user/${user._id}`}
//                     className="tk-user-card"
//                   >
//                     <img
//                       src={user.avatar || "/default-avatar.png"}
//                       alt={user.name}
//                       className="tk-user-card__avatar"
//                       onError={(e) => { e.target.src = "/default-avatar.png"; }}
//                     />
//                     <div>
//                       <h4>{user.name}</h4>
//                       {user.bio && <p>{user.bio.substring(0, 60)}...</p>}
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* CATEGORIES SECTION */}
//           {(activeTab === "all" || activeTab === "categories") && categories.length > 0 && (
//             <section className="tk-results-section">
//               <h2><Tag size={18} /> Categories</h2>
//               <div className="tk-categories-flex">
//                 {categories.map((cat) => (
//                   <Link
//                     key={cat._id}
//                     to={`/category/${cat.slug}`}
//                     className="tk-category-badge"
//                   >
//                     {cat.name} <ArrowRight size={14} />
//                   </Link>
//                 ))}
//               </div>
//             </section>
//           )}

//           {!aiSummary && posts.length === 0 && users.length === 0 && categories.length === 0 && (
//             <div className="tk-empty-search">
//               <Search size={40} className="text-muted mb-2" />
//               <h3>No results found</h3>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//     </Layout>
//   );
// };

// export default SearchResultsPage;


import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { Search, Sparkles, FileText, User, Tag, ArrowRight } from "lucide-react";
import API from "../../utils/api.js";
import Layout from "../Layout/Layout.jsx";
import "../../css/SearchResult.css";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const locationState = useLocation();

  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(!locationState.state?.searchResults);
  const [resultsData, setResultsData] = useState(
    locationState.state?.searchResults || null
  );
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      if (!query.trim()) {
        setResultsData({ results: { posts: [], users: [], categories: [] } });
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log(`[Frontend] Searching for: "${query}"`);
        
        const response = await API.get(`/search/basic?query=${encodeURIComponent(query)}`);
        console.log('[Frontend] API Response:', response.data);
        
        if (isMounted) {
          if (response.data.success) {
            setResultsData({
              results: response.data.results || { posts: [], users: [], categories: [] },
              source: "database",
              type: "search",
              query: query
            });
          } else {
            setError(response.data.error || "Search failed");
            setResultsData({ results: { posts: [], users: [], categories: [] } });
          }
        }
      } catch (err) {
        console.error('[Frontend] Search error:', err);
        
        if (err.code === 'ERR_NETWORK') {
          setError("Cannot connect to server. Please check if backend is running.");
        } else if (err.response) {
          setError(err.response.data?.error || err.response.data?.message || "Search failed");
        } else {
          setError("An unexpected error occurred");
        }
        
        if (isMounted) {
          setResultsData({ results: { posts: [], users: [], categories: [] } });
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
      setError(null);
    }

    return () => {
      isMounted = false;
    };
  }, [query, locationState.state]);

  const posts = resultsData?.results?.posts || [];
  const users = resultsData?.results?.users || [];
  const categories = resultsData?.results?.categories || [];
  const hasResults = posts.length > 0 || users.length > 0 || categories.length > 0;

  console.log('[Frontend] Render state:', { 
    loading, 
    error, 
    postsCount: posts.length,
    usersCount: users.length,
    categoriesCount: categories.length,
    hasResults 
  });

  return (
    <Layout>
      <div className="tk-search-page">
        <div className="tk-search-page__header">
          <h1>
            Search results for <span>"{query}"</span>
          </h1>
          {!loading && !error && hasResults && (
            <p className="tk-search-page__subtitle">
              Found {posts.length} posts, {users.length} users, and {categories.length} categories.
            </p>
          )}
          {!loading && error && (
            <p className="tk-search-page__subtitle error" style={{ color: 'red' }}>
              {error}
            </p>
          )}
        </div>

        {/* Tabs */}
        {!loading && !error && hasResults && (
          <div className="tk-search-tabs">
            <button
              className={`tk-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All ({posts.length + users.length + categories.length})
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

        {/* Loading State */}
        {loading && (
          <div className="tk-search-loading">
            <Sparkles size={28} className="tk-spin-icon text-accent" />
            <p>Searching Trendkari...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="tk-empty-search">
            <Search size={40} className="text-muted mb-2" />
            <h3>Something went wrong</h3>
            <p className="text-muted">{error}</p>
            <button 
              className="tk-retry-btn"
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.5rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="tk-search-results-content">
            {/* POSTS SECTION */}
            {(activeTab === "all" || activeTab === "posts") && posts.length > 0 && (
              <section className="tk-results-section">
                <h2><FileText size={18} /> Posts</h2>
                <div className="tk-posts-grid">
                  {posts.map((post) => {
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

            {/* USERS SECTION - FIXED NAVIGATION */}
            {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
              <section className="tk-results-section">
                <h2><User size={18} /> Users</h2>
                <div className="tk-users-list">
                  {users.map((user) => (
                    <Link
                      key={user._id}
                      to={`/user/${user._id}`}  // ← This will work if you add the route
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

            {/* No Results */}
            {!hasResults && (
              <div className="tk-empty-search">
                <Search size={40} className="text-muted mb-2" />
                <h3>No results found</h3>
                <p className="text-muted">
                  We couldn't find anything matching "{query}"
                </p>
                <p className="text-muted">
                  Try using different keywords or check your spelling.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;  