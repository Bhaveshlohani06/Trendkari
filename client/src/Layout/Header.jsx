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
import { useTheme } from "../context/ThemeContext.jsx";
import NotificationBell from "../Components/NotificationBell.jsx";


const Header = ({ toggleSidebar }) => {
  const [auth, setAuth] = useAuth();
    const { theme, toggleTheme } = useTheme();

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
      {/* <Navbar bg="dark" variant="dark" className="shadow-sm px-3 sticky-top"> */}

<Navbar
  className={`shadow-sm px-3 sticky-top ${
    theme === "dark" ? "navbar-dark" : "navbar-light"
  }`}
>


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

            {/* <Navbar.Brand
              as={NavLink}
              to="/"
              className="fw-bold fs-4 m-0"
            >
              Trendkari
            </Navbar.Brand> */}




                    {/* Location Selector */}
                       
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


            {/* Theme Toggle Button */}

  <Button
      size="sm"
      variant={theme === "dark" ? "light" : "dark"}
      onClick={toggleTheme}
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </Button>

                      <NotificationBell />


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
//  src={user.avatar || "/default-avatar.png"}

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
                  <NavDropdown.Item
  as={NavLink}
  to={`/dashboard/user/profile/${userId}`}
>
  {auth.user.name}
</NavDropdown.Item>
                )}

                {auth?.user?.role === "admin" && (
  <NavDropdown.Item
    as={NavLink}
    to="/dashboard/admin"
  >
    Admin Dashboard
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
    <p style={{ color: '#888' }}>Start writing or paste your article...</p>)}
</div>


                {/* Generate AI button */}
                {/* <button
                  className="btn btn-warning btn-sm m-3"
                  onClick={generateAndHumanize}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate with AI"}
                </button> */}



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

// import React, { useState, useRef, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/auth";
// import SearchModal from "../Components/SearchModal";
// import { Select } from "antd";
// import {
//   Navbar,
//   Container,
//   Nav,
//   Button,
//   NavDropdown,
//   Form,
//   Badge
// } from "react-bootstrap";
// import { 
//   FaBars, 
//   FaSearch, 
//   FaPen, 
//   FaSun, 
//   FaMoon, 
//   FaUser, 
//   FaMapMarkerAlt,
//   FaGlobeAsia
// } from "react-icons/fa";
// import { FiMapPin, FiNavigation } from "react-icons/fi";
// import API from '../../utils/api'
// import { useTheme } from "../context/ThemeContext.jsx";

// const Header = ({ toggleSidebar, onLocationChange }) => {
//   const [auth, setAuth] = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();

//   const { Option } = Select;

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [language, setLanguage] = useState("hi"); 
//   const [location, setLocation] = useState("kota"); 
//   const [image, setImage] = useState(null);
//   const [status] = useState("published");
//   const [isFeatured] = useState(false);
//   const [tags] = useState("");
//   const [generating, setGenerating] = useState(false);
//   const [posting, setPosting] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [showSearchModal, setShowSearchModal] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState('kota');
//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
  
//   const contentRef = useRef(null);

//   // Get user
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?._id || user?.id;

//   // Define cities with more details
//   const cities = [
//     { 
//       label: "कोटा", 
//       value: "kota", 
//       color: "#1E3A8A",
//       districts: ["Kota City", "Kota Town"],
//       population: "1.2M"
//     },
//     { 
//       label: "रामगंजमंडी", 
//       value: "ramganjmandi", 
//       color: "#059669",
//       districts: ["Ramganj Mandi"],
//       population: "85K"
//     },
//     { 
//       label: "सांगोद", 
//       value: "sangod", 
//       color: "#7C3AED",
//       districts: ["Sangod"],
//       population: "45K"
//     },
//     { 
//       label: "लाडपुरा", 
//       value: "ladpura", 
//       color: "#22c9d5",
//       districts: ["Ladpura"],
//       population: "60K"
//     },
//     { 
//       label: "ग्रामीण कोटा", 
//       value: "rural-kota", 
//       color: "#EA580C",
//       districts: ["Kota Rural", "Gramin"],
//       population: "300K"
//     },
//     { 
//       label: "कैथून", 
//       value: "kaithoon", 
//       color: "#DC2626",
//       districts: ["Kaithoon"],
//       population: "25K"
//     },
//     { 
//       label: "मोड़क", 
//       value: "modak", 
//       color: "#CA8A04",
//       districts: ["Modak"],
//       population: "20K"
//     }
//   ];

//   // Get current city details
//   const getCurrentCity = () => {
//     return cities.find(city => city.value === selectedLocation) || cities[0];
//   };

//   // Handle location change
//   const handleLocationChange = async (newLocation) => {
//     setSelectedLocation(newLocation);
    
//     // Fetch weather for new location
//     await getWeatherByCity(newLocation);
    
//     // Notify parent component about location change
//     if (onLocationChange) {
//       onLocationChange(newLocation);
//     }
    
//     // Optional: Store in localStorage for persistence
//     localStorage.setItem('preferredLocation', newLocation);
//   };

//   // Get weather data
//   const getWeatherByCity = async (city) => {
//     try {
//       setWeatherLoading(true);
//       const { data } = await API.get(`/weather?city=${city}`);

