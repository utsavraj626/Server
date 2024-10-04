const express = require('express');
const router = express.Router();
const { orderFood, updateOrderStatus,cancelOrder } = require('../Controller/OrderController');
const authenticateToken = require('../Middleware/auth');
const isAdmin = require('../Middleware/isAdmin');

// Route to place an order (user functionality)
router.post('/orderFood', authenticateToken, orderFood);

// Route to update order status (admin functionality)
router.put('/updateOrderStatus', authenticateToken, isAdmin, updateOrderStatus);
router.put('/cancelOrder/:orderId', authenticateToken, cancelOrder);


module.exports = router;
