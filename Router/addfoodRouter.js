const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/auth'); // Adjust path as needed
const isAdmin = require('../Middleware/isAdmin'); // Adjust path as needed
const  {validateAddFood}  = require('../Helper/validator');
const { addNewFood } = require('../Controller/foodcontroller');
const {deleteFood} = require('../Controller/foodcontroller');

// @route POST /api/foods/add
// @desc Add a new food item
// @access Private (admin)
router.post('/addfood',authenticateToken,isAdmin,validateAddFood,addNewFood);
router.delete('/:id', authenticateToken, isAdmin, deleteFood);

module.exports = router;
