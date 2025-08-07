import express from 'express';
import { forgotPasswordController, loginController, registerController, resetPasswordController, testController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Register route
router.post('/register', registerController);   

// Login route      
router.post('/login', loginController);

router.get('/test', requireSignIn, isAdmin, testController)


//Forgot Password route
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);


// Google OAuth route

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate JWT
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Redirect with token and user name
     const redirectUrl = `https://trendkari.in/auth-success?token=${token}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&id=${_id}`;

      

      res.redirect(redirectUrl);
    } catch (err) {
      console.error(err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);


//protected User Route auth
router.get("/user-auth", requireSignIn, (req,res) => {
    res.status(200).send({ok:true});
});


//Protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req,res) =>{
    res.status(200).send({ok:true});
});


// Export the router
export default router;  