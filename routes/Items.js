const express = require('express');
const authenticateToken = require('../middleware/roleCheck');
const Item = require('../models/Items');
const router = express.Router();

// Get all items (requires admin role)
router.get('/', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin' && req.user.role !== 'customer_executive') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Retrieve all items from the database
  Item.find()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// geting single Items

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleItems = await Item.findById({ _id: id });

    res.status(201).json({ message: 'Getting single Item', singleItems });
  } catch (e) {
    res.status(501).json({ message: 'something went wrong', e });
  }
});

// Create a new item (requires admin role)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'customer_executive') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  console.log('geting items', req.body);

  try {
    const newItems = await Item.create(req.body);
    res.status(201).json({ message: 'Item created successfully', newItems });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an item (requires admin role)
router.put('/:id', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin' && req.user.role !== 'customer_executive') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;
  const updatedItem = req.body;

  // Update the item in the database
  Item.findByIdAndUpdate(id, updatedItem, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item updated successfully', item });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Delete an item (requires admin role)
router.delete('/:id', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin' && req.user.role !== 'customer_executive') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;

  // Delete the item from the database
  Item.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
