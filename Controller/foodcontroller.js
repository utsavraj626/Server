const Food = require('../Model/food');
const {validationResult} = require('express-validator');

const addNewFood = async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            success: false,
            msg:'validation error',
            error:error.array()
        })
    }
  try {
    const {userId , categoryName, name, description, image, price } = req.body;
    // const userId = req.user._id; // Assuming the user is authenticated and req.user contains their info

    const newFood = new Food({
      userId,  // Admin ID
      categoryName,
      name,
      description,
      image,
      price
    });

    const savedFood = await newFood.save();
    res.status(201).json({ msg: 'Food item added successfully', savedFood });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

const deleteFood = async (req, res) => {
    const { id } = req.params; // Food item ID from the request parameters
  
    try {
      // Check if the food item exists
      const foodItem = await Food.findById(id);
      if (!foodItem) {
        return res.status(404).json({ success: false, msg: 'Food item not found' });
      }
  
      // Delete the food item
      await Food.findByIdAndDelete(id);
  
      res.status(200).json({ success: true, msg: 'Food item deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error.message);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
  };




module.exports = {
    addNewFood,
    deleteFood
};

