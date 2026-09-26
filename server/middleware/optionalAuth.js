// middleware/optionalAuth.js
import jwt from "jsonwebtoken";

/**
 * Like requireSignIn, but never rejects. If a valid token is present,
 * req.user is populated. If not (guest/anonymous device), req.user
 * stays undefined and the request proceeds anyway — needed because
 * /register must work for both logged-out (city-wide) and logged-in
 * (per-user) devices.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // match whatever shape requireSignIn sets
  } catch (err) {
    // Invalid/expired token on a route that doesn't require one —
    // just proceed as a guest instead of blocking registration.
  }
  next();
};