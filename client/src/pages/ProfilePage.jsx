// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../utils/api";
// import { toast } from "react-toastify";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Dropdown,
//   Badge,
//   Spinner,
//   Image,
//   Stack,
//   Modal,
//   Alert,
// } from "react-bootstrap";
// import Layout from '../Layout/Layout';
// import { FaUserEdit, FaRegEdit, FaTrash, FaArrowLeft, FaEllipsisV, FaShareAlt, FaUsers, FaUserPlus, FaUserCheck, FaExclamationTriangle } from 'react-icons/fa';

// const UserProfile = () => {
//   const { userId } = useParams();
//  const { slug, location: routeLocation } = useParams();
// const [showCreateModal, setShowCreateModal] = useState(false);

//   // const [showModal, setShowModal] = useState(false);
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [aboutInput, setAboutInput] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followersCount, setFollowersCount] = useState(0);
//   const [followingCount, setFollowingCount] = useState(0);
//   const [error, setError] = useState(null);
//   const [apiError, setApiError] = useState(null);

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState(null);
//   const [status] = useState("published");
//   const [isFeatured] = useState(false);
//   const [tags] = useState("");
//   const [generating, setGenerating] = useState(false);
//   const [posting, setPosting] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();
  

//   const contentRef = useRef(null);
  
//   // Get loggedInUser ID only (not the whole object)
//   const loggedInUserId = JSON.parse(localStorage.getItem("user"))?._id;
//   const isOwner = loggedInUserId === userId;

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Only authorized users can view this page");
//         navigate("/login");
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         setApiError(null);
        
//         console.log("Fetching user data for ID:", userId);
        
//         // Fetch user details
//         const userRes = await API.get(`/auth/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         console.log("User API response:", userRes);
        
//         // Check if we actually got a user
//         if (!userRes.data || !userRes.data.user) {
//           throw new Error("User not found in response data");
//         }
        
//         setUser(userRes.data.user);
//         setAboutInput(userRes.data.user.bio || "");

//         // Set follower and following counts
//         setFollowersCount(userRes.data.user.followers?.length || 0);
//         setFollowingCount(userRes.data.user.following?.length || 0);

//         // Check if logged-in user already follows this user
//         if (loggedInUserId && userRes.data.user.followers?.some(f => f._id === loggedInUserId)) {
//           setIsFollowing(true);
//         }

//         // Fetch posts
//         try {
//           const postsRes = await API.get(`/post/profile/${userId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setPosts(postsRes.data);
//         } catch (postError) {
//           console.error("Error fetching posts:", postError);
//           // Continue even if posts fail to load
//           setPosts([]);
//         }
//       } catch (error) {
//         console.error("Profile loading error:", error);
        
//         if (error.response?.status === 500) {
//           setApiError("Server error when fetching user data");
//           setError("Server error. Please try again later.");
//           toast.error("Server error loading profile");
//         } else if (error.response?.status === 404) {
//           setError("User not found");
//           toast.error("The requested user profile does not exist");
//         } else if (error.response?.status === 401) {
//           setError("Authentication failed");
//           toast.error("Your session has expired. Please login again.");
//           navigate("/login");
//         } else if (error.message === "User not found in response data") {
//           setError("User data missing in response");
//           toast.error("Unable to load user profile");
//         } else {
//           setError("Failed to load profile");
//           toast.error("Error loading profile or posts");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId, navigate, loggedInUserId]);


// //Handle follow Toggle
//   const handleFollowToggle = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("Please login to follow users");
//         navigate("/login");
//         return;
//       }

//       const { data } = await API.post(`/auth/${userId}/follow`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setIsFollowing(data.following);
//       setFollowersCount(prev => data.following ? prev + 1 : prev - 1);
//       toast.success(data.following ? "Followed successfully!" : "Unfollowed successfully!");
//     } catch (error) {
//       toast.error("Failed to update follow status");
//       console.error(error);
//     }
//   };

