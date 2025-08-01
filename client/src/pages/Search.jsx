// pages/Search.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const { data } = await axios.get(`/api/v1/posts/search?q=${query}`);
      setResults(data?.posts || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Search Results for: <strong>{query}</strong></h4>
      <div className="row mt-3">
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          results.map((post) => (
            <div className="col-md-4 mb-3" key={post._id}>
              <div className="card h-100">
                <img src={post.image} className="card-img-top" alt={post.title} />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
