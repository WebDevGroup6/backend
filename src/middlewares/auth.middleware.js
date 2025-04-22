import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/auth.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded; // Add decoded user payload to request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("Invalid token:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyToken;
