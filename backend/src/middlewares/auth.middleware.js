const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
/**
 * Middleware to protect routes by verifying JWT tokens.
 * If the token is valid, it attaches the user ID to the request object.
 * If not, it sends a 401 Unauthorized response.
 */
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protectRoute  middleware:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { protectRoute };
