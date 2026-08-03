const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/admin-login', ctrl.adminLogin);
router.get('/me', authRequired, ctrl.me);

module.exports = router;
