const Cart = require('../Model/AddCart');
const Order = require('../Model/Order');

const orderFood = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      // Find the user's cart and populate the food details in the cart items
      const cart = await Cart.findOne({ userId }).populate('items.foodId'); // This populates the foodId with the actual Food object
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, msg: 'Cart is empty' });
      }
  
      // Calculate total price by accessing the price from the populated food object
      const totalPrice = cart.items.reduce((total, item) => {
        const foodPrice = item.foodId.price; // Access price from the populated food object
        return total + (item.quantity * foodPrice);
      }, 0);
  
      if (isNaN(totalPrice)) {
        return res.status(400).json({ success: false, msg: 'Total price calculation error' });
      }
  
      // Create an order with status 'pending'
      const order = new Order({
        userId,
        items: cart.items,
        totalPrice,
        status: 'pending' // Initial status set to pending
      });
      await order.save();
  
      // Clear the cart after ordering
      cart.items = [];
      await cart.save();
  
      res.status(200).json({ success: true, msg: 'Order placed successfully', order });
    } catch (error) {
      console.error('Order food error:', error.message);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
  };


const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body; // Expect status and orderId from the request
  
    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
    // Check if status is valid
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, msg: 'Invalid status' });
    }
  
    try {
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, msg: 'Order not found' });
      }
  
      // Update the order status
      order.status = status;
      await order.save();
  
      res.status(200).json({ success: true, msg: 'Order status updated', order });
    } catch (error) {
      console.error('Update order status error:', error.message);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
  };


const cancelOrder = async (req, res) => {
  const userId = req.user.userId;  // Assumes user authentication has been handled
  const { orderId } = req.params;

  try {
    // Find the order by orderId and userId
    const order = await Order.findOne({ _id: orderId, userId });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ success: false, msg: 'Order not found' });
    }

    // Only allow cancellation if the order is still pending or confirmed
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ success: false, msg: 'Cannot cancel order that has already been shipped or delivered' });
    }

    // If order is pending or confirmed, cancel it
    order.status = 'cancelled';
    await order.save();

    return res.status(200).json({ success: true, msg: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error.message);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};



  
  module.exports = { orderFood, updateOrderStatus , cancelOrder };
  