//   const handleDelete = async (postId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this post?");
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       await API.delete(`/post/delete-post/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPosts(posts.filter((p) => p._id !== postId));
//       toast.success("Post deleted successfully");
//     } catch (error) {
//       toast.error("Failed to delete post");
//       console.error(error);
//     }
//   };

//   const BACKEND_URL = `https://trendkari.onrender.com/api/v1/post`;



//   const formatDate = (date) =>
//   new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });




//   const handleShare = (post) => {
//     const shareUrl = `${window.location.origin}/${post.location}/article/${post.slug}`;
  
//     const shareText = `Check out this post: ${post.title}`;

//     if (navigator.share) {
//       navigator.share({
//         title: post.title,
//         text: shareText,
//         url: shareUrl,
//       }).catch((err) => console.log("Share error:", err));
//     } else {
//       const encodedUrl = encodeURIComponent(shareUrl);
//       const encodedText = encodeURIComponent(shareText);

//       const whatsapp = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
//       const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
//       const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

//       window.open(whatsapp, "_blank");
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <Container className="mt-5 text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading profile...</p>
//         </Container>
//       </Layout>
//     );
//   }

//   if (error && !user) {
//     return (
//       <Layout>
//         <Container className="mt-5">
//           {apiError && (
//             <Alert variant="danger">
//               <FaExclamationTriangle className="me-2" />
//               <strong>Server Error:</strong> {apiError}
//               <div className="mt-2">
//                 <small className="text-muted">
//                   This is a backend issue. Please check your server logs.
//                 </small>
//               </div>
//             </Alert>
//           )}
//           <Card>
//             <Card.Body className="text-center py-5">
//               <Card.Title>Unable to load profile</Card.Title>
//               <Card.Text className="text-muted mb-3">
//                 {error}
//               </Card.Text>
//               <Button variant="primary" onClick={() => navigate(-1)} className="me-2">
//                 <FaArrowLeft className="me-2" />
//                 Go Back
//               </Button>
//               <Button variant="outline-primary" onClick={() => window.location.reload()}>
//                 Try Again
//               </Button>
//               <div className="mt-3">
//                 <small className="text-muted">
//                   User ID: {userId}
//                 </small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Container>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <Container className="my-4">

//           {/* Show API error banner if exists but we still have user data */}
//         {apiError && (
//           <Alert variant="warning" className="mb-3">
//             <FaExclamationTriangle className="me-2" />
//             Partial data loaded: {apiError}
//           </Alert>
//         )}

//         {/* Back Button */}
//         <Button 
//           variant="outline-secondary" 
//           onClick={() => navigate(-1)} 
//           className="mb-3"
//         >
//           <FaArrowLeft className="me-1" /> Back
//         </Button>

//         {/* User Profile Section */}
//         {user && (
//           <Card className="mb-4 shadow">
//             <Card.Body>
//               <Row className="align-items-center">
//                 <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
//                   <div className="position-relative d-inline-block">
//                     <Image 
//                       src={user.avatar || "/default-avatar.png"} 
//                       roundedCircle 
//                       width={150} 
//                       height={150}
//                       className="border border-3 border-primary object-fit-cover"
//                       onError={(e) => { 
//                         e.target.src = "/default-avatar.png";
//                       }}
//                     />
//                   </div>
//                 </Col>
//                 <Col xs={12} md={9}>
//                   <Stack direction="horizontal" className="justify-content-between align-items-start mb-2">
//                     <div>
//                       <h2 className="mb-1">{user.name || "Unnamed User"}</h2>
//                       <p className="text-muted mb-2">{user.email}</p>
//                       {user.role && (
//                         <Badge bg={user.role === 'admin' ? 'danger' : 'info'} className="mb-2">
//                           {user.role}
//                         </Badge>
//                       )}
                      
//                       {/* Follower Stats */}
//                       <div className="d-flex gap-3 mt-2">
//                         <div className="d-flex align-items-center">
//                           <FaUsers className="me-1 text-muted" />
//                           <span className="fw-bold">{followersCount}</span> Followers
//                         </div>
//                         <div>
//                           <span className="fw-bold">{followingCount}</span> Following
//                         </div>
//                       </div>
//                     </div>
                    
//                     {isOwner ? (
//                       <Button 
//                         variant="outline-primary" 
//                         size="sm" 
//                         onClick={() => navigate(`/dashboard/user/edit-profile/${user._id}`)} 
//                         className="d-flex align-items-center"
//                       >
//                         <FaUserEdit className="me-1" /> Edit Profile
//                       </Button>
//                     ) : (
//                       <Button 
//                         variant={isFollowing ? "outline-secondary" : "primary"} 
//                         size="sm"
//                         onClick={handleFollowToggle}
//                         className="d-flex align-items-center"
//                       >
//                         {isFollowing ? (
//                           <>
//                             <FaUserCheck className="me-1" /> Following
//                           </>
//                         ) : (
//                           <>
//                             <FaUserPlus className="me-1" /> Follow
//                           </>
//                         )}
//                       </Button>
//                     )}
//                   </Stack>

//                   <hr />

//                   <h5>About Me</h5>
//                   <p className="text-muted">
//                     {user.bio || "This user hasn't written anything about themselves yet."}
//                   </p>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Posts Section */}
//        <div className="d-flex justify-content-between align-items-center mb-3">
//           <h3 className="mb-0">{isOwner ? "My Posts" : `${user?.name}'s Posts`}</h3>
//           {isOwner && (
//             <Button variant="primary" onClick={() => setShowCreateModal(true)}>
//               Create New Post
//             </Button>
//           )}
//         </div>

//         {posts.length === 0 ? (
//           <Card>
//             <Card.Body className="text-center py-5">
//               <Card.Title>No posts yet</Card.Title>
//               <Card.Text className="text-muted">
//                 {isOwner ? "You haven't created any posts. Start sharing your thoughts!" : "This user hasn't created any posts yet."}
//               </Card.Text>
//               {isOwner && (
//                 <Button variant="primary" onClick={() => setShowCreateModal(true)}>
//                   Create Your First Post
//                 </Button>
//               )}
//             </Card.Body>
//           </Card>
//         ) : (
//           <Row xs={1} md={2} lg={3} className="g-4">
//             {/* {posts.map((post) => ( */}
//             {[...posts]
//   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//   .map((post) => (

//               <Col key={post._id}>
//                 <Card className="h-100 shadow-sm hover-shadow transition-all" style={{cursor: 'pointer'}} onClick={() =>
//   navigate(
//     post.location
//       ? `/${post.location}/article/${post.slug}`
//       : `/article/${post.slug}`
//   )
// }>
                   
                   
//                   {post.image && (
//                     <Card.Img
//                       variant="top"
//                       src={
//                         post.image.startsWith("http")
//                           ? post.image
//                           : `https://trendkari.onrender.com/${post.image}`
//                       }
//                       alt={post.title}
//                       style={{ height: "200px", objectFit: "cover" }}
//                       className="border-bottom"
//                     />
//                   )}
//                   <Card.Body className="d-flex flex-column">
//                     <Card.Title>{post.title}</Card.Title>
//                     <small className="text-muted mb-2">
//   {formatDate(post.createdAt)}
// </small>
//                     <Card.Text className="flex-grow-1">
//                       {/* {post.content?.replace(/<[^>]*>/g, '').slice(0, 100)}... */}
//                     </Card.Text>
//                     {post.category?.name && (
//                       <Badge bg="info" className="mb-2 align-self-start">
//                         {post.category.name}
//                       </Badge>
//                     )}
                   
//                     {isOwner && (
//                       <Dropdown align="end" className="ms-2 dropdown" onClick={(e) => e.stopPropagation()}>
//                         <Dropdown.Toggle
//                           as={Button}
//                           variant="link"
//                           className="p-0 border-0 shadow-none"
//                           style={{ color: "inherit" }}
//                         >
//                           <FaEllipsisV />
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu>
//                           <Dropdown.Item onClick={() => navigate(`/dashboard/user/edit-post/${post.slug}`)}>
//                             <FaRegEdit className="me-2" /> Edit
//                           </Dropdown.Item>
//                           <Dropdown.Item onClick={() => handleDelete(post._id)}>
//                             <FaTrash className="me-2" /> Delete
//                           </Dropdown.Item>
//                           <Dropdown.Item onClick={(e) => {
//                             e.stopPropagation();
//                             handleShare(post);
//                           }}>
//                             <FaShareAlt className="me-2" /> 
//                             Share
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     )}
                    
