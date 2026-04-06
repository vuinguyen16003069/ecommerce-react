const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  category: { type: String, default: 'Tin tức' },
  excerpt: String,
  date: { type: Date, default: Date.now },
  content: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
