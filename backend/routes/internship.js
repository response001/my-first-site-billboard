const router = require('express').Router();
const ctrl = require('../controllers/internshipController');
const upload = require('../middleware/upload');
const { adminRequired } = require('../middleware/auth');

router.post('/apply', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'recommendation', maxCount: 1 },
]), ctrl.apply);

router.get('/applications', adminRequired, ctrl.list);
router.patch('/applications/:id/status', adminRequired, ctrl.updateStatus);

module.exports = router;
