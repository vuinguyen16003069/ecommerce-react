const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  phone: String,
  wishlist: [mongoose.Schema.Types.ObjectId],
  resetOtp: { type: String, default: null },
  resetOtpExpires: { type: Date, default: null },
  registerOtp: { type: String, default: null },
  registerOtpExpires: { type: Date, default: null },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