//       if (data && data.temp !== undefined) {
//         setWeather({
//           temp: Math.round(data.temp),
//           feelsLike: Math.round(data.feelsLike),
//           condition: data.condition,
//           humidity: data.humidity,
//           windSpeed: data.windSpeed
//         });
//       } else {
//         // Fallback mock weather data
//         setWeather({
//           temp: 28,
//           feelsLike: 30,
//           condition: "Partly Cloudy",
//           humidity: 65,
//           windSpeed: 12
//         });
//       }
//     } catch (error) {
//       console.error("Weather fetch failed", error);
//       // Mock data for demo
//       setWeather({
//         temp: 30,
//         feelsLike: 32,
//         condition: "Sunny",
//         humidity: 60,
//         windSpeed: 10
//       });
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     setAuth({ user: null, token: "" });
//     localStorage.clear();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const BACKEND_URL = `https://trendkari.onrender.com/api/v1/post`;

//   // Load categories
//   const getAllCategories = async () => {
//     try {
//       const { data } = await API.get('/category/categories');
//       if (data?.success) {
//         setCategories(data?.categories);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error('Error while loading categories');
//     }
//   };

//   useEffect(() => {
//     // Load saved location or default
//     const savedLocation = localStorage.getItem('preferredLocation') || 'kota';
//     setSelectedLocation(savedLocation);
    
//     // Initialize weather for current location
//     getWeatherByCity(savedLocation);
    
//     // Load categories
//     getAllCategories();
    
//     // Notify parent about initial location
//     if (onLocationChange) {
//       onLocationChange(savedLocation);
//     }
//   }, []);

//   // Generate content with AI
//   const generateAndHumanize = async () => {
//     const token = localStorage.getItem("token");

//     if (!title) {
//       toast.error('Please enter a title');
//       return;
//     }

//     if(!token){
//       toast.error("Please login to generate content");
//       return;
//     }

//     setGenerating(true);

//     try {
//       const genRes = await API.post(
//         `${BACKEND_URL}/generate`,
//         { prompt: title },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const generated = genRes?.data?.content;

//       if (!generated) {
//         toast.error("Failed to generate content");
//         return;
//       }

//       const humRes = await API.post(
//         `${BACKEND_URL}/humanize`,
//         { htmlContent: generated },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const humanized = humRes?.data?.content;

//       if (!humanized) {
//         toast.error("Failed to humanize content");
//         return;
//       }

//       setContent(humanized);
//       if (contentRef.current) {
//         contentRef.current.innerHTML = humanized;
//       }

//       toast.success('Content generated and humanized!');
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // Submit post handler
//   const handleCreate = async (e) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please login to create a post");
//       return;
//     }

//     setPosting(true);
//     e.preventDefault();
    
//     try {
//       const postData = new FormData();
//       postData.append('title', title);
//       postData.append('content', contentRef.current.innerHTML);
//       postData.append('category', category);
//       postData.append('isFeatured', isFeatured);
//       postData.append('image', image);
//       postData.append('tags', tags);
//       postData.append('language', language);
//       postData.append('location', location);

//       const { data } = await API.post("/post/create-post", postData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (data?.error) {
//         toast.error(data?.message);
//       } else {
//         toast.success("Post Created Successfully");
//         setShowModal(false);
//         // Reset form
//         setTitle("");
//         setContent("");
//         setCategory("");
//         setImage(null);
//         if (contentRef.current) {
//           contentRef.current.innerHTML = "";
//         }
//         navigate(`/explore?location=${selectedLocation}`);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in creating the Post");
//     } finally {
//       setPosting(false);
//     }
//   };

//   // Weather icon based on condition
//   const getWeatherIcon = (condition) => {
//     if (!condition) return "☀️";
//     const cond = condition.toLowerCase();
//     if (cond.includes('sun') || cond.includes('clear')) return "☀️";
//     if (cond.includes('cloud')) return "☁️";
//     if (cond.includes('rain')) return "🌧️";
//     if (cond.includes('storm')) return "⛈️";
//     if (cond.includes('wind')) return "💨";
//     return "🌤️";
//   };

//   return (
//     <>
//       {/* Enhanced Navbar with location focus */}
//       <Navbar
//         expand="lg"
//         className={`shadow-sm px-3 sticky-top ${
//           theme === "dark" 
//             ? "navbar-dark bg-dark" 
//             : "navbar-light bg-white"
//         }`}
//         style={{
//           borderBottom: theme === "dark" ? "1px solid #444" : "1px solid #eaeaea"
//         }}
//       >
//         <Container fluid className="d-flex justify-content-between align-items-center">
//           {/* Left section */}
//           <div className="d-flex align-items-center gap-3">
//             <Button
//               variant={theme === "dark" ? "outline-light" : "outline-dark"}
//               onClick={toggleSidebar}
//               aria-label="Toggle sidebar"
//               className="d-flex align-items-center border-1"
//               style={{
//                 borderColor: theme === "dark" ? "#666" : "#ddd",
//                 background: "transparent"
//               }}
//             >
//               <FaBars />
//             </Button>

//             <Navbar.Brand
//               as={NavLink}
//               to="/"
//               className="fw-bold fs-4 m-0 d-flex align-items-center"
//               style={{
//                 color: theme === "dark" ? "#fff" : "#000"
//               }}
//             >
//               <FaGlobeAsia className="me-2" />
//               Trendkari
//             </Navbar.Brand>
//           </div>

//           {/* Center section - Location Selector */}
//           <div className="d-flex flex-column align-items-center mx-auto">
//             {/* Location Label */}
//             <div className="d-flex align-items-center mb-1">
//               <FiMapPin className="me-2" style={{ color: "#dc3545" }} />
//               <small className="text-muted" style={{ 
//                 fontSize: "0.8rem",
//                 color: theme === "dark" ? "#aaa" : "#666"
//               }}>
//                 LOCATION
//               </small>
//             </div>
            
//             {/* Enhanced Location Selector */}
//           <div className="d-flex align-items-center gap-2">

//   <FiNavigation
//     className={theme === "dark" ? "text-gray-400" : "text-muted"}
//   />

