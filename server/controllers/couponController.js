const Coupon = require('../models/Coupon');

exports.getAll = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

exports.getById = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ error: 'Mã giảm giá không tìm thấy' });
  res.json(coupon);
};

exports.create = async (req, res) => {
  const coupon = new Coupon(req.body);
  await coupon.save();
  res.status(201).json(coupon);
};

exports.update = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
};

exports.remove = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Mã giảm giá đã xóa' });
};
