const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  try {
    const { items, userId, ...orderData } = req.body;

    // Validate userId
    if (!userId || userId === 'guest' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Vui lòng đăng nhập để tạo đơn hàng' });
    }

    const orderId = `DH${Date.now().toString().slice(-6)}`;

    for (let item of items) {
      const product = await Product.findById(item.id);
      if (product) {
        product.stock = (product.stock || 0) - item.quantity;
        product.sold = (product.sold || 0) + item.quantity;
        await product.save();
      }
    }

    const order = new Order({
      orderId,
      userId,
      ...orderData,
      items,
      status: 'Chờ xác nhận',
      date: new Date()
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  const orders = await Order.find().sort({ date: -1 });
  res.json(orders);
};

exports.getByUser = async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(orders);
};

exports.getById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Đơn hàng không tìm thấy' });
  res.json(order);
};

exports.update = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
};

exports.remove = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đơn hàng đã xóa' });
};