//   <Select
//     value={selectedLocation}
//     onChange={handleLocationChange}
//     className={`location-select ${theme}`}
//     style={{ width: 200 }}
//     dropdownClassName={theme === "dark" ? "dark-dropdown" : ""}
//   >
//     {cities.map((city) => (
//       <Option key={city.value} value={city.value}>
//         <div className="d-flex align-items-center gap-2">
//           <span
//             className="location-dot"
//             style={{ backgroundColor: city.color }}
//           />
//           <span className="fw-medium">{city.label}</span>
//         </div>
//       </Option>
//     ))}
//   </Select>

// </div>


// {/* Weather Display */} 
// {weather && ( <div className="d-flex align-items-center ms-3"> 
//   <div className="weather-display d-flex align-items-center"> <span className="me-2" style={{ fontSize: "1.5rem" }}> {getWeatherIcon(weather.condition)} </span> <div> <div className="fw-bold" style={{ fontSize: "1.1rem", color: theme === "dark" ? "#fff" : "#000" }}> {weather.temp}°C </div> <small style={{ fontSize: "0.75rem", color: theme === "dark" ? "#aaa" : "#666" }}> {weather.condition} </small> </div> </div> </div> )}

            
//             {/* Current City Info */}
//             <div className="mt-2">
//               <Badge 
//                 bg="light" 
//                 text="dark"
//                 className="px-3 py-1"
//                 style={{ 
//                   backgroundColor: getCurrentCity().color + "20",
//                   color: getCurrentCity().color,
//                   border: `1px solid ${getCurrentCity().color}40`
//                 }}
//               >
//                 <FaMapMarkerAlt className="me-1" />
//                 {getCurrentCity().label}
//               </Badge>
//             </div>
//           </div>

//           {/* Right section */}
//           <div className="d-flex align-items-center gap-3">
//             {/* Search Button */}
//             <Button
//               variant={theme === "dark" ? "outline-light" : "outline-secondary"}
//               size="sm"
//               aria-label="Search"
//               onClick={() => setShowSearchModal(true)}
//               className="d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50%",
//                 borderColor: theme === "dark" ? "#666" : "#ddd"
//               }}
//             >
//               <FaSearch />
//             </Button>

//             {/* Theme Toggle Button */}
//             <Button
//               variant={theme === "dark" ? "light" : "dark"}
//               size="sm"
//               onClick={toggleTheme}
//               className="d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50%"
//               }}
//             >
//               {theme === "dark" ? <FaSun /> : <FaMoon />}
//             </Button>

//             {/* Create Post Button - Only for logged in users */}
//             {auth?.user && (
//               <Button
//                 variant="primary"
//                 size="sm"
//                 aria-label="Create Post"
//                 onClick={() => setShowModal(true)}
//                 className="d-flex align-items-center"
//               >
//                 <FaPen className="me-2" />
//                 <span className="d-none d-md-inline">Create</span>
//               </Button>
//             )}

//             {/* User Dropdown */}
//             {auth?.user && (
//               <NavDropdown
//                 title={
//                   <div className="d-flex align-items-center">
//                     {user?.avatar ? (
//                       <Image
//                         src={user.avatar}
//                         alt="User Avatar"
//                         roundedCircle
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           objectFit: "cover",
//                           border: "2px solid",
//                           borderColor: theme === "dark" ? "#666" : "#ddd"
//                         }}
//                       />
//                     ) : (
//                       <div 
//                         className="rounded-circle d-flex align-items-center justify-content-center"
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           backgroundColor: theme === "dark" ? "#444" : "#f0f0f0",
//                           color: theme === "dark" ? "#fff" : "#333",
//                           border: "2px solid",
//                           borderColor: theme === "dark" ? "#666" : "#ddd"
//                         }}
//                       >
//                         <FaUser />
//                       </div>
//                     )}
//                   </div>
//                 }
//                 id="user-nav-dropdown"
//                 align="end"
//                 className={`${theme === "dark" ? "dropdown-menu-dark" : ""}`}
//               >
//                 <div className="px-3 py-2">
//                   <div className="fw-bold" style={{ color: theme === "dark" ? "#fff" : "#000" }}>
//                     {auth.user.name}
//                   </div>
//                   <div className="text-muted small">{auth.user.email}</div>
//                 </div>
//                 <NavDropdown.Divider />
                
//                 <NavDropdown.Item
//                   as={NavLink}
//                   to={`/dashboard/user/profile/${userId}`}
//                   className="d-flex align-items-center"
//                 >
//                   <FaUser className="me-2" />
//                   Profile
//                 </NavDropdown.Item>
                
//                 <NavDropdown.Item
//                   as={NavLink}
//                   to="/dashboard/user/posts"
//                   className="d-flex align-items-center"
//                 >
//                   <FaPen className="me-2" />
//                   My Posts
//                 </NavDropdown.Item>

//                 {auth?.user?.role === "admin" && (
//                   <>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item
//                       as={NavLink}
//                       to="/dashboard/admin"
//                       className="fw-bold"
//                       style={{ color: theme === "dark" ? "#0dcaf0" : "#0d6efd" }}
//                     >
//                       Admin Dashboard
//                     </NavDropdown.Item>
//                   </>
//                 )}

//                 <NavDropdown.Divider />
//                 <NavDropdown.Item 
//                   onClick={handleLogout} 
//                   className="text-danger d-flex align-items-center"
//                 >
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             )}

//             {/* Login Button (only show when not logged in - commented out per request) */}
//             {/*
//             {!auth?.user && (
//               <Button
//                 variant="outline-primary"
//                 as={NavLink}
//                 to="/login"
//                 size="sm"
//               >
//                 Login
//               </Button>
//             )}
//             */}
//           </div>
//         </Container>
//       </Navbar>

