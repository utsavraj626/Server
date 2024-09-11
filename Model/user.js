const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // default role is 'user'
  },
  createTime: {
    type: Date,
    default: Date.now // Automatically sets the time of creation
  }
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
