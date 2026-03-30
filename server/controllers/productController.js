const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
    res.json({ message: 'Sản phẩm đã xóa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { user, rating, text } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

    const review = { id: new Date().getTime(), user, rating, text, date: new Date() };
    product.reviews = product.reviews || [];
    product.reviews.push(review);
    await product.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
    res.json(product.reviews || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

    const reviewIndex = product.reviews.findIndex(r => (r.id?.toString() === req.params.reviewId) || (r._id?.toString() === req.params.reviewId));
    if (reviewIndex === -1) return res.status(404).json({ error: 'Đánh giá không tồn tại' });

    if (rating) product.reviews[reviewIndex].rating = rating;
    if (text) product.reviews[reviewIndex].text = text;
    product.reviews[reviewIndex].date = new Date();

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

    product.reviews = product.reviews.filter(r => (r.id?.toString() !== req.params.reviewId) && (r._id?.toString() !== req.params.reviewId));
    await product.save();
    res.json({ message: 'Đã xóa đánh giá' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
