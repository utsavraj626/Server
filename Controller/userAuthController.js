const User = require('../Model/user'); // Import User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    // Create new user instance
    const newUser = new User({
      name,
      email,
      password
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user in the database
    await newUser.save();

    // Generate JWT token
    const payload = { userId: newUser._id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '20h' });

    // Respond with success and token
    res.status(201).json({ success: true, token, userInfo: payload, msg: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { userId: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with success and token
    res.status(200)
    .cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 86400000,
      secure: true
    })
    .json({ success: true, token, userInfo: payload, msg: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
