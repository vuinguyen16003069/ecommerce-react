const User = require('../models/User');
const mongoose = require('mongoose');
const { sendResetOtpEmail, sendRegisterOtpEmail } = require('../services/emailService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác!' });
    if (user.status === 'locked') return res.status(403).json({ error: 'Tài khoản đã bị khóa!' });
    if (user.status === 'pending_verification') return res.status(403).json({ error: 'Vui lòng xác nhận email trước khi đăng nhập!' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác!' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email đã tồn tại!' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Tạo user với status pending_verification
    const user = new User({
      ...req.body,
      role: 'user',
      status: 'pending_verification',
      isEmailVerified: false,
      wishlist: [],
      registerOtp: otp,
      registerOtpExpires: Date.now() + 10 * 60 * 1000 // 10 mins
    });
    await user.save();

    // Gửi email OTP
    const emailSent = await sendRegisterOtpEmail(email, otp);

    if (!emailSent) {
      // Xóa user nếu gửi mail thất bại
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        error: 'Không thể gửi email. Vui lòng kiểm tra cấu hình email hoặc thử lại sau.'
      });
    }

    res.status(201).json({
      message: `Mã OTP đã được gửi đến ${email}. Kiểm tra inbox của bạn.`,
      email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Người dùng không tìm thấy' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tìm thấy' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID người dùng không hợp lệ' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tìm thấy' });

    const currentUserId = req.headers['x-user-id'];
    const currentUserRole = req.headers['x-user-role'];

    // Kiểm tra quyền: user thường chỉ update chính mình, admin update ai cũng được
    if (currentUserRole === 'user' && currentUserId !== user._id.toString()) {
      return res.status(403).json({ error: 'Bạn chỉ có thể cập nhật thông tin của chính mình' });
    }

    // Protected fields: user thường không được update role, status
    const allowedFields = currentUserRole === 'user' 
      ? ['name', 'email', 'phone', 'address', 'bio', 'avatar']
      : ['name', 'email', 'phone', 'address', 'bio', 'avatar', 'status', 'role'];

    // ✅ NEW: Admin có thể thay đổi role/status nhưng không thể sửa super admin
    if ((req.body.role !== undefined || req.body.status !== undefined) && currentUserRole === 'admin') {
      const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
      
      // Không cho phép thay đổi role/status của super admin
      if (firstAdmin && user._id.toString() === firstAdmin._id.toString()) {
        return res.status(403).json({ error: 'Không thể chỉnh sửa Super Admin' });
      }
    }

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    // Loại bỏ internal flags trước khi save
    if (req.body._currentUserId) {
      delete user._currentUserId;
    }

    if (req.body.email && req.body.email !== user.email) {
      const existing = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
      if (existing) return res.status(400).json({ error: 'Email đã tồn tại!' });
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID người dùng không hợp lệ' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Người dùng không tìm thấy' });
    if (!req.file) return res.status(400).json({ error: 'Vui lòng chọn file ảnh' });

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID người dùng không hợp lệ' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Người dùng đã xóa' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(404).json({ error: 'Người dùng không tìm thấy' });
    }
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Người dùng không tìm thấy' });
    const productId = req.params.productId;
    const wishlist = user.wishlist || [];
    user.wishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email không tồn tại trong hệ thống' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Gửi email
    const emailSent = await sendResetOtpEmail(email, otp);

    if (!emailSent) {
      // Rollback nếu gửi mail thất bại
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();
      return res.status(500).json({
        error: 'Không thể gửi email. Vui lòng kiểm tra cấu hình email hoặc thử lại sau.'
      });
    }

    res.json({
      message: `Mã OTP đã được gửi đến ${email}. Kiểm tra inbox của bạn.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Email không tồn tại trong hệ thống' });

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ error: 'Mã OTP không hợp lệ hoặc đã được sử dụng' });
    }

    if (user.resetOtpExpires && Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ error: 'Mã OTP đã hết hạn' });
    }

    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Email không tồn tại trong hệ thống' });

    if (user.status === 'active') {
      return res.status(400).json({ error: 'Tài khoản đã được xác nhận' });
    }

    if (!user.registerOtp || user.registerOtp !== otp) {
      return res.status(400).json({ error: 'Mã OTP không hợp lệ hoặc đã được sử dụng' });
    }

    if (user.registerOtpExpires && Date.now() > user.registerOtpExpires) {
      return res.status(400).json({ error: 'Mã OTP đã hết hạn' });
    }

    // Xác nhận email + activate account
    user.status = 'active';
    user.isEmailVerified = true;
    user.registerOtp = null;
    user.registerOtpExpires = null;
    await user.save();

    res.json({
      message: 'Xác nhận email thành công!',
      user // Return user để auto login
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Email không tồn tại trong hệ thống' });

    if (user.status === 'active') {
      return res.status(400).json({ error: 'Tài khoản đã được xác nhận' });
    }

    // Generate OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.registerOtp = otp;
    user.registerOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Gửi email
    const emailSent = await sendRegisterOtpEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        error: 'Không thể gửi email. Vui lòng thử lại sau.'
      });
    }

    res.json({
      message: `Mã OTP mới đã được gửi đến ${email}.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