//                     {!isOwner && (
//                       <Button 
//                         variant="outline-secondary" 
//                         size="sm" 
//                         className="mt-2 align-self-start"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleShare(post);
//                         }}
//                       >
//                         <FaShareAlt className="me-1" /> Share
//                       </Button>
//                     )}
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}

//       </Container>
//     </Layout>
//   );
// };

// export default UserProfile;






// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import API from "../../utils/api";
// import { toast } from "react-toastify";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Badge,
//   Spinner,
//   Image,
//   Stack,
//   Dropdown,
//   Alert,
// } from "react-bootstrap";
// import Layout from "../Layout/Layout";
// import {
//   FaUserEdit,
//   FaTrash,
//   FaRegEdit,
//   FaArrowLeft,
//   FaEllipsisV,
//   FaShareAlt,
//   FaUsers,
//   FaUserPlus,
//   FaUserCheck,
//   FaFileAlt,
// } from "react-icons/fa";

// const UserProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [followersCount, setFollowersCount] = useState(0);
//   const [followingCount, setFollowingCount] = useState(0);
//   const [isFollowing, setIsFollowing] = useState(false);

//   const loggedInUserId = JSON.parse(localStorage.getItem("user"))?._id;
//   const isOwner = loggedInUserId === userId;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login first");
//           return navigate("/login");
//         }

//         setLoading(true);

