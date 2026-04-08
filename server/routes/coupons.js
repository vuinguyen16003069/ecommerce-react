const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/couponController');
const { authRequired, adminOnly } = require('../middleware/authMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', authRequired, adminOnly, ctrl.create);
router.put('/:id', authRequired, adminOnly, ctrl.update);
router.delete('/:id', authRequired, adminOnly, ctrl.remove);

module.exports = router;
