/**
 * Middleware function to check if the user is an admin.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const isAdmin = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    console.log("User  is not authenticated");
    return res.status(401).json({ success: false, message: 'User  not authenticated' });
  }

  // Check if the user has the role of 'admin'
  // console.log(req.user.role);
  if (req.user.role !== 'admin') {
    console.log("User  is not an admin");
    return res.status(403).json({ success: false, message: 'Access denied. Admins only' });
  }

  // Proceed if the user is an admin
  console.log("User  is an admin");
  next();
};

module.exports = isAdmin;
