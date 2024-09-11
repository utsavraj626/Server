const Cart = require('../Model/AddCart');
const Food = require('../Model/food');

// Add or update item in cart
const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  const userId = req.user.userId; // User ID from authenticated user

  try {
    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ success: false, msg: 'Quantity must be at least 1' });
    }

    // Check if food item exists
    const foodItem = await Food.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ success: false, msg: 'Food item not found' });
    }

    // Find or create the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart with the item
      cart = new Cart({
        userId,
        items: [{ foodId, quantity }]
      });
    } else {
      // Check if the item already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId.toString());
      
      if (itemIndex > -1) {
        // Update quantity if item already in cart
        cart.items[itemIndex].quantity = quantity;
      } else {
        // Add new item to the cart
        cart.items.push({ foodId, quantity });
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ success: true, msg: 'Item added/updated in cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { foodId } = req.body;
  const userId = req.user.userId; // User ID from authenticated user

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, msg: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.foodId.toString() !== foodId.toString());

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, msg: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

module.exports = {
  addToCart,
  removeFromCart
};
