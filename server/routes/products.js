const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { authRequired, adminOnly } = require('../middleware/authMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authRequired, adminOnly, ctrl.create);
router.put('/:id', authRequired, adminOnly, ctrl.update);
router.delete('/:id', authRequired, adminOnly, ctrl.remove);
router.post('/:id/reviews', authRequired, ctrl.addReview);
router.get('/:id/reviews', ctrl.getReviews);
router.put('/:id/reviews/:reviewId', authRequired, ctrl.updateReview);
router.delete('/:id/reviews/:reviewId', authRequired, ctrl.removeReview);

module.exports = router;