//         const userRes = await API.get(`/auth/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const postsRes = await API.get(`/post/profile/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const fetchedUser = userRes.data.user;

//         setUser(fetchedUser);
//         setPosts(postsRes.data || []);
//         setFollowersCount(fetchedUser.followers?.length || 0);
//         setFollowingCount(fetchedUser.following?.length || 0);

//         if (fetchedUser.followers?.some(f => f._id === loggedInUserId)) {
//           setIsFollowing(true);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId, navigate, loggedInUserId]);

//   const handleFollowToggle = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await API.post(`/auth/${userId}/follow`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setIsFollowing(data.following);
//       setFollowersCount(prev => data.following ? prev + 1 : prev - 1);
//     } catch (err) {
//       toast.error("Action failed");
//     }
//   };

//   const handleDelete = async (postId) => {
//     if (!window.confirm("Delete this post?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await API.delete(`/post/delete-post/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPosts(posts.filter(p => p._id !== postId));
//       toast.success("Post deleted");
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//   const handleShare = (post) => {
//     const url = `${window.location.origin}/${post.location}/article/${post.slug}`;
//     if (navigator.share) {
//       navigator.share({ title: post.title, url });
//     } else {
//       window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <Container className="text-center mt-5">
//           <Spinner />
//         </Container>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <Container className="mt-5">
//           <Alert variant="danger">{error}</Alert>
//         </Container>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <Container className="my-4">
//         <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
//           <FaArrowLeft /> Back
//         </Button>

//         {/* PROFILE HEADER */}
//         <Card className="shadow-sm mb-4">
//           <Card.Body>
//             <Row className="align-items-center">
//               <Col md={3} className="text-center">
//                 <Image
//                   src={user.avatar || "/default-avatar.png"}
//                   roundedCircle
//                   width={140}
//                   height={140}
//                   className="border border-3 border-primary"
//                 />
//               </Col>
//               <Col md={9}>
//                 <Stack direction="horizontal" className="justify-content-between">
//                   <div>
//                     <h3>{user.name}</h3>
//                     <p className="text-muted mb-1">{user.email}</p>
//                     <Badge bg={user.role === "admin" ? "danger" : "info"}>{user.role}</Badge>
//                   </div>
//                   {isOwner ? (
//                     <Button onClick={() => navigate(`/dashboard/user/edit-profile/${user._id}`)}>
//                       <FaUserEdit /> Edit
//                     </Button>
//                   ) : (
//                     <Button variant={isFollowing ? "outline-secondary" : "primary"} onClick={handleFollowToggle}>
//                       {isFollowing ? <FaUserCheck /> : <FaUserPlus />} {isFollowing ? "Following" : "Follow"}
//                     </Button>
//                   )}
//                 </Stack>

//                 <hr />

//                 <Row className="text-center">
//                   <Col>
//                     <FaUsers /> <strong>{followersCount}</strong><br />Followers
//                   </Col>
//                   <Col>
//                     <FaUsers /> <strong>{followingCount}</strong><br />Following
//                   </Col>
//                   <Col>
//                     <FaFileAlt /> <strong>{posts.length}</strong><br />Posts
//                   </Col>
//                 </Row>

//                 <hr />
//                 <p className="text-muted">{user.bio || "No bio added."}</p>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         {/* POSTS */}
//         <h4 className="mb-3">{isOwner ? "My Posts" : `${user.name}'s Posts`}</h4>

//         {posts.length === 0 ? (
//           <Card className="text-center p-5">No posts yet</Card>
//         ) : (
//           <Row xs={1} md={2} lg={3} className="g-4">
//             {[...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(post => (
//               <Col key={post._id}>
//                 <Card className="h-100 shadow-sm" style={{ cursor: "pointer" }}
//                   onClick={() => navigate(`/${post.location}/article/${post.slug}`)}>
//                   {post.image && (
//                     <Card.Img src={post.image.startsWith("http") ? post.image : `https://trendkari.onrender.com/${post.image}`} />
//                   )}
//                   <Card.Body>
//                     <Card.Title>{post.title}</Card.Title>
//                     <small className="text-muted">{formatDate(post.createdAt)}</small>

//                     {isOwner && (
//                       <Dropdown align="end" className="position-absolute top-0 end-0 m-2" onClick={e => e.stopPropagation()}>
//                         <Dropdown.Toggle as={Button} variant="light" size="sm">
//                           <FaEllipsisV />
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           <Dropdown.Item onClick={() => navigate(`/dashboard/user/edit-post/${post.slug}`)}>
//                             <FaRegEdit /> Edit
//                           </Dropdown.Item>
//                           <Dropdown.Item onClick={() => handleDelete(post._id)}>
//                             <FaTrash /> Delete
//                           </Dropdown.Item>
//                           <Dropdown.Item onClick={() => handleShare(post)}>
//                             <FaShareAlt /> Share
//                           </Dropdown.Item>
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     )}
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </Container>
//     </Layout>
//   );
// };

