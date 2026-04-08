const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const upload = require('../middleware/upload');
const { authRequired, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

// Routes cụ thể (phải ở trước routes generic)
router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.post('/verify-register-otp', ctrl.verifyRegisterOtp);
router.post('/resend-register-otp', ctrl.resendRegisterOtp);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

// Routes generic
router.get('/', authRequired, adminOnly, ctrl.getAll);
router.get('/:id', authRequired, ctrl.getById);
router.post('/:id/avatar', authRequired, upload.single('avatar'), ctrl.uploadAvatar);
router.put('/:id', authRequired, ctrl.update);
router.delete('/:id', authRequired, superAdminOnly, ctrl.remove);
router.post('/:userId/wishlist/:productId', authRequired, ctrl.toggleWishlist);

module.exports = router;
