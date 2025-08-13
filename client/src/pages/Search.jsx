// src/pages/search.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from '../../utils/api'
const LIMIT = 12;

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params from URL
  const { q, page } = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return {
      q: (p.get("q") || "").trim(),
      page: Math.max(1, parseInt(p.get("page") || "1", 10)),
    };
  }, [location.search]);

  const [input, setInput] = useState(q);      // input for the search bar
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Keep input in sync when URL changes (e.g., via pagination)
  useEffect(() => setInput(q), [q]);

  // Fetch every time the URL changes (q/page)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);            // omit when empty; backend treats it as "no query"
        params.set("page", String(page));
        params.set("limit", String(LIMIT));

        const { data } = await API.get(`/search?${params.toString()}`);
        setPosts(data?.posts || []);
      } catch (e) {
        console.error(e);
        setErr("Something went wrong while fetching results.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, page]);

  // Submit from search bar → navigate with q & reset to page 1
  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (input.trim()) params.set("q", input.trim());
    params.set("page", "1");
    navigate(`/search?${params.toString()}`);
  };

  // Pagination
  const goTo = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(newPage));
    navigate(`/search?${params.toString()}`);
  };

  // Close button: go back if possible, else go home
  const onClose = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const heading = q ? `Search Results for "${q}"` : "Latest Posts";

  return (
    <div className="container py-4">
      {/* Header row: title + close */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">{heading}</h2>
        <button className="btn btn-outline-secondary" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={onSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="search"
            className="form-control"
            placeholder="Search posts…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
          {q && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/search?page=1")}
              title="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Status */}
      {loading && <p>Loading…</p>}
      {err && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && posts.length === 0 && (
        <p>{q ? `No results found for "${q}".` : "No posts yet."}</p>
      )}

      {/* Results */}
      <div className="row">
        {posts.map((post) => (
          <div key={post._id} className="col-md-4 mb-3">
            <div className="card h-100">
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  className="card-img-top"
                  alt={post.title}
                  style={{ height: 200, objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  <Link to={`/post/${post._id}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </h5>
                <p className="text-muted mb-2">
                  {post.author?.name || post.author?.username || "Unknown"} •{" "}
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                </p>
                <p className="card-text">
                  {post.excerpt || (post.content ? post.content.slice(0, 120) + "…" : "")}
                </p>
                <div className="mt-auto">
                  {post.category && (
                    <span className="badge bg-light text-dark">{post.category}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && posts.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-primary"
            disabled={page <= 1}
            onClick={() => goTo(page - 1)}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            className="btn btn-outline-primary"
            // Disable "Next" only when results are fewer than the page size
            disabled={posts.length < LIMIT}
            onClick={() => goTo(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
