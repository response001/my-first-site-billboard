const router = require('express').Router();
const ctrl = require('../controllers/productController');
const upload = require('../middleware/upload');
const { adminRequired } = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/featured', ctrl.featured);
router.get('/categories', ctrl.categories);
router.get('/:slug', ctrl.detail);

router.post('/', adminRequired, upload.single('image'), ctrl.create);
router.put('/:id', adminRequired, upload.single('image'), ctrl.update);
router.delete('/:id', adminRequired, ctrl.remove);

router.post('/categories/create', adminRequired, ctrl.createCategory);
router.delete('/categories/:id', adminRequired, ctrl.removeCategory);

module.exports = router;
