const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { adminRequired } = require('../middleware/auth');

router.get('/dashboard', adminRequired, ctrl.dashboard);
router.get('/orders', adminRequired, ctrl.orders);
router.patch('/orders/:id/status', adminRequired, ctrl.updateOrderStatus);
router.get('/reports', adminRequired, ctrl.reports);

module.exports = router;
