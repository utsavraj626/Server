const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Controller/userAuthController'); // Ensure the folder and file path is correct
const { auth, user, admin } = require('../Middleware/auth');
const {validateUserRegistration,validateUserLogin} = require('../Helper/validator');

router.post('/register',validateUserRegistration, registerUser);
 
router.post('/login',validateUserLogin, loginUser);

module.exports = router;
