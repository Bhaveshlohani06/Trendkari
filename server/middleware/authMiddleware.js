import JWT from "jsonwebtoken";
import userModel from "../models/usermodel.js";

/// require Signin
export const requireSignIn = async(req, res, next) => {
    try{
        const decode = JWT.verify(
        req.headers.authorization.split(" ")[1], // ✅ Get just the token
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();

    } catch(error) {
        console.log(error);
    }
};

//admin access 
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    console.error("❌ Error in isAdmin middleware:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};