// components/SearchModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner, ListGroup, Badge } from 'react-bootstrap';
import  API  from '../../utils/api';
import { Link } from 'react-router-dom';

const SearchModal = ({ show, onHide }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);

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
    setSearchExecuted(true);
    try {
      const endpoint = advanced ? '/search/advanced' : '/search/basic';
      const response = await API.get(`${endpoint}?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ error: 'Search failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setQuery('');
    setResults(null);
    setSearchExecuted(false);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Search Trendkari</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Search Input */}
        <div className="position-relative">
          <Form.Group>
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Search for posts, users, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <Button 
                variant="primary" 
                onClick={() => handleSearch()}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
              </Button>
            </div>
          </Form.Group>

          {/* Suggestions Dropdown */}
          {query.length >= 2 && suggestions.length > 0 && !searchExecuted && (
            <div className="position-absolute w-100 mt-1" style={{ zIndex: 1000, background: 'white', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
              <ListGroup variant="flush">
                {suggestions.map((suggestion, index) => (
                  <ListGroup.Item 
                    key={index}
                    action
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="py-2"
                  >
                    <Badge 
                      bg={
                        suggestion.type === 'post' ? 'info' : 
                        suggestion.type === 'user' ? 'success' : 'warning'
                      } 
                      className="me-2"
                    >
                      {suggestion.type}
                    </Badge>
                    {suggestion.text}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchExecuted && (
          <div className="mt-3">
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Searching...</p>
              </div>
            ) : results?.error ? (
              <div className="alert alert-danger">{results.error}</div>
            ) : results ? (
              <div>
                {/* AI Analysis */}
                {results.aiAnalysis && (
                  <div className="alert alert-info">
                    <h6>AI Insights</h6>
                    <p className="mb-1">{results.aiAnalysis.summary}</p>
                    {results.aiAnalysis.relatedSearches.length > 0 && (
                      <div className="mt-2">
                        <small>Related: {results.aiAnalysis.relatedSearches.join(', ')}</small>
                      </div>
                    )}
                  </div>
                )}

                {/* Posts Results */}
                {results.results?.posts?.length > 0 && (
                  <div className="mb-3">
                    <h6>Posts</h6>
                    <ListGroup variant="flush">
                      {results.results.posts.slice(0, 5).map(post => (
                        <ListGroup.Item key={post._id} action as={Link} to={`/blog/${post.slug}`} onClick={onHide}>
                          <div className="d-flex align-items-center">
                            {post.image && (
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="me-3 rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <div className="fw-medium">{post.title}</div>
                              <small className="text-muted">
                                {post.category?.name && `${post.category.name} • `}
                                {new Date(post.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    {results.results.posts.length > 5 && (
                      <div className="text-center mt-2">
                        <Button variant="outline-primary" size="sm" as={Link} to={`/search?q=${encodeURIComponent(query)}`} onClick={onHide}>
                          View all {results.results.posts.length} posts
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Users Results */}
                {results.results?.users?.length > 0 && (
                  <div className="mb-3">
                    <h6>Users</h6>
                    <ListGroup variant="flush">
                      {results.results.users.slice(0, 5).map(user => (
                        <ListGroup.Item key={user._id} action as={Link} to={`/profile/${user._id}`} onClick={onHide}>
                          <div className="d-flex align-items-center">
                            <img 
                              src={user.avatar || '/default-avatar.png'} 
                              alt={user.name} 
                              className="me-3 rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = '/default-avatar.png';
                              }}
                            />
                            <div>
                              <div className="fw-medium">{user.name}</div>
                              {user.bio && (
                                <small className="text-muted">{user.bio.substring(0, 60)}...</small>
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    {results.results.users.length > 5 && (
                      <div className="text-center mt-2">
                        <Button variant="outline-primary" size="sm" as={Link} to={`/search?q=${encodeURIComponent(query)}`} onClick={onHide}>
                          View all {results.results.users.length} users
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Categories Results */}
                {results.results?.categories?.length > 0 && (
                  <div className="mb-3">
                    <h6>Categories</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {results.results.categories.map(category => (
                        <Badge 
                          key={category._id} 
                          bg="info" 
                          className="p-2" 
                          as={Link} 
                          to={`/category/${category.slug || category._id}`}
                          onClick={onHide}
                          style={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {(!results.results || 
                  (results.results.posts.length === 0 && 
                   results.results.users.length === 0 && 
                   results.results.categories.length === 0)) && (
                  <div className="text-center py-3">
                    <p>No results found for "{query}"</p>
                    <Button variant="outline-secondary" onClick={resetSearch}>
                      Try a different search
                    </Button>
                  </div>
                )}

                {/* View All Results Button */}
                {(results.results?.posts.length > 0 || 
                  results.results?.users.length > 0 || 
                  results.results?.categories.length > 0) && (
                  <div className="text-center mt-3">
                    <Button 
                      as={Link} 
                      to={`/search?q=${encodeURIComponent(query)}`} 
                      onClick={onHide}
                    >
                      View Full Search Results
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-3">
                <p>Enter a search term to find content</p>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;