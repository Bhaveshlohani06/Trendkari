// import React, { useEffect } from 'react'
// import { Route, Routes, useLocation } from 'react-router-dom'
// import ReactGA from "react-ga4";

// import "antd/dist/reset.css";

// // Importing pages
// import Home from './pages/Home'
// import Blog from './pages/Blog'
// import Register from './pages/auth/Register'
// import Login from './pages/auth/Login'
// import PhoneLogin from './pages/auth/PhoneLogin'

// import AuthSuccess from './pages/AuthSuccess'
// import ForgotPassword from './pages/auth/ForgotPassword'
// import ResetPassword from './pages/auth/ResetPassword'
// import AdminDashboard from './pages/Admin/Admindashboard'
// import AdminRoute from './routes/AdminRoutes'
// import PrivateRoute from './routes/PrivateRoutes'
// import UserDashboard from './pages/User/UserDashboard'
// import DashboardRedirect from './pages/DashboardRedirect.'
// import CreateCategory from './pages/Admin/CreateCategory'
// import CreatePost from './pages/Admin/CreatePost'
// import Posts from './pages/Admin/Posts'
// import BlogDetail from './pages/BlogDetail'
// import AllBlogs from './pages/AllBlog'
// import PrivacyPolicy from './Components/PrivacyPolicy'
// import AboutUs from './Components/Aboutus'
// import Contact from './pages/Contact'
// import CategoryPosts from './pages/CategoryPosts'
// import Cover from './pages/Cover'
// import UserProfile from './pages/ProfilePage'
// import EditPost from './Components/forms/Editpost'
// import DailyHoroscope from './pages/Horoscope';
// import EditProfile from './Components/forms/EditProfile'
// import Search from './pages/Search'
// import WeatherPage from './pages/Weather';
// import CityFeed from './Components/CityFeed';
// import ScrollToTop from './Components/ScrollToTop';

// // Your GA Measurement ID
// const TRACKING_ID = "G-CGG172MEXZ";

// /**
//  * Component that listens to route changes
//  * and sends pageview data to Google Analytics
//  */
// const RouteChangeTracker = () => {
//   const location = useLocation();

//   useEffect(() => {
//     ReactGA.send({
//       hitType: "pageview",
//       page: location.pathname + location.search,
//     });
//   }, [location]);

//   return null; // Nothing to render
// };

// const App = () => {
//   useEffect(() => {
//     // Initialize GA when app loads
//     ReactGA.initialize(TRACKING_ID);
//   }, []);

//   return (
//     <>
//       {/* Track route changes globally */}
//       <RouteChangeTracker />

//       <ScrollToTop />
//       {/* Define all app routes */}
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/article' element={<Blog />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/login' element={<Login />} />
//     <Route path="/phone-login" element={<PhoneLogin />} />


//         <Route path='/auth-success' element={<AuthSuccess />} />
//         <Route path='/forgotpassword' element={<ForgotPassword />} />
//         <Route path='/reset-password/:token' element={<ResetPassword />} />
       
//         <Route path="/article/:slug" element={<BlogDetail />} />

//         <Route path="/:location/article/:slug" element={<BlogDetail />} />
//         <Route path='/explore' element={<AllBlogs />} />
//         <Route path='/privacypolicy' element={<PrivacyPolicy />} />
//         <Route path='/about' element={<AboutUs />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/category/:slug" element={<CategoryPosts />} />
//         <Route path='/coverpage' element={<Cover />} />
//         <Route path="/profile/:userId" element={<UserProfile />} />
//         <Route path="/edit-post/:slug" element={<EditPost />} />
//         <Route path="/dashboard" element={<DashboardRedirect />} />
//         <Route path='/update-profile/:userId' element={<EditProfile/>} />
//         <Route path='/city/:location' element={<CityFeed/>} />

//         <Route path="/weather" element={<WeatherPage />} />

//         <Route path="/horoscope" element={<DailyHoroscope />} />
//          <Route path="/search" element={<Search />} />
//         {/* <Route path='create-category' element={<CreateCategory />} /> */}