//       {/* Search Modal */}
//       <SearchModal 
//         show={showSearchModal} 
//         onHide={() => setShowSearchModal(false)} 
//         theme={theme}
//         location={selectedLocation}
//       />

//       {/* Post Creation Modal */}
//       {showModal && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={() => setShowModal(false)}
//         >
//           <div 
//             className="modal-dialog modal-lg" 
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div 
//               className="modal-content"
//               style={{
//                 backgroundColor: theme === "dark" ? "#2d3748" : "#fff",
//                 color: theme === "dark" ? "#fff" : "#000"
//               }}
//             >
//               <div className="modal-header border-bottom"
//                 style={{ borderColor: theme === "dark" ? "#444" : "#dee2e6" }}
//               >
//                 <div className="d-flex align-items-center w-100">
//                   <FaMapMarkerAlt className="me-2" style={{ color: getCurrentCity().color }} />
//                   <h5 className="modal-title mb-0">Create Post for {getCurrentCity().label}</h5>
//                 </div>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                   style={{
//                     filter: theme === "dark" ? "invert(1)" : "none"
//                   }}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 {/* Title */}
//                 <Form.Group className="mb-3">
//                   <Form.Control
//                     type="text"
//                     placeholder="Post Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                     style={{
//                       backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                       color: theme === "dark" ? "#fff" : "#000",
//                       borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                     }}
//                   />
//                 </Form.Group>

//                 {/* Editor Toolbar */}
//                 <div 
//                   className="d-flex gap-2 mb-3 p-2 rounded"
//                   style={{
//                     backgroundColor: theme === "dark" ? "#374151" : "#f8f9fa",
//                     border: `1px solid ${theme === "dark" ? "#4b5563" : "#dee2e6"}`
//                   }}
//                 >
//                   <button 
//                     className="btn btn-sm"
//                     onClick={() => document.execCommand("bold")}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#4b5563" : "#e9ecef",
//                       color: theme === "dark" ? "#fff" : "#000"
//                     }}
//                   >
//                     <b>B</b>
//                   </button>
//                   <button 
//                     className="btn btn-sm"
//                     onClick={() => document.execCommand("italic")}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#4b5563" : "#e9ecef",
//                       color: theme === "dark" ? "#fff" : "#000"
//                     }}
//                   >
//                     <i>I</i>
//                   </button>
//                   <button 
//                     className="btn btn-sm"
//                     onClick={() => document.execCommand("underline")}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#4b5563" : "#e9ecef",
//                       color: theme === "dark" ? "#fff" : "#000"
//                     }}
//                   >
//                     <u>U</u>
//                   </button>
//                   <div className="vr mx-2"></div>
//                   <button 
//                     className="btn btn-sm"
//                     onClick={() => document.execCommand("insertUnorderedList")}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#4b5563" : "#e9ecef",
//                       color: theme === "dark" ? "#fff" : "#000"
//                     }}
//                   >
//                     • List
//                   </button>
//                   <button 
//                     className="btn btn-sm"
//                     onClick={() => document.execCommand("insertOrderedList")}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#4b5563" : "#e9ecef",
//                       color: theme === "dark" ? "#fff" : "#000"
//                     }}
//                   >
//                     1. List
//                   </button>
//                 </div>

//                 {/* Editor */}
//                 <div
//                   ref={contentRef}
//                   contentEditable
//                   onInput={() => setContent(contentRef.current.innerHTML)}
//                   style={{
//                     minHeight: '300px',
//                     border: `1px solid ${theme === "dark" ? "#4b5563" : "#ced4da"}`,
//                     padding: '15px',
//                     borderRadius: '5px',
//                     backgroundColor: theme === "dark" ? "#374151" : '#fff',
//                     color: theme === "dark" ? "#fff" : '#000',
//                     fontSize: '16px',
//                     lineHeight: '1.6',
//                     direction: 'ltr',
//                     textAlign: 'left',
//                     outline: 'none',
//                   }}
//                   suppressContentEditableWarning={true}
//                 >
//                   {content ? (
//                     <div dangerouslySetInnerHTML={{ __html: content }} />
//                   ) : (
//                     <div style={{ color: theme === "dark" ? "#9ca3af" : "#6c757d" }}>
//                       Start writing your post here...
//                     </div>
//                   )}
//                 </div>

//                 {/* AI Generate Button */}
//                 <Button
//                   variant="warning"
//                   size="sm"
//                   className="mt-3"
//                   onClick={generateAndHumanize}
//                   disabled={generating}
//                 >
//                   {generating ? "Generating..." : "✨ Generate with AI"}
//                 </Button>

//                 {/* Location (Auto-set to current selection) */}
//                 <div className="mt-3">
//                   <Form.Label className="d-flex align-items-center">
//                     <FaMapMarkerAlt className="me-2" />
//                     Post Location
//                   </Form.Label>
//                   <Form.Select
//                     value={selectedLocation}
//                     onChange={(e) => {
//                       setSelectedLocation(e.target.value);
//                       setLocation(e.target.value);
//                     }}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                       color: theme === "dark" ? "#fff" : "#000",
//                       borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                     }}
//                   >
//                     {cities.map((city) => (
//                       <option key={city.value} value={city.value}>
//                         {city.label}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </div>

//                 {/* Category */}
//                 <Form.Select
//                   className="mt-3"
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   required
//                   style={{
//                     backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                     color: theme === "dark" ? "#fff" : "#000",
//                     borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                   }}
//                 >
//                   <option value="">Select category</option>
//                   {categories?.map((c) => (
//                     <option key={c._id} value={c._id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </Form.Select>

