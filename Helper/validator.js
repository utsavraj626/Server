const { check, validationResult } = require('express-validator');

// Validation rules for user registration
const validateUserRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  check('role', 'Role must be either user or admin').isIn(['user', 'admin']),
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed if there are no validation errors
  }
];

// Validation rules for user login
const validateUserLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateAddFood = [
    check('categoryName', 'Category name is required').not().isEmpty(),
    check('name', 'Food name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('image', 'Image URL is required').not().isEmpty().isURL().withMessage('Invalid image URL'),
    check('price', 'Price is required and must be a positive number').isFloat({ gt: 0 })
  ];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAddFood
};
