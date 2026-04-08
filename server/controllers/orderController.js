const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  try {
    const { items, userId, ...orderData } = req.body;

    if (!userId || userId === 'guest' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Vui lòng đăng nhập để tạo đơn hàng' });
    }

    let calculatedTotal = 0;
    const finalItems = [];

    for (const item of items) {
      const productId = item.productId || item._id || item.id;

      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, sold: item.quantity } },
        { returnDocument: 'after' }
      );

      if (!product) {
        return res.status(400).json({ error: `Sản phẩm "${item.name}" không đủ số lượng hoặc không tồn tại.` });
      }

      const unitPrice = product.isFlashSale
        ? product.price * (1 - (product.flashSaleDiscount || 50) / 100)
        : product.price;

      calculatedTotal += unitPrice * item.quantity;
      finalItems.push({ productId: product._id, name: product.name, quantity: item.quantity, price: unitPrice, image: product.image });
    }

    const shipping = calculatedTotal > 299000 ? 0 : 30000;
    const orderId = `DH${Date.now().toString().slice(-6)}`;
    const order = new Order({
      orderId,
      userId,
      ...orderData,
      items: finalItems,
      total: calculatedTotal + shipping,
      status: 'Chờ xác nhận',
      date: new Date()
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Đơn hàng không tìm thấy' });
  res.json(order);
};

exports.update = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  res.json(order);
};

exports.remove = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Đơn hàng đã xóa' });
};
