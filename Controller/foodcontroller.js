const Food = require('../Model/food');
const { validationResult } = require('express-validator');

/**
 * Add a new food item.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const addNewFood = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  console.log("erros : ", errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  try {
    const data = req.body;
    console.log(data);
    const { name, description, price, category, imageUrl } = req.body;

    // Check if all necessary fields are provided
    console.log(name);
    if (!name || !description || !price || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, description, price, category, imageUrl) are required.',
      });
    }

    // Create new food object and save to the database
    const newFood = new Food({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    const savedFood = await newFood.save();
    res.status(201).json({ success: true, message: 'Food item added successfully', savedFood });
  } catch (error) {
    console.error('Error adding food:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Delete a food item by ID.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the food ID
    const foodItem = await Food.findById(id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    // Delete the food item
    await Food.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get all available food items.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getAllFood = async (req, res) => {
  try {
    const foodItems = await Food.find(); // Fetch all food items from the database

    if (!foodItems || foodItems.length === 0) {
      return res.status(404).json({ success: false, message: 'No food items found' });
    }

    res.status(200).json({ success: true, foodItems });
  } catch (error) {
    console.error('Get all food error:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  addNewFood,
  deleteFood,
  getAllFood,
};