const Order = require('../Model/Order');

// Admin can get all orders
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().populate('userId', 'name email').populate('items.foodId', 'name price');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// User can get their own order history
const getUserOrders = async (req, res) => {
    const userId = req.user.userId;  // Assume user is authenticated and userId is available in req.user
  
    try {
      // Fetch orders only for the logged-in user
      const orders = await Order.find({ userId }).populate('items.foodId', 'name price');
  
      if (orders.length === 0) {
        return res.status(404).json({ success: false, msg: 'No orders found for this user' });
      }
  
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Get user orders error:', error.message);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
  };
  
  module.exports = { getAllOrders,getUserOrders };
  
