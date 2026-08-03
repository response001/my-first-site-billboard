const router = require('express').Router();
const ctrl = require('../controllers/contactController');

router.get('/', ctrl.listBlog);
router.get('/:slug', ctrl.blogDetail);
router.post('/', ctrl.createBlog);

module.exports = router;
