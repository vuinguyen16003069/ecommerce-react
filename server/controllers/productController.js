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
    let { user, rating, text } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

    // Simple XSS Sanitization
    text = String(text).replace(/<[^>]*>?/gm, '');

    const review = { user, rating, text, date: new Date() };
    product.reviews = product.reviews || [];
    product.reviews.push(review);

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

    await product.save();
    res.status(201).json(product.reviews[product.reviews.length - 1]);
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
    let { rating, text } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Đánh giá không tìm thấy' });

    if (text !== undefined) review.text = String(text).replace(/<[^>]*>?/gm, '');
    if (rating !== undefined) review.rating = rating;

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

    await product.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Đánh giá không tìm thấy' });

    review.deleteOne();

    // Recalculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.json({ message: 'Đã xóa đánh giá' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


