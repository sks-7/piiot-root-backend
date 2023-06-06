const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'accounts', 'customer_executive'],
    default: 'customer_executive',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
