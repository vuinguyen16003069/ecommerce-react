const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:id/reviews', ctrl.addReview);

module.exports = router;
