const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  lastRefreshed: {
    type: String,
    required: true,
  },
  closingPrice: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Stock', StockSchema);
