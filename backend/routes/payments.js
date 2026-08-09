const router = require('express').Router();
const ctrl = require('../controllers/paymentController');

router.get('/paypack/status/:ref', ctrl.status);
router.post('/paypack/webhook', ctrl.webhook);

module.exports = router;
