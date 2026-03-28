const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

// Routes cụ thể (phải ở trước routes generic)
router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.post('/verify-register-otp', ctrl.verifyRegisterOtp);
router.post('/resend-register-otp', ctrl.resendRegisterOtp);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

// Routes generic
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:userId/wishlist/:productId', ctrl.toggleWishlist);

module.exports = router;
