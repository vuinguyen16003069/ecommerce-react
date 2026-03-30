const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  console.log('📦 Create Order Request:', req.body);
  try {
    const { items, userId, ...orderData } = req.body;

    // Validate userId
    if (!userId || userId === 'guest' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Vui lòng đăng nhập để tạo đơn hàng' });
    }

    // Pre-validate stock for all items
    for (let item of items) {
      const productId = item._id || item.id;
      let product = null;
      
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }
      
      // Fallback to searching by name if ID was not found (helpful during development/reseeding)
      if (!product && item.name) {
        product = await Product.findOne({ name: item.name });
        if (product) {
          console.log(`ℹ️ Patched product ID for "${item.name}" from ${productId} to ${product._id}`);
          // Update the item ID for later use in saving the order
          item.id = product._id;
          item._id = product._id;
        }
      }

      if (!product) return res.status(400).json({ error: `Sản phẩm ${item.name} không tồn tại trong hệ thống` });
      
      if ((product.stock || 0) < item.quantity) {
        return res.status(400).json({ error: `Sản phẩm ${item.name} không đủ số lượng trong kho (Còn: ${product.stock})` });
      }
    }

    const orderId = `DH${Date.now().toString().slice(-6)}`;

    // Update stock and sold counts
    for (let item of items) {
      const productId = item._id || item.id;
      const product = await Product.findById(productId);
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
      items: items.map(i => ({
        id: i._id || i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image
      })),
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
