// FollowPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const FollowPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [following, setFollowing] = useState(new Set());

  const categories = [
    { id: 'all', name: 'सभी' },
    { id: 'journalist', name: 'पत्रकार' },
    { id: 'reporter', name: 'रिपोर्टर' },
    { id: 'editor', name: 'संपादक' },
    { id: 'photographer', name: 'फोटोग्राफर' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [page, category]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users', {
        params: {
          page,
          limit: 20,
          category: category === 'all' ? null : category,
          search: searchTerm
        }
      });
      
      if (page === 1) {
        setUsers(response.data.users);
      } else {
        setUsers(prev => [...prev, ...response.data.users]);
      }
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const handleFollowToggle = async (userId) => {
    try {
      if (following.has(userId)) {
        await axios.post(`/api/users/${userId}/unfollow`);
        setFollowing(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      } else {
        await axios.post(`/api/users/${userId}/follow`);
        setFollowing(prev => new Set(prev.add(userId)));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">होम</Link>
              </li>
              <li className="breadcrumb-item active">लोगों को फॉलो करें</li>
            </ol>
          </nav>
          
          <h2 className="fw-bold mb-4">लोगों को फॉलो करें</h2>
          
          {/* Search Bar */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="नाम या विशेषता से खोजें..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`btn btn-sm ${category === cat.id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Users Grid */}
      <div className="row g-4">
        {loading && page === 1 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">लोड हो रहा है...</span>
              </div>
            </div>
          </div>
        ) : users.length > 0 ? (
          <>
            {users.map(user => (
              <div key={user._id} className="col-lg-4 col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-start gap-3">
                      <img 
                        src={user.profilePic || "/avatar.png"} 
                        className="rounded-circle border"
                        width={70}
                        height={70}
                        alt={user.name}
                      />
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{user.name}</h5>
                        <p className="text-muted small mb-2">{user.bio}</p>
                        <div className="d-flex flex-wrap gap-2 small">
                          {user.categories?.map(cat => (
                            <span key={cat} className="badge bg-light text-dark">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <div className="small text-muted">
                        <span className="d-block">
                          <strong>{user.followers || 0}</strong> फॉलोअर्स
                        </span>
                        <span className="d-block">
                          <strong>{user.postsCount || 0}</strong> पोस्ट
                        </span>
                      </div>
                      <button
                        className={`btn btn-sm ${following.has(user._id) ? 'btn-outline-secondary' : 'btn-primary'}`}
                        onClick={() => handleFollowToggle(user._id)}
                      >
                        {following.has(user._id) ? 'अनफॉलो' : 'फॉलो करें'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="col-12 text-center mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'लोड हो रहा है...' : 'और देखें'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="col-12">
            <div className="text-center py-5 border rounded">
              <div className="display-1 mb-3">👥</div>
              <h4 className="text-muted">कोई उपयोगकर्ता नहीं मिला</h4>
              <p className="text-muted">खोज शब्द बदलें या बाद में आएं</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowPage;