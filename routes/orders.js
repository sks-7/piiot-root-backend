const express = require('express');
const authenticateToken = require('../middleware/roleCheck');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'accounts') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  Order.find()
    .then((orders) => {
      res.json(orders);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// getting single order

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const singleOrder = await Order.findById(id);

    res.status(201).json({ message: 'Getting single Order', singleOrder });
  } catch (e) {
    res.status(501).json({ message: 'something went wrong', e });
  }
});

router.post('/', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin' && req.user.role !== 'accounts') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Create a new order using the request body
  const newOrder = new Order(req.body);

  // Save the new order to the database
  newOrder
    .save()
    .then((order) => {
      res.status(201).json({ message: 'Order created successfully', order });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin' && req.user.role !== 'accounts') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;
  const updatedOrder = req.body;

  // Update the order in the database
  Order.findByIdAndUpdate(id, updatedOrder, { new: true })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ message: 'Order updated successfully', order });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.delete('/:id', authenticateToken, (req, res) => {
  // Check if the user has the required role
  if (req.user.role !== 'admin' && req.user.role !== 'accounts') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;

  // Delete the order from the database
  Order.findByIdAndDelete(id)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
