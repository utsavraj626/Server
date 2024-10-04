const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate a user using a JWT token.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const authenticateToken = (req, res, next) => {
  // Extract token from 'Authorization' header
  const token = req.headers.authorization?.replace('Bearer ', '');

  // console.log("Token from Authorization header:", token); // Proper logging

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; // Attach decoded user data to request object
    next(); // Move to the next middleware
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ success: false, message: 'Token expired, please log in again' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }
};

module.exports = authenticateToken;