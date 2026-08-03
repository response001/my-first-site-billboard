const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const upload = require('../middleware/upload');
const { adminRequired } = require('../middleware/auth');

router.post('/message', ctrl.sendMessage);
router.get('/messages', adminRequired, ctrl.messages);
router.patch('/messages/:id/read', adminRequired, ctrl.markRead);

router.get('/blog', ctrl.listBlog);
router.get('/blog/:slug', ctrl.blogDetail);
router.post('/blog', adminRequired, upload.single('image'), ctrl.createBlog);

module.exports = router;