//         {/* Admin Routes (nested under /dashboard/admin) */}
//         <Route path="/dashboard/admin" element={<AdminRoute />}>
//           <Route index element={<AdminDashboard />} />
//          <Route path='create-category' element={<CreateCategory />} />
//           <Route path='create-post' element={<CreatePost />} />
//           <Route path='posts' element={<Posts />} />
//         </Route>

//         {/* Private user routes */}
//         <Route path="/dashboard" element={<PrivateRoute />}>
//         {/* <Route path="horoscope" element={<DailyHoroscope />} /> */}
//           <Route index element={<UserDashboard />} />
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default App;



import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import "antd/dist/reset.css";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* Common */
import ScrollToTop from "./Components/ScrollToTop";

/* Public Pages */
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AllBlogs from "./pages/AllBlog";
import CategoryPosts from "./pages/CategoryPosts";
import CityFeed from "./Components/CityFeed";
import Search from "./pages/Search";
import Cover from "./pages/Cover";
import Contact from "./pages/Contact";
import AboutUs from "./Components/Aboutus";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import WeatherPage from "./pages/Weather";
import DailyHoroscope from "./pages/Horoscope";

/* Auth */
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import PhoneLogin from "./pages/auth/PhoneLogin";
import AuthSuccess from "./pages/AuthSuccess";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* User */
import PrivateRoute from "./routes/PrivateRoutes";
import UserDashboard from "./pages/User/UserDashboard";
import UserProfile from "./pages/ProfilePage";
import EditProfile from "./Components/forms/EditProfile";

/* Admin */
import AdminRoute from "./routes/AdminRoutes";
import AdminDashboard from "./pages/Admin/Admindashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreatePost from "./pages/Admin/CreatePost";
import Posts from "./pages/Admin/Posts";

/* Utils */
import DashboardRedirect from "./pages/DashboardRedirect.";
import DashboardLayout from "./pages/DashboardLayout";
import Users from "./Components/Users";

import {
  initForegroundNotifications,
  requestNotificationPermission
} from "../src/notification.js";

import EditPost from "./Components/forms/Editpost";

// Your GA Measurement ID

const TRACKING_ID = "G-CGG172MEXZ";

/* Google Analytics Route Tracker */
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

// const App = () => {
//   useEffect(() => {
//     ReactGA.initialize(TRACKING_ID);
//   }, []);

const App = () => {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  const notificationInitialized = useRef(false);

  useEffect(() => {
    if (notificationInitialized.current) return;

    notificationInitialized.current = true;

    requestNotificationPermission();
    initForegroundNotifications();
  }, []);

  return (
    <>
      <RouteChangeTracker />
      <ScrollToTop />

          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/article" element={<Blog />} />
        <Route path="/explore" element={<AllBlogs />} />



        {/* Blog detail (normal + location based) */}
        <Route path="/article/:slug" element={<BlogDetail />} />
        <Route path="/:location/article/:slug" element={<BlogDetail />} />

        <Route path="/category/:slug" element={<CategoryPosts />} />
        <Route path="/city/:location" element={<CityFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/coverpage" element={<Cover />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/horoscope" element={<DailyHoroscope />} />

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* ================= DASHBOARD ROUTES ================= */}


        
        <Route path="/users" element={<Users/>}/>
            {/* <Route path="profile/:userId" element={<UserProfile />} /> */}



       <Route path="/dashboard" element={<DashboardLayout />}>
  
  {/* DASHBOARD REDIRECT */}
  <Route index element={<DashboardRedirect />} />

  {/* USER ROUTES */}
  <Route path="user" element={<PrivateRoute />}>
    <Route index element={<UserDashboard />} />

    <Route path="profile/:userId" element={<UserProfile />} />
    <Route path="edit-profile/:userId" element={<EditProfile />} />


    <Route path="edit-post/:slug" element={<EditPost />} />

  </Route>

  {/* ADMIN ROUTES */}
  <Route path="admin" element={<AdminRoute />}>
    <Route index element={<AdminDashboard />} />
    <Route path="create-category" element={<CreateCategory />} />
    <Route path="create-post" element={<CreatePost />} />
    <Route path="posts" element={<Posts />} />
  </Route>

</Route>



      </Routes>
    </>
  );
};

export default App;
