const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { authRequired, adminOnly } = require('../middleware/authMiddleware');

router.post('/', authRequired, ctrl.create);
router.get('/', authRequired, adminOnly, ctrl.getAll);
router.get('/user/:userId', authRequired, ctrl.getByUser);
router.get('/:id', authRequired, ctrl.getById);
router.put('/:id/cancel', authRequired, ctrl.cancel);
router.put('/:id', authRequired, adminOnly, ctrl.update);
router.delete('/:id', authRequired, adminOnly, ctrl.remove);

module.exports = router;
