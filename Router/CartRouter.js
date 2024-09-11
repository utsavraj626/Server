const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/auth');
const { addToCart, removeFromCart } = require('../Controller/AddCartController');

// @route POST /api/cart/add
// @desc Add or update item in cart
// @access Private (authenticated users only)
router.post('/add', authenticateToken, addToCart);

// @route DELETE /api/cart/remove
// @desc Remove item from cart
// @access Private (authenticated users only)
router.delete('/remove', authenticateToken, removeFromCart);

module.exports = router;