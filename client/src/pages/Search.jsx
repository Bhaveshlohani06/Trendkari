// components/Search.jsx
import { useState, useEffect } from 'react';
import API  from '../../utils/api.js';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await API.get(`/search/autocomplete?q=${encodeURIComponent(query)}`);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = async (searchQuery = query, advanced = false) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const endpoint = advanced ? '/search/advanced' : '/search/basic';
      const response = await API.get(`${endpoint}?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  return (

    <Layout>
    <div className="container py-4">
      {/* Search Input */}
      <div className="row justify-content-center">
        <div className="col-md-8 position-relative">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search for posts, users, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => handleSearch()}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => handleSearch(query, true)}
              disabled={loading}
              title="AI-Powered Search"
            >
              <i className="fas fa-robot"></i> AI Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className={`badge bg-${suggestion.type === 'post' ? 'info' : suggestion.type === 'user' ? 'success' : 'warning'} me-2`}>
                    {suggestion.type}
                  </span>
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {results && (
        <div className="row mt-4">
          <div className="col-12">
            {/* AI Analysis Section */}
            {results.aiAnalysis && (
              <div className="card mb-4 border-primary">
                <div className="card-header bg-primary text-white">
                  <i className="fas fa-robot me-2"></i> AI Insights
                </div>
                <div className="card-body">
                  <h6>Summary:</h6>
                  <p>{results.aiAnalysis.summary}</p>
                  
                  <h6>Search Intent:</h6>
                  <p>{results.aiAnalysis.searchIntent}</p>
                  
                  <h6>Related Searches:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {results.aiAnalysis.relatedSearches.map((search, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search, true);
                        }}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                  
                  {results.aiAnalysis.insights && (
                    <>
                      <h6 className="mt-3">Additional Insights:</h6>
                      <p>{results.aiAnalysis.insights}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {results.results.posts.length > 0 && (
              <div className="mb-4">
                <h4 className="border-bottom pb-2">Posts</h4>
                <div className="row">
                  {results.results.posts.map(post => (
                    <div key={post._id} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <img src={post.image} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
                        <div className="card-body">
                          <h5 className="card-title">{post.title}</h5>
                          <p className="card-text">{post.content.substring(0, 100)}...</p>
                          <Link to={`/blog/${post.slug}`} className="btn btn-primary btn-sm">Read More</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {results.results.users.length > 0 && (
              <div className="mb-4">
                <h4 className="border-bottom pb-2">Users</h4>
                <div className="row">
                  {results.results.users.map(user => (
                    <div key={user._id} className="col-md-4 mb-3">
                      <div className="card text-center">
                        <img src={user.avatar} className="card-img-top rounded-circle w-50 mx-auto mt-3" alt={user.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <div className="card-body">
                          <h5 className="card-title">{user.name}</h5>
                          <p className="card-text">{user.bio?.substring(0, 80)}...</p>
                          <Link to={`/profile/${user._id}`} className="btn btn-outline-primary btn-sm">View Profile</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {results.results.categories.length > 0 && (
              <div className="mb-4">
                <h4 className="border-bottom pb-2">Categories</h4>
                <div className="d-flex flex-wrap gap-2">
                  {results.results.categories.map(category => (
                    <Link
                      key={category._id}
                      to={`/category/${category.slug || category._id}`}
                      className="btn btn-outline-info"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {results.results.posts.length === 0 && 
             results.results.users.length === 0 && 
             results.results.categories.length === 0 && (
              <div className="text-center py-5">
                <h4>No results found for "{query}"</h4>
                <p className="text-muted">Try different keywords or try our AI-powered search</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Search;