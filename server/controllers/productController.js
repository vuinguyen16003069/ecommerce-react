const mongoose = require("mongoose");
const Product = require("../models/Product");

const clampRating = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return 5;
  return Math.min(5, Math.max(1, num));
};

const computeAverageRating = (reviews = []) => {
  if (!reviews.length) return 5;
  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return Number((total / reviews.length).toFixed(1));
};

const findReviewIndex = (product, reviewId) =>
  product.reviews.findIndex((review) => review.id?.toString() === reviewId);

const formatProduct = (product) => {
  if (!product) return product;
  const data = product.toObject ? product.toObject() : product;
  data.rating = computeAverageRating(data.reviews);
  return data;
};

exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products.map(formatProduct));
};

exports.getById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
  res.json(formatProduct(product));
};

exports.create = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(formatProduct(product));
};

exports.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(formatProduct(product));
};

exports.remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Sản phẩm đã xóa" });
};

exports.addReview = async (req, res) => {
  const { user, rating, text } = req.body;
  if (!user || !text?.trim()) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ thông tin đánh giá" });
  }

  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Sản phẩm không tìm thấy" });

  const review = {
    id: new mongoose.Types.ObjectId(),
    user,
    rating: clampRating(rating),
    text: text.trim(),
    date: new Date(),
  };

  product.reviews = product.reviews || [];
  product.reviews.push(review);
  product.rating = computeAverageRating(product.reviews);
  await product.save();

  res.status(201).json(formatProduct(product));
};

exports.getReviews = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
  res.json(product.reviews || []);
};

exports.updateReview = async (req, res) => {
  const { rating, text } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Sản phẩm không tìm thấy" });

  const reviewIndex = findReviewIndex(product, req.params.reviewId);
  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Đánh giá không tồn tại" });
  }

  if (rating !== undefined) {
    product.reviews[reviewIndex].rating = clampRating(rating);
  }
  if (text !== undefined) {
    const trimmed = text.trim ? text.trim() : text;
    if (!trimmed) {
      return res
        .status(400)
        .json({ error: "Nội dung đánh giá không được để trống" });
    }
    product.reviews[reviewIndex].text = trimmed;
  }
  product.reviews[reviewIndex].date = new Date();
  product.rating = computeAverageRating(product.reviews);
  await product.save();

  res.json(formatProduct(product));
};

exports.removeReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Sản phẩm không tìm thấy" });

  const reviewIndex = findReviewIndex(product, req.params.reviewId);
  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Đánh giá không tồn tại" });
  }

  product.reviews.splice(reviewIndex, 1);
  product.rating = computeAverageRating(product.reviews);
  await product.save();

  res.json(formatProduct(product));
};
