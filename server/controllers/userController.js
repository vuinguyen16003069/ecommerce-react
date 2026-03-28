const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ error: 'Sai email hoặc mật khẩu!' });
  if (user.status === 'locked') return res.status(403).json({ error: 'Tài khoản đã bị khóa!' });
  res.json(user);
};

exports.register = async (req, res) => {
  const { email } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email đã tồn tại!' });
  const user = new User({ ...req.body, role: 'user', status: 'active', wishlist: [] });
  await user.save();
  res.status(201).json(user);
};

exports.getAll = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Người dùng không tìm thấy' });
  res.json(user);
};

exports.update = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

exports.remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Người dùng đã xóa' });
};

exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ error: 'Người dùng không tìm thấy' });
  const productId = req.params.productId;
  const wishlist = user.wishlist || [];
  user.wishlist = wishlist.includes(productId)
    ? wishlist.filter(id => id !== productId)
    : [...wishlist, productId];
  await user.save();
  res.json(user);
};
