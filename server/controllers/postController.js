const Post = require('../models/Post');

exports.getAll = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
};

exports.getById = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Bài viết không tìm thấy' });
  res.json(post);
};

exports.create = async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
};

exports.update = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};

exports.remove = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bài viết đã xóa' });
};
