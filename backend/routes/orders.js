const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { authRequired } = require('../middleware/auth');

router.post('/', ctrl.create);
router.get('/mine', authRequired, ctrl.mine);
router.get('/track/:id', ctrl.track);

module.exports = router;
