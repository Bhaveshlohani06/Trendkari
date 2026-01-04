import Image from "react-bootstrap/Image";
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import SearchModal from "../Components/SearchModal";
import { Select } from "antd";
import {
  Navbar,
  Container,
  Nav,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { FaBars, FaSearch, FaPen } from "react-icons/fa";
import API from '../../utils/api'
const Header = ({ toggleSidebar }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const { Option } = Select;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("hi"); 
const [location, setLocation] = useState("kota"); 

  const [image, setImage] = useState(null);
  const [status] = useState("published");
  const [isFeatured] = useState(false);
  const [tags] = useState("");
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false)
  const [categories, setCategories] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  

  const contentRef = useRef(null);

  // Get user
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  // Logout
  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
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
     //   postData.append('status', status);
        postData.append('isFeatured', isFeatured);
        postData.append('image', image);
        postData.append('tags', tags);
        postData.append('language', language);
        postData.append('location', location);




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
      

    // Clean pasted content
  // const handlePaste = (e) => {
  //   e.preventDefault();
  //   const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text/plain");

  //   // Strip MS Word junk tags
  //   const cleaned = text
  //     .replace(/<!--.*?-->/g, "") // remove comments
  //     .replace(/<o:p>|<\/o:p>/g, "") // remove <o:p>
  //     .replace(/class="?Mso.*?"/g, ""); // remove Word styles

  //   document.execCommand("insertHTML", false, cleaned);
  // };
  return (
    <>
      <Navbar bg="dark" variant="dark" className="shadow-sm px-3 sticky-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Left section */}
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-light"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="d-flex align-items-center"
            >
              <FaBars />
            </Button>

            <Navbar.Brand
              as={NavLink}
              to="/"
              className="fw-bold fs-4 m-0"
            >
              Trendkari
            </Navbar.Brand>
          </div>


          {/* Right section */}
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="outline-light"
              size="sm"
              aria-label="Search"
              onClick={() => setShowSearchModal(true)}
            >
              <FaSearch />
            </Button>

            {/* Writing Icon */}
            {auth?.user && (
              <Button
                variant="outline-light"
                size="sm"
                aria-label="Create Post"
                onClick={() => setShowModal(true)}
              >
                <FaPen />
              </Button>
            )}

            {!auth?.user ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="text-white">
                  Login  
                </Nav.Link>
                {/* <Nav.Link as={NavLink} to="/register" className="text-white">
                  Signup
                </Nav.Link> */}
              </>
            ) : (
              <NavDropdown
                title={
   <Image
 src={user.avatar || "/default-avatar.png"}
   alt=" Avatar"
  roundedCircle
  style={{
    width: "40px",
    height: "40px",
    objectFit: "cover",
    border: !auth?.user?.avatar ? "2px solid #ccc" : "none",
    display: "block",
    margin: 'auto',
  }}
/>
  }
                id="user-nav-dropdown"
                align="end"
              >
                {userId && (
                  <NavDropdown.Item as={NavLink} to={`/profile/${userId}`}>
                    {auth.user.name}
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Search Modal */}
      <SearchModal 
        show={showSearchModal} 
        onHide={() => setShowSearchModal(false)} 
      />

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



{/* Location */}
<select
  className="form-select mt-3"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
>
  <option value="kota">कोटा</option>
  <option value="ramganjmandi">रामगंजमंडी</option>
  <option value="sangod">सांगोद</option>
  <option value="ladpura">लाडपुरा</option>
  <option value="kaithoon">कैथून</option>
  <option value="modak">मोड़क</option>
  <option value="rural-kota">ग्रामीण कोटा</option>
</select>




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

{/* Language */}
<select
  className="form-select mt-3"
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
>
  <option value="hi">हिंदी</option>
  <option value="en">English</option>
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
    </>
  );
};

export default Header;
