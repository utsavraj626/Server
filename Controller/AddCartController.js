const Cart = require('../Model/AddCart');
const Food = require('../Model/food');

// Add or update item in cart
const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  const userId = req.user.userId; // User ID from authenticated user
  // console.log({foodId, quantity, userId});

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
      const itemIndex = cart.items.findIndex(item => item._id.toString() === foodId.toString());

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

    // Check if the cart has any items
    if (!cart.items || cart.items.length === 0) {
      return res.status(404).json({ success: false, msg: 'Cart is empty' });
    }

    // console.log("remove",cart);

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === foodId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, msg: 'Item not found in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, msg: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Update quantity in cart
const updateQuantityInCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  const userId = req.user.userId; // User ID from authenticated user
  // console.log({foodId, quantity, userId});

  try {
    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ success: false, msg: 'Quantity must be at least 1' });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If cart not found, create a new cart
      cart = await Cart.create({ userId, items: [] });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === foodId.toString());

    if (itemIndex > -1) {
      // Update the quantity of the item in the cart
      cart.items[itemIndex].quantity = quantity;
    } else {
      // If item not found, add it to the cart
      cart.items.push({ foodId, quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, msg: 'Quantity updated in cart', cart });
  } catch (error) {
    console.error('Update quantity in cart error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};


// Get cart items
const getCartItems = async (req, res) => {
  const userId = req.user.userId; // User ID from authenticated user

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ userId }).populate('items.foodId', 'name description imageUrl price'); // Populate food details if needed
    console.log(cart);

    if (!cart) {
      return res.status(404).json({ success: false, msg: 'Cart not found' });
    }

    res.status(200).json({ success: true, msg: 'Cart items retrieved', cart });
  } catch (error) {
    console.error('Get cart items error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Clear all items from the cart
const clearCart = async (req, res) => {
  const userId = req.user.userId; // User ID from authenticated user

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, msg: 'Cart not found' });
    }

    // Check if the cart already empty
    if (!cart.items || cart.items.length === 0) {
      return res.status(404).json({ success: false, msg: 'Cart is already empty' });
    }

    // Clear the items array
    cart.items = [];

    // Save the updated cart
    await cart.save();

    res.status(200).json({ success: true, msg: 'All items cleared from cart', cart });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};


module.exports = {
  addToCart,
  removeFromCart,
  updateQuantityInCart,
  getCartItems,
  clearCart 
};
