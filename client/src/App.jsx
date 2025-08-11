import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import AuthSuccess from './pages/AuthSuccess'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminDashboard from './pages/Admin/Admindashboard'
import AdminRoute from './routes/AdminRoutes'
import PrivateRoute from './routes/PrivateRoutes'
import UserDashboard from './pages/User/UserDashboard'
import DashboardRedirect from './pages/DashboardRedirect.'
import CreateCategory from './pages/Admin/CreateCategory'
import CreatePost from './pages/Admin/CreatePost'
import Posts from './pages/Admin/Posts'
import UpdatePost from './pages/Admin/UpdatePost'
import BlogDetail from './pages/BlogDetail'
import AllBlogs from './pages/AllBlog'
import PrivacyPolicy from './Components/PrivacyPolicy'
import AboutUs from './Components/Aboutus'
import Search from './pages/Search'
import Contact from './pages/Contact'
import CategoryPosts from './pages/CategoryPosts'
import Cover from './pages/Cover'
import UserProfile from './pages/ProfilePage'


const App = () => {
  
  return (
    <>
    <Routes>

        <Route path='/blog' element={<Blog />} />
        <Route path='/' element={<Home />} />

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/auth-success' element={<AuthSuccess />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path='/explore' element={<AllBlogs/>}/>
        <Route path='/privacypolicy' element={<PrivacyPolicy/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/category/:slug" element={<CategoryPosts />} />
        <Route path='/coverpage' element={<Cover/>}/>

<Route path="/profile/:userId" element={<UserProfile />} />



        <Route path="/dashboard" element={<DashboardRedirect />} />

  <Route path="/dashboard/admin" element={<AdminRoute />}>
    <Route index element={<AdminDashboard />} />
    <Route path='create-category' element={<CreateCategory/>}/>
    <Route path='create-post' element={<CreatePost/>}/>
    <Route path='posts' element={<Posts/>}/>
    <Route path='post/:slug' element={<UpdatePost/>}/>
  </Route>


         <Route path="/" element={<PrivateRoute />}>
        {/* <Route path='/home' element={<Home />} /> */}
  </Route>



    </Routes>
    </>
  )
}

export default App