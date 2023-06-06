const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  Item: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
