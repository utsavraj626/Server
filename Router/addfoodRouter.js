const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/auth');
const isAdmin = require('../Middleware/isAdmin');
const { validateAddFood } = require('../Helper/validator');
const { addNewFood } = require('../Controller/foodcontroller');
const { deleteFood } = require('../Controller/foodcontroller');
const { getAllFood } = require('../Controller/foodcontroller');

router.post('/addfood', authenticateToken, isAdmin, addNewFood);

router.delete('/:id', authenticateToken, isAdmin, deleteFood);

router.get('/getAllFood', getAllFood);

module.exports = router;
