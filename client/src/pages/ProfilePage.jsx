import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  Form,
  Badge,
  Spinner,
  Image,
  Stack,
  Modal,
  Alert,
} from "react-bootstrap";
import Layout from '../Layout/Layout';
import { FaUserEdit, FaRegEdit, FaTrash, FaArrowLeft, FaEllipsisV, FaShareAlt, FaUsers, FaUserPlus, FaUserCheck, FaExclamationTriangle } from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [aboutInput, setAboutInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [status] = useState("published");
  const [isFeatured] = useState(false);
  const [tags] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const contentRef = useRef(null);
  
  // Get loggedInUser ID only (not the whole object)
  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?._id;
  const isOwner = loggedInUserId === userId;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Only authorized users can view this page");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setApiError(null);
        
        console.log("Fetching user data for ID:", userId);
        
        // Fetch user details
        const userRes = await API.get(`/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("User API response:", userRes);
        
        // Check if we actually got a user
        if (!userRes.data || !userRes.data.user) {
          throw new Error("User not found in response data");
        }
        
        setUser(userRes.data.user);
        setAboutInput(userRes.data.user.bio || "");

        // Set follower and following counts
        setFollowersCount(userRes.data.user.followers?.length || 0);
        setFollowingCount(userRes.data.user.following?.length || 0);

        // Check if logged-in user already follows this user
        if (loggedInUserId && userRes.data.user.followers?.some(f => f._id === loggedInUserId)) {
          setIsFollowing(true);
        }

        // Fetch posts
        try {
          const postsRes = await API.get(`/post/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPosts(postsRes.data);
        } catch (postError) {
          console.error("Error fetching posts:", postError);
          // Continue even if posts fail to load
          setPosts([]);
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        
        if (error.response?.status === 500) {
          setApiError("Server error when fetching user data");
          setError("Server error. Please try again later.");
          toast.error("Server error loading profile");
        } else if (error.response?.status === 404) {
          setError("User not found");
          toast.error("The requested user profile does not exist");
        } else if (error.response?.status === 401) {
          setError("Authentication failed");
          toast.error("Your session has expired. Please login again.");
          navigate("/login");
        } else if (error.message === "User not found in response data") {
          setError("User data missing in response");
          toast.error("Unable to load user profile");
        } else {
          setError("Failed to load profile");
          toast.error("Error loading profile or posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate, loggedInUserId]);


//Handle follow Toggle
  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to follow users");
        navigate("/login");
        return;
      }

      const { data } = await API.post(`/auth/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFollowing(data.following);
      setFollowersCount(prev => data.following ? prev + 1 : prev - 1);
      toast.success(data.following ? "Followed successfully!" : "Unfollowed successfully!");
    } catch (error) {
      toast.error("Failed to update follow status");
      console.error(error);
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/post/delete-post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  const BACKEND_URL = `https://trendkari.onrender.com/api/v1/post`;

  // Load categories
  const getAllCategories = async () => {
    try {
      const { data } = await API.get('/category/categories');
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while loading categories');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Generate content with AI
  const generateAndHumanize = async () => {
    const token = localStorage.getItem("token");

    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    if(!token){
      toast.error("Please login to generate content");
      return;
    }

    setGenerating(true);

    try {
      // Step 1: Generate raw AI content
      const genRes = await API.post(`${BACKEND_URL}/generate`,
        { prompt: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const generated = genRes?.data?.content;

      if (!generated) {
        toast.error("Failed to generate content");
        return;
      }

      // Step 2: Send raw content to backend to humanize it
      const humRes = await API.post(`${BACKEND_URL}/humanize`, {
        htmlContent: generated
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const humanized = humRes?.data?.content;

      if (!humanized) {
        toast.error("Failed to humanize content");
        return;
      }

      // Step 3: Load into editor
      setContent(humanized);
      if (contentRef.current) {
        contentRef.current.innerHTML = humanized;
      }

      toast.success('Content generated and humanized!');
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  // Submit post handler
  const handleCreate = async (e) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); 

    if (!token) {
      toast.error("Please login to create a post");
      return;
    }

    setPosting(true);
    e.preventDefault();
    
    try {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', contentRef.current.innerHTML);
      postData.append('category', category);
      postData.append('status', status);
      postData.append('isFeatured', isFeatured);
      postData.append('image', image);
      postData.append('tags', tags);

      const { data } = await API.post("/post/create-post", postData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.error) {
        toast.error(data?.message);
      } else {
        toast.success("Post Created Successfully");
        setShowModal(false);
        // Refresh posts
        const postsRes = await API.get(`/post/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in creating the Post");
    } finally {
      setPosting(false);
    }
  };

  const handleShare = (post) => {
    const shareUrl = `${window.location.origin}/blog/${post.slug}`;
    const shareText = `Check out this post: ${post.title}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.log("Share error:", err));
    } else {
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);

      const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

      window.open(whatsapp, "_blank");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container className="mt-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading profile...</p>
        </Container>
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout>
        <Container className="mt-5">
          {apiError && (
            <Alert variant="danger">
              <FaExclamationTriangle className="me-2" />
              <strong>Server Error:</strong> {apiError}
              <div className="mt-2">
                <small className="text-muted">
                  This is a backend issue. Please check your server logs.
                </small>
              </div>
            </Alert>
          )}
          <Card>
            <Card.Body className="text-center py-5">
              <Card.Title>Unable to load profile</Card.Title>
              <Card.Text className="text-muted mb-3">
                {error}
              </Card.Text>
              <Button variant="primary" onClick={() => navigate(-1)} className="me-2">
                <FaArrowLeft className="me-2" />
                Go Back
              </Button>
              <Button variant="outline-primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <div className="mt-3">
                <small className="text-muted">
                  User ID: {userId}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="my-4">

          {/* Show API error banner if exists but we still have user data */}
        {apiError && (
          <Alert variant="warning" className="mb-3">
            <FaExclamationTriangle className="me-2" />
            Partial data loaded: {apiError}
          </Alert>
        )}

        {/* Back Button */}
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate(-1)} 
          className="mb-3"
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>

        {/* User Profile Section */}
        {user && (
          <Card className="mb-4 shadow">
            <Card.Body>
              <Row className="align-items-center">
                <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                  <div className="position-relative d-inline-block">
                    <Image 
                      src={user.avatar || "/default-avatar.png"} 
                      roundedCircle 
                      width={150} 
                      height={150}
                      className="border border-3 border-primary object-fit-cover"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={9}>
                  <Stack direction="horizontal" className="justify-content-between align-items-start mb-2">
                    <div>
                      <h2 className="mb-1">{user.name || "Unnamed User"}</h2>
                      <p className="text-muted mb-2">{user.email}</p>
                      {user.role && (
                        <Badge bg={user.role === 'admin' ? 'danger' : 'info'} className="mb-2">
                          {user.role}
                        </Badge>
                      )}
                      
                      {/* Follower Stats */}
                      <div className="d-flex gap-3 mt-2">
                        <div className="d-flex align-items-center">
                          <FaUsers className="me-1 text-muted" />
                          <span className="fw-bold">{followersCount}</span> Followers
                        </div>
                        <div>
                          <span className="fw-bold">{followingCount}</span> Following
                        </div>
                      </div>
                    </div>
                    
                    {isOwner ? (
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => navigate(`/update-profile/${user._id}`)} 
                        className="d-flex align-items-center"
                      >
                        <FaUserEdit className="me-1" /> Edit Profile
                      </Button>
                    ) : (
                      <Button 
                        variant={isFollowing ? "outline-secondary" : "primary"} 
                        size="sm"
                        onClick={handleFollowToggle}
                        className="d-flex align-items-center"
                      >
                        {isFollowing ? (
                          <>
                            <FaUserCheck className="me-1" /> Following
                          </>
                        ) : (
                          <>
                            <FaUserPlus className="me-1" /> Follow
                          </>
                        )}
                      </Button>
                    )}
                  </Stack>

                  <hr />

                  <h5>About Me</h5>
                  <p className="text-muted">
                    {user.bio || "This user hasn't written anything about themselves yet."}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Posts Section */}
       <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{isOwner ? "My Posts" : `${user?.name}'s Posts`}</h3>
          {isOwner && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Create New Post
            </Button>
          )}
        </div>

        {posts.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <Card.Title>No posts yet</Card.Title>
              <Card.Text className="text-muted">
                {isOwner ? "You haven't created any posts. Start sharing your thoughts!" : "This user hasn't created any posts yet."}
              </Card.Text>
              {isOwner && (
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Create Your First Post
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {posts.map((post) => (
              <Col key={post._id}>
                <Card className="h-100 shadow-sm hover-shadow transition-all" style={{cursor: 'pointer'}} onClick={() => navigate(`/blog/${post.slug}`)}>
                  {post.image && (
                    <Card.Img
                      variant="top"
                      src={
                        post.image.startsWith("http")
                          ? post.image
                          : `https://trendkari.onrender.com/${post.image}`
                      }
                      alt={post.title}
                      style={{ height: "200px", objectFit: "cover" }}
                      className="border-bottom"
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {post.content?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                    </Card.Text>
                    {post.category?.name && (
                      <Badge bg="info" className="mb-2 align-self-start">
                        {post.category.name}
                      </Badge>
                    )}
                   
                    {isOwner && (
                      <Dropdown align="end" className="ms-2 dropdown" onClick={(e) => e.stopPropagation()}>
                        <Dropdown.Toggle
                          as={Button}
                          variant="link"
                          className="p-0 border-0 shadow-none"
                          style={{ color: "inherit" }}
                        >
                          <FaEllipsisV />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => navigate(`/edit-post/${post.slug}`)}>
                            <FaRegEdit className="me-2" /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(post._id)}>
                            <FaTrash className="me-2" /> Delete
                          </Dropdown.Item>
                          <Dropdown.Item onClick={(e) => {
                            e.stopPropagation();
                            handleShare(post);
                          }}>
                            <FaShareAlt className="me-2" /> 
                            Share
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    
                    {!isOwner && (
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="mt-2 align-self-start"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(post);
                        }}
                      >
                        <FaShareAlt className="me-1" /> Share
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Post Creation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Create a Post</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreate}>
            <Modal.Body>
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Post Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Toolbar */}
              <div className="d-flex gap-2 mb-2">
                <Button variant="outline-secondary" size="sm" onClick={() => document.execCommand("bold")}><b>B</b></Button>
                <Button variant="outline-secondary" size="sm" onClick={() => document.execCommand("italic")}><i>I</i></Button>
                <Button variant="outline-secondary" size="sm" onClick={() => document.execCommand("underline")}><u>U</u></Button>
                <Button variant="outline-secondary" size="sm" onClick={() => document.execCommand("insertUnorderedList")}>• List</Button>
                <Button variant="outline-secondary" size="sm" onClick={() => document.execCommand("insertOrderedList")}>1. List</Button>
              </div>

              {/* Editor */}
              <Form.Group className="mb-3">
                <Form.Label>Post Content</Form.Label>
                <div
                  ref={contentRef}
                  contentEditable
                  onInput={() => setContent(contentRef.current.innerHTML)}
                  style={{
                    minHeight: '300px',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#fff',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    direction: 'ltr',
                    textAlign: 'left',
                  }}
                  suppressContentEditableWarning={true}
                >
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    'Start writing or wait for content to be generated...'
                  )}
                </div>
              </Form.Group>

              {/* Generate AI button */}
              <Button
                variant="warning"
                size="sm"
                className="mb-3"
                onClick={generateAndHumanize}
                disabled={generating}
              >
                {generating ? "Generating..." : "Generate with AI"}
              </Button>

              {/* Category */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="mb-3">
                <Form.Label>Post Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={posting}>
                {posting ? "Posting..." : "Post"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Layout>
  );
};

export default UserProfile;