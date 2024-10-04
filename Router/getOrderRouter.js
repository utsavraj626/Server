const express = require('express');
const router = express.Router();
const { getAllOrders, getUserOrders } = require('../Controller/getOrderController');
const authenticateToken = require('../Middleware/auth');
const isAdmin = require('../Middleware/isAdmin');

// Admin route: Get all orders
router.get('/admin/getOrders', authenticateToken, isAdmin, getAllOrders);

// User route: Get user's own order history
router.get('/getOrders', authenticateToken, getUserOrders);

module.exports = router;