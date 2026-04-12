const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: mongoose.Schema.Types.ObjectId,
  customerName: String,
  customerPhone: String,
  address: String,
  date: { type: Date, default: Date.now },
  total: Number,
  status: { type: String, default: 'Chờ xác nhận' },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
