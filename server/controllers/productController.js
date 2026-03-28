const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
  res.json(product);
};

exports.create = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

exports.remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Sản phẩm đã xóa' });
};

exports.addReview = async (req, res) => {
  const { user, rating, text } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

  const review = { id: new Date().getTime(), user, rating, text, date: new Date() };
  product.reviews = product.reviews || [];
  product.reviews.push(review);
  await product.save();
  res.status(201).json(review);
};
