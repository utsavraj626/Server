const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/auth');
const { addToCart, removeFromCart, updateQuantityInCart, getCartItems, clearCart } = require('../Controller/AddCartController');

router.post('/cart/add', authenticateToken, addToCart);

router.post('/cart/remove', authenticateToken, removeFromCart);

router.patch('/cart/update', authenticateToken, updateQuantityInCart);

router.get('/cart/', authenticateToken, getCartItems);

router.post('/cart/clear', authenticateToken, clearCart);

module.exports = router;