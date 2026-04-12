const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Permission', permissionSchema);
