const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ⚠️ CRITICAL SECURITY FIX: Xác thực JWT Token thay vì tin tưởng headers
// Middleware kiểm tra user đã đăng nhập & hoạt động
exports.authRequired = async (req, res, next) => {
  try {
    // 1. Lấy token từ Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Vui lòng cung cấp token hợp lệ' });
    }

    const token = authHeader.slice(7); // Loại bỏ 'Bearer '

    // 2. Giải mã JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const userId = decoded.id;

    // 3. Xác thực user từ DB (KHÔNG tin tưởng token)
    const userFromDB = await User.findById(userId);
    if (!userFromDB) {
      return res.status(401).json({ error: 'User không tồn tại' });
    }

    // 4. Kiểm tra user bị khóa
    if (userFromDB.status === 'locked') {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa' });
    }

    // 5. Lưu user đã xác thực từ DB vào req
    req.currentUser = {
      id: userFromDB._id.toString(),
      role: userFromDB.role,
      status: userFromDB.status,
      email: userFromDB.email,
    };

    req.verifiedUser = userFromDB;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    res.status(401).json({ error: 'Không xác thực được' });
  }
};

// Middleware kiểm tra role admin/manager/staff
exports.adminOnly = async (req, res, next) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    }

    // CRITICAL FIX: Xác thực từ DB thay vì tin header
    const userFromDB = await User.findById(req.currentUser.id);
    if (!userFromDB) {
      return res.status(401).json({ error: 'Không tìm thấy user' });
    }

    // Chỉ user thường bị block, mọi role khác được phép
    if (userFromDB.role === 'user') {
      return res.status(403).json({ error: 'Bạn không có quyền truy cập trang này' });
    }

    // Attached verified user
    req.verifiedUser = userFromDB;
    next();
  } catch {
    res.status(500).json({ error: 'Lỗi xác thực' });
  }
};

// Middleware kiểm tra super admin
exports.superAdminOnly = async (req, res, next) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    }

    // CRITICAL FIX: Xác thực từ DB thay vì tin header (header dễ giả mạo)
    const currentUserFromDB = await User.findById(req.currentUser.id);
    if (!currentUserFromDB || currentUserFromDB.role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ Admin được phép tác vụ này' });
    }

    // Xác thực là super admin (admin đầu tiên)
    const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    if (!firstAdmin || currentUserFromDB._id.toString() !== firstAdmin._id.toString()) {
      return res.status(403).json({ error: 'Chỉ Super Admin được phép tác vụ này' });
    }

    // Attached verified user để controller sử dụng
    req.verifiedUser = currentUserFromDB;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kiểm tra user active
exports.requireActiveStatus = (req, res, next) => {
  if (req.currentUser && req.currentUser.status !== 'active') {
    return res.status(403).json({ error: 'Tài khoản không hoạt động' });
  }
  next();
};

// Middleware: Admin có thể quản lý nhưng không thể sửa super admin
// Admin thường có thể: tạo/sửa/xóa roles, thay đổi role user (nhưng không phải super admin)
exports.adminCanManageButNotSuperAdmin = async (req, res, next) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    }

    // Xác thực requestor là admin
    const currentUserFromDB = await User.findById(req.currentUser.id);
    if (!currentUserFromDB || currentUserFromDB.role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ Admin được phép tác vụ này' });
    }

    // Check: Nếu có targetUserId trong request, kiểm tra không phải super admin
    if (req.params.id || req.body?.userId) {
      const targetId = req.params.id || req.body?.userId;
      const targetUser = await User.findById(targetId);

      if (targetUser && targetUser.role === 'admin') {
        // Check nếu target là super admin (admin đầu tiên)
        const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
        if (firstAdmin && targetUser._id.toString() === firstAdmin._id.toString()) {
          return res.status(403).json({ error: 'Không thể chỉnh sửa Super Admin' });
        }
      }
    }

    // Attached verified user
    req.verifiedUser = currentUserFromDB;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
