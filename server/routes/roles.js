const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/roleController');
const { authRequired, adminCanManageButNotSuperAdmin } = require('../middleware/authMiddleware');

router.get('/', authRequired, ctrl.getAll);
router.get('/:id', authRequired, ctrl.getById);
router.post('/', authRequired, adminCanManageButNotSuperAdmin, ctrl.create);
router.put('/:id', authRequired, adminCanManageButNotSuperAdmin, ctrl.update);
router.delete('/:id', authRequired, adminCanManageButNotSuperAdmin, ctrl.remove);

module.exports = router;
