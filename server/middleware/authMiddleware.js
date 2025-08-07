import JWT from "jsonwebtoken";
import userModel from "../models/usermodel.js";

/// require Signin
  import jwt from 'jsonwebtoken';

// export const requireSignIn = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Authorization header missing or invalid' });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     return res.status(401).json({ message: 'Authentication failed' });
//   }
// };



// export const requireSignIn = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).send("Unauthorized: Token missing");

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded JWT:", decoded);

//     const user = await userModel.findById(decoded.id).select("-password");
//     if (!user) return res.status(404).send("User not found");

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (err) {
//     console.error("JWT Error:", err);
//     res.status(401).send("Unauthorized: Invalid token");
//   }
// };


export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
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


//admin and user access
export const allowUsersAndAdmins = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "admin" || role === "user") {
      next();
    } else {
      return res.status(401).json({ success: false, message: "Access Denied" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Auth Error" });
  }
};
