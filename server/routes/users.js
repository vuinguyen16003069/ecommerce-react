const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:userId/wishlist/:productId', ctrl.toggleWishlist);

module.exports = router;
