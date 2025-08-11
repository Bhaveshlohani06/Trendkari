import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Placeholder,
  Spinner,
  Image,
  Stack,
} from "react-bootstrap";
import Layout from '../Layout/Layout';
import { FaUserEdit, FaRegEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [aboutInput, setAboutInput] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        // Fetch user details
        const userRes = await API.get(`/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setAboutInput(userRes.data.about || "");

        // Fetch posts
        const postsRes = await API.get(`/post/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);
      } catch (error) {
        toast.error("Error loading profile or posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

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

  const handleAboutUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/auth/update-about/${userId}`,
        { about: aboutInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("About section updated");
      setUser(res.data);
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update about");
      console.error(error);
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

  if (!user) {
    return (
      <Layout>
        <Container className="mt-5">
          <Card>
            <Card.Body className="text-center">
              <Card.Title>User not found</Card.Title>
              <Button variant="primary" onClick={() => navigate(-1)}>
                <FaArrowLeft className="me-2" />
                Go Back
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="my-4">
        {/* Back Button */}
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate(-1)} 
          className="mb-3"
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>

        {/* User Profile Section */}
        <Card className="mb-4 shadow">
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                <div className="position-relative d-inline-block">
                  <Image 
                    src={user.avatar || ""} 
                    roundedCircle 
                    width={150} 
                    height={150}
                    className="border border-3 border-primary object-fit-cover"
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
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => setEditMode(!editMode)}
                    className="d-flex align-items-center"
                  >
                    <FaUserEdit className="me-1" /> Edit Profile
                  </Button>
                </Stack>

                <hr />

                <h5>About Me</h5>
                {editMode ? (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={aboutInput}
                      onChange={(e) => setAboutInput(e.target.value)}
                      className="mb-2"
                    />
                    <Stack direction="horizontal" gap={2}>
                      <Button 
                        variant="success" 
                        onClick={handleAboutUpdate} 
                        size="sm"
                        className="d-flex align-items-center"
                      >
                        <FaRegEdit className="me-1" /> Save Changes
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setEditMode(false)} 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <p className="text-muted">
                    {user.about || "This user hasn't written anything about themselves yet."}
                  </p>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Posts Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">My Posts</h3>
          <Button variant="primary" onClick={() => navigate("/create-post")}>
            Create New Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <Card.Title>No posts yet</Card.Title>
              <Card.Text className="text-muted">
                You haven't created any posts. Start sharing your thoughts!
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/create-post")}>
                Create Your First Post
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {posts.map((post) => (
              <Col key={post._id}>
                <Card className="h-100 shadow-sm hover-shadow transition-all">
                  {post.image && (
                    <Card.Img
                      variant="top"
                      src={
                        post.image.startsWith("http")
                          ? post.image
                          : `http://localhost:8080/${post.image}`
                      }
                      alt={post.title}
                      style={{ height: "200px", objectFit: "cover" }}
                      className="border-bottom"
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {post.content?.slice(0, 100)}...
                    </Card.Text>
                    {post.category?.name && (
                      <Badge bg="info" className="mb-2 align-self-start">
                        {post.category.name}
                      </Badge>
                    )}
                    <Stack direction="horizontal" gap={2} className="mt-auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                        className="d-flex align-items-center"
                      >
                        <FaRegEdit className="me-1" /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(post._id)}
                        className="d-flex align-items-center"
                      >
                        <FaTrash className="me-1" /> Delete
                      </Button>
                    </Stack>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Layout>
  );
};

export default UserProfile;