const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: Number,
  desc: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
