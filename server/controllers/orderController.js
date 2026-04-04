const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
  console.log('📦 Create Order Request:', req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, userId, ...orderData } = req.body;

    if (!userId || userId === 'guest' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Vui lòng đăng nhập để tạo đơn hàng' });
    }

    let calculatedTotal = 0;
    const finalItems = [];

    // 1. Validate & Secure Pricing & Deduct Stock Atomically
    for (const item of items) {
      const productId = item._id || item.id;
      
      // Atomic stock check and update
      const product = await Product.findOneAndUpdate(
        { 
          _id: productId, 
          stock: { $gte: item.quantity } 
        },
        { 
          $inc: { stock: -item.quantity, sold: item.quantity } 
        },
        { new: true, session }
      );

      if (!product) {
        throw new Error(`Sản phẩm ${item.name} không đủ số lượng hoặc không tồn tại.`);
      }

      // Calculate price based on SERVER price (flash sale protection)
      const unitPrice = product.isFlashSale 
        ? product.price * (1 - (product.flashSaleDiscount || 50) / 100)
        : product.price;
      
      calculatedTotal += unitPrice * item.quantity;

      finalItems.push({
        id: product._id,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        image: product.image
      });
    }

    // Add shipping cost if needed
    const shipping = calculatedTotal > 299000 ? 0 : 30000;
    const finalTotal = calculatedTotal + shipping;

    const orderId = `DH${Date.now().toString().slice(-6)}`;
    const order = new Order({
      orderId,
      userId,
      ...orderData,
      items: finalItems,
      total: finalTotal,
      status: 'Chờ xác nhận',
      date: new Date()
    });

    await order.save({ session });
    await session.commitTransaction();
    
    res.status(201).json(order);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
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
