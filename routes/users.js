const express = require('express');
const authenticateToken = require('../middleware/roleCheck');
const router = express.Router();
const User = require('../models/User');

router.get('/', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Retrieve all users from the database
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Get single users

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const singleUser = await User.findById(id);

    res.status(201).json({ message: 'Getting single User', singleUser });
  } catch (e) {
    res.status(501).json({ message: 'something went wrong', e });
  }
});

// Create a new user 
router.post('/', authenticateToken, async (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const newUser = await User.create(req.body);

    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a user 
router.put('/:id', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;
  const updatedUser = req.body;

  // Update the user in the database
  User.findByIdAndUpdate(id, updatedUser, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully', user });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Delete a user 
router.delete('/:id', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;

  // Delete the user from the database
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
