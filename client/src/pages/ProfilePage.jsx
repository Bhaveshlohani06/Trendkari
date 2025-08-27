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
  Placeholder,
  Spinner,
  Image,
  Stack,
} from "react-bootstrap";
import Layout from '../Layout/Layout';
import { FaUserEdit, FaRegEdit, FaTrash, FaArrowLeft, FaEllipsisV, FaShareAlt } from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useParams();
    const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [aboutInput, setAboutInput] = useState("");
  const [loading, setLoading] = useState(true);


  const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [status] = useState("published");
    const [isFeatured] = useState(false);
    const [tags] = useState("");
    const [generating, setGenerating] = useState(false);
    const [posting, setPosting] = useState(false)
    const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

    const contentRef = useRef(null);
  

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
        setUser(userRes.data.user);
        setAboutInput(userRes.data.user.bio || "");

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
    const token = localStorage.getItem("token");

    // Step 1: Generate raw AI content
    const genRes = await API.post(`${BACKEND_URL}/generate`,
      // `${BACKEND_URL}/generate`,
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
        Authorization: `Bearer ${token}`  // ✅ Add token here too
      }
      });

    const humanized = humRes?.data?.content;  // ✅ match response key from backend

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
            navigate('/explore');
          }
          
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong in creating the Post");
        } finally{
          setPosting(false);
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
  };

         const handleShare = (e) => {
    e.stopPropagation(); // prevent navigating

    const shareUrl = `${window.location.origin}/blog/${posts.slug}`;
    const shareText = `Check out this post: ${posts.title}`;

    // ✅ Modern share API (mobile/modern browsers)
    if (navigator.share) {
      navigator.share({
        title: posts.title,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.log("Share error:", err));
    } else {
      // ✅ Fallback (open share options)
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);

      const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

      // Open in new tab (or show modal with options)
      window.open(whatsapp, "_blank");
      window.open(facebook, "_blank");
      window.open(twitter, "_blank");
    }
  };


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
                   onClick={() => navigate(`/update-profile/${user._id}`)} 
                    className="d-flex align-items-center"
                  >
                    <FaUserEdit className="me-1" /> Edit Profile
                  </Button>
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

        {/* Posts Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">My Posts</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
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
              <Button variant="primary"  onClick={() => setShowModal(true)}>
                Create Your First Post
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {posts.map((post) => (
              <Col key={post._id}>
                <Card className="h-100 shadow-sm hover-shadow transition-all" onClick={() => navigate(`/blog/${post.slug}`)} >
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
    <Dropdown.Item onClick={handleShare}>
  <FaShareAlt
    className="me-2"
    style={{ cursor: "pointer", fontSize: "18px", color: "gray" }}
  /> 
  Share
</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

                  </Card.Body>
                </Card>
              </Col>
            ))}


            
      {/* Post Creation Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create a Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Title */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                 {/* Toolbar */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => document.execCommand("bold")}><b>B</b></button>
        <button onClick={() => document.execCommand("italic")}><i>I</i></button>
        <button onClick={() => document.execCommand("underline")}><u>U</u></button>
        <button onClick={() => document.execCommand("insertUnorderedList")}>• List</button>
        <button onClick={() => document.execCommand("insertOrderedList")}>1. List</button>
      </div>

      {/* Editor */}
      {/* <div
  ref={contentRef}
  contentEditable={true}
  dir="ltr"
  onInput={() => setContent(contentRef.current.innerText)} 
  style={{
    minHeight: "300px",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    fontSize: "16px",
    lineHeight: "1.6",
    textAlign: "left",
    outline: "none",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }}
  suppressContentEditableWarning={true}
>
  {content || "Start writing or paste your article..."}
</div> */}

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
    direction: 'ltr', // Force Left-to-Right text direction
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


                {/* Generate AI button */}
                <button
                  className="btn btn-warning btn-sm m-3"
                  onClick={generateAndHumanize}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate with AI"}
                </button>

                {/* Category */}
                <select
                  className="form-select mt-3"
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
                </select>

                {/* Image Upload */}
                <label htmlFor="imageUpload" className="form-label mt-3">
                  Post Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreate}
                  disabled={posting}
                >
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

          </Row>
        )}
      </Container>
    </Layout>
  );
};

export default UserProfile;