const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  phone: String,
  address: String,
  bio: String,
  avatar: String,
  wishlist: [mongoose.Schema.Types.ObjectId],
  resetOtp: { type: String, default: null },
  resetOtpExpires: { type: Date, default: null },
  registerOtp: { type: String, default: null },
  registerOtpExpires: { type: Date, default: null },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.resetOtp;
      delete ret.resetOtpExpires;
      delete ret.registerOtp;
      delete ret.registerOtpExpires;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
