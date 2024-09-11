const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes JWT token
    req.user = decoded; // Attaches user data to req.user
    next(); // Proceeds to next middleware
  } catch (error) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

module.exports = authenticateToken;
