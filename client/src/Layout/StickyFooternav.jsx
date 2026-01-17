// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaCompass,
//   FaPlus,
//   FaSearch,
//   FaUser,
// } from "react-icons/fa";
// import { useAuth } from "../context/auth";
// import { useTheme } from "../context/ThemeContext";
// import "./stickyfooternav.css";
// import { Button, Nav, NavDropdown, Image } from "react-bootstrap";
// import { FaPen } from "react-icons/fa";
// import CreatePostModal from "../Components/forms/CreatePostModal";
//   // const [showSearchModal, setShowSearchModal] = useState(false);
//   // import SearchModal from "../Components/SearchModal";



// const StickyFooterNav = ({ onCreatePost, onOpenSearch }) => {
//   const [auth] = useAuth();
//   const navigate = useNavigate();
//   const { theme } = useTheme();

  
//           // Get user
//     const user = JSON.parse(localStorage.getItem("user"));
//     const userId = user?._id || user?.id;
  
//     // Logout
//     const handleLogout = () => {
//       setAuth({ user: null, token: "" });
//       localStorage.clear();
//       toast.success("Logged out successfully");
//       navigate("/login");
//     };

//   return (
//     <nav
//       className="sticky-footer"
//       data-theme={theme}
//     >
//       {/* Home */}
//       <NavLink to="/" className="footer-item">
//         <FaHome />
//         <span>Home</span>
//       </NavLink>

//       {/* Discover */}
//       <NavLink to="/explore" className="footer-item">
//         <FaCompass />
//         <span>Discover</span>
//       </NavLink>

//       {/* Create Post */}
//       {/* <button
//         className="footer-create-btn"
//         onClick={() => {
//           if (!auth?.user) {
//             navigate("/login");
//           } else {
//             onCreatePost?.();
//           }
//         }}
//         aria-label="Create Post"
//       >
//         <FaPlus />
//       </button> */}

//       {/* My Area (Search) */}
//       <button
//         className="footer-item btn-reset"
//         onClick={onOpenSearch}
//       >
//         <FaSearch />
//         <span>My Area</span>
//       </button>

//       {/* Profile */}
//       {/* {auth?.user ? (
//         <NavLink
//           to={`/dashboard/user/profile/${auth.user._id}`}
//           className="footer-item"
//         >
//           <FaUser />
//           <span>Profile</span>
//         </NavLink>
//       ) : (
//         <NavLink to="/login" className="footer-item">
//           <FaUser />
//           <span>Login</span>
//         </NavLink>
//       )} */}


//             {auth?.user && (
//               <Button
//                 variant="outline-light"
//                 size="sm"
//                 aria-label="Create Post"
//                 onClick={() => CreatePostModal(true)}
//               >
//                 <FaPen />
//               </Button>
//             )}

//             {!auth?.user ? (
//               <>
//                 <Nav.Link as={NavLink} to="/login" className="text-white">
//                   Login  
//                 </Nav.Link>
//                 <Nav.Link as={NavLink} to="/register" className="text-white">
//                   Signup
//                 </Nav.Link>
//               </>
//             ) : (
//               <NavDropdown
//                 title={
//    <Image
// //  src={user.avatar || "/default-avatar.png"}

//    alt=" Avatar"  
//   roundedCircle
//   style={{
//     width: "40px",
//     height: "40px",
//     objectFit: "cover",
//     border: !auth?.user?.avatar ? "2px solid #ccc" : "none",
//     display: "block",
//     margin: 'auto',
//   }}
// />
//   }
//                 id="user-nav-dropdown"
//                 align="end"
//               >
//                 {userId && (
//                   <NavDropdown.Item
//   as={NavLink}
//   to={`/dashboard/user/profile/${userId}`}
// >
//   {auth.user.name}
// </NavDropdown.Item>
//                 )}

//                 {auth?.user?.role === "admin" && (
//   <NavDropdown.Item
//     as={NavLink}
//     to="/dashboard/admin"
//   >
//     Admin Dashboard
//   </NavDropdown.Item>
// )}  
//                 <NavDropdown.Item onClick={handleLogout}>
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             )}      
      


      
//     </nav>
//   );
// };

// export default StickyFooterNav;




import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaPlus,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/ThemeContext";
import CreatePostModal from "../Components/forms/CreatePostModal";
import SearchModal from "../Components/SearchModal";
import ProfileMenuModal from "../Components/ProfileMenuModal";
import "./stickyfooternav.css";
import { useRef } from "react";
import toast from "react-hot-toast";
import { Button, Nav, NavDropdown, Image } from "react-bootstrap";
import { FaPen } from "react-icons/fa";


const StickyFooterNav = () => {
  const [auth, setAuth] = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
const [showProfileModal, setShowProfileModal] = useState(false);
  


  const user = auth?.user;


  const handleCreateClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowCreateModal(true);
  };

  // const handleSearchClick = () => {
  //   setShowSearch(true);
  // }

  const handleSearchClick = () => {
  console.log("Search clicked");
  setShowSearchModal(true);
};

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* ---------- FOOTER ---------- */}
      <nav className="sticky-footer" data-theme={theme}>
        <NavLink to="/" className="footer-item">
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/explore" className="footer-item">
          <FaCompass />
          <span>Discover</span>
        </NavLink>

        {/* CREATE POST */}
        <button
          className="footer-create-btn"
          onClick={handleCreateClick}
          aria-label="Create Post"
        >
          <FaPlus />
        </button>

        {/* SEARCH / MY AREA */}
        <button
          className="footer-item btn-reset"
          onClick={handleSearchClick}
        >
          <FaSearch />
          <span>My Area</span>
        </button>

        {/* PROFILE */}
        {user ? (
         <button
  className="footer-item btn-reset"
  onClick={() => {
    if (!user) {
      navigate("/login");
    } else {
      setShowProfileModal(true);
    }
  }}
>
  <FaUser />
  <span>Profile</span>
</button>
        ) : (
          <NavLink to="/login" className="footer-item">
            <FaUser />
            <span>Login</span>
          </NavLink>
        )}


        
      </nav>

      {/* ---------- CREATE POST MODAL ---------- */}
      <CreatePostModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

  {/* ---------- SEARCH MODAL ---------- */}

{showSearchModal && (
  <SearchModal
    show={showSearchModal}
    onHide={() => setShowSearchModal(false)}
  />
)}

      {/* ---------- PROFILE MODAL ---------- */}
      {showProfileModal && (
  <ProfileMenuModal
    show={showProfileModal}
    onHide={() => setShowProfileModal(false)}
  />
)}


    </>
  );
};

export default StickyFooterNav;