//                 {/* Language */}
//                 <Form.Select
//                   className="mt-3"
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   style={{
//                     backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                     color: theme === "dark" ? "#fff" : "#000",
//                     borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                   }}
//                 >
//                   <option value="hi">हिंदी</option>
//                   <option value="en">English</option>
//                 </Form.Select>

//                 {/* Image Upload */}
//                 <Form.Group className="mt-3">
//                   <Form.Label>Post Image</Form.Label>
//                   <Form.Control
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setImage(e.target.files[0])}
//                     style={{
//                       backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                       color: theme === "dark" ? "#fff" : "#000",
//                       borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                     }}
//                   />
//                 </Form.Group>
//               </div>

//               <div className="modal-footer border-top"
//                 style={{ borderColor: theme === "dark" ? "#444" : "#dee2e6" }}
//               >
//                 <Button
//                   variant="secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={handleCreate}
//                   disabled={posting}
//                 >
//                   {posting ? "Publishing..." : `Publish in ${getCurrentCity().label}`}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;


// import React, { useEffect, useState } from "react";
// import { Navbar, Container, Button, Form } from "react-bootstrap";
// import { Select, Switch } from "antd";
// import { FaBars, FaUserCircle } from "react-icons/fa";
// import { FiMapPin, FiSearch } from "react-icons/fi";

// const { Option } = Select;

// const locations = [
//   { label: "कोटा", value: "kota" },
//   { label: "रामगंजमंडी", value: "ramganjmandi" },
//   { label: "सांगोद", value: "sangod" },
//   { label: "लाडपुरा", value: "ladpura" },
//   { label: "ग्रामीण कोटा", value: "rural-kota" },
// ];

// const Header = ({
//   toggleSidebar,
//   onLocationChange,
//   onSearch,
//   isAuthenticated = false,
//   user = null,
//   toggleTheme,
// }) => {
//   const [location, setLocation] = useState("kota");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const saved = localStorage.getItem("preferredLocation") || "kota";
//     setLocation(saved);
//     onLocationChange(saved);
//   }, []);

//   const handleLocationChange = (value) => {
//     setLocation(value);
//     localStorage.setItem("preferredLocation", value);
//     onLocationChange(value);
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     onSearch(value);
//   };

//   return (
//     <Navbar bg="white" className="shadow-sm sticky-top">
//       <Container fluid className="d-flex align-items-center gap-3">

//         {/* ☰ SIDEBAR TOGGLE */}
//         <Button variant="outline-secondary" onClick={toggleSidebar}>
//           <FaBars />
//         </Button>

//         {/* 🟠 LOGO */}
//         <Navbar.Brand className="fw-bold text-danger">
//           Trendkari
//         </Navbar.Brand>

//         {/* 📍 LOCATION */}
//         <div className="d-flex align-items-center gap-1">
//           <FiMapPin className="text-danger" />
//           <Select
//             value={location}
//             onChange={handleLocationChange}
//             style={{ width: 160 }}
//           >
//             {locations.map((loc) => (
//               <Option key={loc.value} value={loc.value}>
//                 {loc.label}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         {/* 🔍 SEARCH */}
//         <Form className="d-flex align-items-center ms-auto me-3">
//           <FiSearch className="me-2 text-muted" />
//           <Form.Control
//             type="search"
//             placeholder="खबर खोजें..."
//             value={search}
//             onChange={handleSearch}
//             style={{ width: 220 }}
//           />
//         </Form>

//         {/* 🌙 DARK MODE */}
//         <Switch onChange={toggleTheme} />

//         {/* 👤 USER / AUTH */}
//         {isAuthenticated ? (
//           <div className="d-flex align-items-center gap-2 ms-3">
//             <FaUserCircle size={24} />
//             <span className="fw-semibold">{user?.name}</span>
//           </div>
//         ) : (
//           <div className="d-flex gap-2 ms-3">
//             <Button variant="outline-primary" size="sm">
//               Login
//             </Button>
//           </div>
//         )}

//       </Container>
//     </Navbar>
//   );
// };

// export default Header;



// import Image from "react-bootstrap/Image";
// import React, { useState, useRef, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/auth";
// import SearchModal from "../Components/SearchModal";
// import { Select } from "antd";
// import {
//   Navbar,
//   Container,
//   Nav,
//   Button,
//   NavDropdown,
//   Form,
//   Badge
// } from "react-bootstrap";
// import { 
//   FaBars, 
//   FaSearch, 
//   FaPen, 
//   FaSun, 
//   FaMoon, 
//   FaUser,
//   FaMapMarkerAlt,
//   FaThermometerHalf,
//   FaCloudSun,
//   FaCloudRain,
//   FaCloud
// } from "react-icons/fa";
// import { FiMapPin, FiNavigation } from "react-icons/fi";
// import { WiDaySunny, WiCloudy, WiRain, WiDayCloudy } from "react-icons/wi";
// import API from '../../utils/api'
// import { useTheme } from "../context/ThemeContext.jsx";
// import { useLocation } from "../context/LocationContext.jsx";

// const Header = ({ toggleSidebar, selectedLocation, onLocationChange }) => {
//   const [auth, setAuth] = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();

//   const { Option } = Select;

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [language, setLanguage] = useState("hi"); 
//   const [image, setImage] = useState(null);
//   const [generating, setGenerating] = useState(false);
//   const [posting, setPosting] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [showSearchModal, setShowSearchModal] = useState(false);
//   const [weather, setWeather] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//     const { location, changeLocation } = useLocation();

  
//   const contentRef = useRef(null);

//   // Get user
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?._id || user?.id;

//   // Define cities with personalized data
//   const cities = [
//     { 
//       label: "कोटा", 
//       value: "kota", 
//       color: "#1E3A8A",
//       specialty: "Education Hub",
//       icon: "🏛️",
//       area: "318 km²",
//       famousFor: "Coaching Institutes, Chambal Garden"
//     },
//     { 
//       label: "रामगंजमंडी", 
//       value: "ramganjmandi", 
//       color: "#059669",
//       specialty: "Agricultural Zone",
//       icon: "🌾",
//       area: "285 km²",
//       famousFor: "Farms, Local Markets"
//     },
//     { 
//       label: "सांगोद", 
//       value: "sangod", 
//       color: "#7C3AED",
//       specialty: "Riverside Town",
//       icon: "🏞️",
//       area: "150 km²",
//       famousFor: "Chambal River, Peaceful Environment"
//     },
//     { 
//       label: "लाडपुरा", 
//       value: "ladpura", 
//       color: "#22c9d5",
//       specialty: "Residential Area",
//       icon: "🏠",
//       area: "120 km²",
//       famousFor: "Residential Colonies"
//     },
//     { 
//       label: "ग्रामीण कोटा", 
//       value: "rural-kota", 
//       color: "#EA580C",
//       specialty: "Village Life",
//       icon: "🌳",
//       area: "500 km²",
//       famousFor: "Traditional Lifestyle, Farms"
//     },
//     { 
//       label: "कैथून", 
//       value: "kaithoon", 
//       color: "#DC2626",
//       specialty: "Historical Town",
//       icon: "⛩️",
//       area: "85 km²",
//       famousFor: "Historical Sites"
//     },
//     { 
//       label: "मोड़क", 
//       value: "modak", 
//       color: "#CA8A04",
//       specialty: "Market Town",
//       icon: "🛒",
//       area: "75 km²",
//       famousFor: "Local Markets"
//     }
//   ];

//   // Get current city details
//   const getCurrentCity = () => {
//     return cities.find(city => city.value === selectedLocation) || cities[0];
//   };

//   // Handle location change
//   const handleLocationChange = async (newLocation) => {
//     setSelectedLocation(newLocation);
//     setLocation(newLocation); // Also update the post location
    
//     // Fetch weather for new location
//     await getWeatherByCity(newLocation);
    
//     // Notify parent component about location change
//     if (onLocationChange) {
//       onLocationChange(newLocation);
//     }
    
//     // Store in localStorage for persistence
//     localStorage.setItem('preferredLocation', newLocation);
//   };

//   // Get weather data
//   const getWeatherByCity = async (city) => {
//     try {
//       setWeatherLoading(true);
//       const { data } = await API.get(`/weather?city=${city}`);

//       if (data && data.temp !== undefined) {
//         setWeather({
//           temp: Math.round(data.temp),
//           feelsLike: Math.round(data.feelsLike),
//           condition: data.condition,
//           humidity: data.humidity || 65,
//           windSpeed: data.windSpeed || 10
//         });
//       } else {
//         // Fallback mock weather data
//         setWeather({
//           temp: 28 + Math.floor(Math.random() * 5),
//           feelsLike: 30 + Math.floor(Math.random() * 5),
//           condition: ["Sunny", "Partly Cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
//           humidity: 60 + Math.floor(Math.random() * 20),
//           windSpeed: 8 + Math.floor(Math.random() * 8)
//         });
//       }
//     } catch (error) {
//       console.error("Weather fetch failed", error);
//       // Mock data for demo
//       setWeather({
//         temp: 30,
//         feelsLike: 32,
//         condition: "Sunny",
//         humidity: 60,
//         windSpeed: 10
//       });
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     setAuth({ user: null, token: "" });
//     localStorage.clear();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const BACKEND_URL = `https://trendkari.onrender.com/api/v1/post`;

//   // Load categories
//   const getAllCategories = async () => {
//     try {
//       const { data } = await API.get('/category/categories');
//       if (data?.success) {
//         setCategories(data?.categories);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error('Error while loading categories');
//     }
//   };



//   // Generate content with AI
//   const generateAndHumanize = async () => {
//     const token = localStorage.getItem("token");

//     if (!title) {
//       toast.error('Please enter a title');
//       return;
//     }

//     if(!token){
//       toast.error("Please login to generate content");
//       return;
//     }

//     setGenerating(true);

//     try {
//       const genRes = await API.post(
//         `${BACKEND_URL}/generate`,
//         { prompt: title },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const generated = genRes?.data?.content;

//       if (!generated) {
//         toast.error("Failed to generate content");
//         return;
//       }

//       const humRes = await API.post(
//         `${BACKEND_URL}/humanize`,
//         { htmlContent: generated },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const humanized = humRes?.data?.content;

//       if (!humanized) {
//         toast.error("Failed to humanize content");
//         return;
//       }

//       setContent(humanized);
//       if (contentRef.current) {
//         contentRef.current.innerHTML = humanized;
//       }

//       toast.success('Content generated and humanized!');
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // Submit post handler
//   const handleCreate = async (e) => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       toast.error("Please login to create a post");
//       return;
//     }

//     setPosting(true);
//     e.preventDefault();
    
//     try {
//       const postData = new FormData();
//       postData.append('title', title);
//       postData.append('content', contentRef.current.innerHTML);
//       postData.append('category', category);
//       postData.append('image', image);
//       postData.append('language', language);
//       postData.append('location', selectedLocation); // Use selected location

//       const { data } = await API.post("/post/create-post", postData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (data?.error) {
//         toast.error(data?.message);
//       } else {
//         toast.success(`Post Created Successfully for ${getCurrentCity().label}`);
//         setShowModal(false);
//         // Reset form
//         setTitle("");
//         setContent("");
//         setCategory("");
//         setImage(null);
//         if (contentRef.current) {
//           contentRef.current.innerHTML = "";
//         }
//         // Refresh page or navigate
//         window.location.reload();
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in creating the Post");
//     } finally {
//       setPosting(false);
//     }
//   };



//   return (
//     <>
//       {/* Clean Header focused on location */}
//       <Navbar
//         expand="lg"
//         className={`shadow-sm px-3 sticky-top ${
//           theme === "dark" 
//             ? "navbar-dark bg-dark" 
//             : "navbar-light bg-white"
//         }`}
//         style={{
//           borderBottom: theme === "dark" ? "1px solid #444" : "1px solid #eaeaea",
//           height: "70px"
//         }}
//       >
//         <Container fluid className="d-flex justify-content-between align-items-center">
//           {/* Left: Location Selector */}
//           <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
//             {/* Sidebar Toggle */}
//             <Button
//               variant={theme === "dark" ? "outline-light" : "outline-dark"}
//               onClick={toggleSidebar}
//               aria-label="Toggle sidebar"
//               className="d-flex align-items-center border-1"
//               style={{
//                 borderColor: theme === "dark" ? "#666" : "#ddd",
//                 background: "transparent"
//               }}
//             >
//               <FaBars />
//             </Button>

//             {/* Location Selector */}
// <Select
//   value={location}
//   onChange={onLocationChange}
//   className="location-select"
//   style={{ width: 180 }}
// >
//   {cities.map((city) => (
//     <Option key={city.value} value={city.value}>
//       {city.label}
//     </Option>
//   ))}
// </Select>


         
//           </div>

//           {/* Right: Action Buttons */}
//           <div className="d-flex align-items-center gap-2" style={{ flex: 1, justifyContent: "flex-end" }}>
//             {/* Search Button */}
//             <Button
//               variant={theme === "dark" ? "outline-light" : "outline-dark"}
//               size="sm"
//               aria-label="Search"
//               onClick={() => setShowSearchModal(true)}
//               className="d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50%"
//               }}
//             >
//               <FaSearch />
//             </Button>

//             {/* Theme Toggle */}
//             <Button
//               variant={theme === "dark" ? "light" : "dark"}
//               size="sm"
//               onClick={toggleTheme}
//               className="d-flex align-items-center justify-content-center"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50%"
//               }}
//             >
//               {theme === "dark" ? <FaSun /> : <FaMoon />}
//             </Button>

//             {/* Create Post Button (for logged in users) */}
//             {auth?.user && (
//               <Button
//                 variant="primary"
//                 size="sm"
//                 aria-label="Create Post"
//                 onClick={() => setShowModal(true)}
//                 className="d-flex align-items-center"
//               >
//                 <FaPen className="me-1" />
//                 <span className="d-none d-md-inline">Post</span>
//               </Button>
//             )}

//             {/* User Profile or Login */}
//             {auth?.user ? (
//               <NavDropdown
//                 title={
//                   <div className="d-flex align-items-center">
//                     {user?.avatar ? (
//                       <Image
//                         src={user.avatar}
//                         alt="User Avatar"
//                         roundedCircle
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           objectFit: "cover",
//                           border: "2px solid",
//                           borderColor: getCurrentCity().color
//                         }}
//                       />
//                     ) : (
//                       <div 
//                         className="rounded-circle d-flex align-items-center justify-content-center"
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           backgroundColor: getCurrentCity().color + "20",
//                           color: getCurrentCity().color,
//                           border: `2px solid ${getCurrentCity().color}`
//                         }}
//                       >
//                         <FaUser />
//                       </div>
//                     )}
//                   </div>
//                 }
//                 id="user-nav-dropdown"
//                 align="end"
//                 className={`${theme === "dark" ? "dropdown-menu-dark" : ""}`}
//               >
//                 <div className="px-3 py-2">
//                   <div className="fw-bold" style={{ 
//                     color: getCurrentCity().color,
//                     fontSize: "1.1rem"
//                   }}>
//                     {auth.user.name}
//                   </div>
//                   <div className="text-muted small">
//                     {getCurrentCity().label} • {auth.user.email}
//                   </div>
//                 </div>
//                 <NavDropdown.Divider />
                
//                 <NavDropdown.Item
//                   as={NavLink}
//                   to={`/dashboard/user/profile/${userId}`}
//                   className="d-flex align-items-center"
//                 >
//                   <FaUser className="me-2" />
//                   My Profile
//                 </NavDropdown.Item>
                
//                 <NavDropdown.Item
//                   as={NavLink}
//                   to={`/dashboard/user/posts?location=${selectedLocation}`}
//                   className="d-flex align-items-center"
//                 >
//                   <FaPen className="me-2" />
//                   My Posts in {getCurrentCity().label}
//                 </NavDropdown.Item>

//                 {auth?.user?.role === "admin" && (
//                   <>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item
//                       as={NavLink}
//                       to="/dashboard/admin"
//                       className="fw-bold"
//                       style={{ color: getCurrentCity().color }}
//                     >
//                       Admin Dashboard
//                     </NavDropdown.Item>
//                   </>
//                 )}

//                 <NavDropdown.Divider />
//                 <NavDropdown.Item 
//                   onClick={handleLogout} 
//                   className="text-danger d-flex align-items-center"
//                 >
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             ) : (
//               // Login Button (if needed in future)
//               <Button
//                 variant="outline-primary"
//                 as={NavLink}
//                 to="/login"
//                 size="sm"
//                 className="d-none d-md-inline-flex"
//               >
//                 Login
//               </Button>
//             )}
//           </div>
//         </Container>
//       </Navbar>

//       {/* Search Modal */}
//       <SearchModal 
//         show={showSearchModal} 
//         onHide={() => setShowSearchModal(false)} 
//         theme={theme}
//         location={selectedLocation}
//       />

//       {/* Post Creation Modal */}
//       {showModal && (
//         <div
//           className="modal show d-block"
//           tabIndex="-1"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={() => setShowModal(false)}
//         >
//           <div 
//             className="modal-dialog modal-lg" 
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div 
//               className="modal-content"
//               style={{
//                 backgroundColor: theme === "dark" ? "#2d3748" : "#fff",
//                 color: theme === "dark" ? "#fff" : "#000"
//               }}
//             >
//               <div className="modal-header border-bottom"
//                 style={{ 
//                   borderColor: getCurrentCity().color + "40",
//                   backgroundColor: getCurrentCity().color + "10"
//                 }}
//               >
//                 <div className="d-flex align-items-center w-100">
//                   <div 
//                     className="rounded-circle d-flex align-items-center justify-content-center me-3"
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       backgroundColor: getCurrentCity().color + "20",
//                       color: getCurrentCity().color
//                     }}
//                   >
//                     {getCurrentCity().icon}
//                   </div>
//                   <div>
//                     <h5 className="modal-title mb-0">Create Post for {getCurrentCity().label}</h5>
//                     <small className="text-muted">{getCurrentCity().specialty}</small>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowModal(false)}
//                   style={{
//                     filter: theme === "dark" ? "invert(1)" : "none"
//                   }}
//                 ></button>
//               </div>

//               <div className="modal-body">
//                 <Form>
//                   {/* Title */}
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">Post Title</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="What's happening in your city?"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       required
//                       style={{
//                         backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                         color: theme === "dark" ? "#fff" : "#000",
//                         borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                       }}
//                     />
//                   </Form.Group>

//                   {/* Content Editor */}
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">Content</Form.Label>
//                     <div
//                       ref={contentRef}
//                       contentEditable
//                       onInput={() => setContent(contentRef.current.innerHTML)}
//                       style={{
//                         minHeight: '250px',
//                         border: `1px solid ${theme === "dark" ? "#4b5563" : "#ced4da"}`,
//                         padding: '15px',
//                         borderRadius: '5px',
//                         backgroundColor: theme === "dark" ? "#374151" : '#fff',
//                         color: theme === "dark" ? "#fff" : '#000',
//                         fontSize: '16px',
//                         lineHeight: '1.6',
//                         direction: 'ltr',
//                         outline: 'none',
//                       }}
//                       suppressContentEditableWarning={true}
//                     >
//                       {content ? (
//                         <div dangerouslySetInnerHTML={{ __html: content }} />
//                       ) : (
//                         <div style={{ color: theme === "dark" ? "#9ca3af" : "#6c757d" }}>
//                           Share local news, events, or insights about {getCurrentCity().label}...
//                         </div>
//                       )}
//                     </div>
//                   </Form.Group>

//                   {/* AI Generate Button */}
//                   <Button
//                     variant="warning"
//                     className="mb-3"
//                     onClick={generateAndHumanize}
//                     disabled={generating}
//                   >
//                     {generating ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                         Generating...
//                       </>
//                     ) : (
//                       "✨ Generate with AI"
//                     )}
//                   </Button>

//                   {/* Location Info */}
//                   <div className="alert alert-info mb-3" style={{ 
//                     backgroundColor: getCurrentCity().color + "10",
//                     borderColor: getCurrentCity().color + "30",
//                     color: getCurrentCity().color
//                   }}>
//                     <div className="d-flex align-items-center">
//                       <FaMapMarkerAlt className="me-2" />
//                       <div>
//                         <strong>Posting to:</strong> {getCurrentCity().label}
//                         <small className="d-block">{getCurrentCity().famousFor}</small>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Category */}
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">Category</Form.Label>
//                     <Form.Select
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                       required
//                       style={{
//                         backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                         color: theme === "dark" ? "#fff" : "#000",
//                         borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                       }}
//                     >
//                       <option value="">Select a category</option>
//                       {categories?.map((c) => (
//                         <option key={c._id} value={c._id}>
//                           {c.name}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>

//                   {/* Language */}
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">Language</Form.Label>
//                     <Form.Select
//                       value={language}
//                       onChange={(e) => setLanguage(e.target.value)}
//                       style={{
//                         backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                         color: theme === "dark" ? "#fff" : "#000",
//                         borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                       }}
//                     >
//                       <option value="hi">हिंदी (Local)</option>
//                       <option value="en">English</option>
//                     </Form.Select>
//                   </Form.Group>

//                   {/* Image Upload */}
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">Add Image</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => setImage(e.target.files[0])}
//                       style={{
//                         backgroundColor: theme === "dark" ? "#374151" : "#fff",
//                         color: theme === "dark" ? "#fff" : "#000",
//                         borderColor: theme === "dark" ? "#4b5563" : "#ced4da"
//                       }}
//                     />
//                   </Form.Group>
//                 </Form>
//               </div>

//               <div className="modal-footer border-top"
//                 style={{ borderColor: theme === "dark" ? "#444" : "#dee2e6" }}
//               >
//                 <Button
//                   variant="secondary"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary"
//                   onClick={handleCreate}
//                   disabled={posting}
//                   style={{ 
//                     backgroundColor: getCurrentCity().color,
//                     borderColor: getCurrentCity().color
//                   }}
//                 >
//                   {posting ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2"></span>
//                       Publishing...
//                     </>
//                   ) : (
//                     `Publish in ${getCurrentCity().label}`
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;