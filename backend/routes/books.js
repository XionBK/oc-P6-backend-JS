const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/books')

router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.get('/', bookCtrl.getAllBooks);

router.put('/:id', auth, multer, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router