// export default UserProfile;











import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Image,
  Stack,
  Dropdown,
  Alert,
} from "react-bootstrap";
import Layout from "../Layout/Layout";
import {
  FaUserEdit,
  FaTrash,
  FaRegEdit,
  FaArrowLeft,
  FaEllipsisV,
  FaShareAlt,
  FaUsers,
  FaUserPlus,
  FaUserCheck,
  FaFileAlt,
} from "react-icons/fa";

// Lazy image component for smooth loading
const LazyImage = ({ src, alt }) => {
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ minHeight: 200 }}>
      {visible && (
        <Card.Img
          src={src}
          alt={alt}
          style={{ height: 200, objectFit: "cover" }}
        />
      )}
    </div>
  );
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // IMPORTANT: controls which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState(null);

  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?._id;
  const isOwner = loggedInUserId === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const userRes = await API.get(`/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const postsRes = await API.get(`/post/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data.user);
        setPosts(postsRes.data || []);
        setFollowersCount(userRes.data.user.followers?.length || 0);
        setFollowingCount(userRes.data.user.following?.length || 0);

        if (userRes.data.user.followers?.some(f => f._id === loggedInUserId)) {
          setIsFollowing(true);
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate, loggedInUserId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post(`/auth/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(data.following);
      setFollowersCount(prev => (data.following ? prev + 1 : prev - 1));
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/post/delete-post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(p => p._id !== postId));
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleShare = (post) => {
    const url = `${window.location.origin}/${post.location}/article/${post.slug}`;
    navigator.share ? navigator.share({ title: post.title, url }) : window.open(`https://api.whatsapp.com/send?text=${url}`);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) {
    return (
      <Layout>
        <Container className="text-center mt-5"><Spinner /></Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="my-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
          <FaArrowLeft /> Back
        </Button>

        {/* PROFILE HEADER */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <Image src={user.avatar || "/default-avatar.png"} roundedCircle width={140} height={140} />
              </Col>
              <Col md={9}>
                <Stack direction="horizontal" className="justify-content-between">
                  <div>
                    <h3>{user.name}</h3>
                    <p className="text-muted mb-1">{user.email}</p>
                    <Badge bg={user.role === "admin" ? "danger" : "info"}>{user.role}</Badge>
                  </div>
                  {isOwner ? (
                    <Button onClick={() => navigate(`/dashboard/user/edit-profile/${user._id}`)}><FaUserEdit /> Edit</Button>
                  ) : (
                    <Button variant={isFollowing ? "outline-secondary" : "primary"} onClick={handleFollowToggle}>
                      {isFollowing ? <FaUserCheck /> : <FaUserPlus />} {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                </Stack>

                <Row className="text-center mt-3">
                  <Col><FaUsers /> <strong>{followersCount}</strong><br />Followers</Col>
                  <Col><FaUsers /> <strong>{followingCount}</strong><br />Following</Col>
                  <Col><FaFileAlt /> <strong>{posts.length}</strong><br />Posts</Col>
                </Row>

                <p className="text-muted mt-3">{user.bio || "No bio added."}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* POSTS */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {/* {posts.map(post => ( */}
 {[...posts]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
   .map((post) => (

            <Col key={post._id}>
              <Card className="h-100 shadow-sm" style={{ cursor: "pointer" }}
                onClick={() => navigate(`/${post.location}/article/${post.slug}`)}>

                {post.image && (
                  <LazyImage
                    src={post.image.startsWith("http") ? post.image : `https://trendkari.onrender.com/${post.image}`}
                    alt={post.title}
                  />
                )}

                <Card.Body className="position-relative">
                  <Card.Title>{post.title}</Card.Title>
                  <small className="text-muted">{formatDate(post.createdAt)}</small>

                  {isOwner && (
                    <Dropdown
                      align="end"
                      show={activeDropdown === post._id}
                      onToggle={() => setActiveDropdown(activeDropdown === post._id ? null : post._id)}
                      className="position-absolute top-0 end-0 m-2"
                      onClick={e => e.stopPropagation()}
                    >
                      <Dropdown.Toggle as={Button} variant="light" size="sm"><FaEllipsisV /></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate(`/dashboard/user/edit-post/${post.slug}`)}><FaRegEdit /> Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(post._id)}><FaTrash /> Delete</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleShare(post)}><FaShareAlt /> Share</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export default UserProfile;