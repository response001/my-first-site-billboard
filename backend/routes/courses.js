const router = require('express').Router();
const ctrl = require('../controllers/courseController');
const upload = require('../middleware/upload');
const { adminRequired } = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/:slug', ctrl.detail);
router.post('/', adminRequired, upload.single('image'), ctrl.create);
router.post('/register', ctrl.register);
router.get('/registrations/all', adminRequired, ctrl.registrations);
router.patch('/registrations/:id/status', adminRequired, ctrl.updateRegistrationStatus);

module.exports = router;
