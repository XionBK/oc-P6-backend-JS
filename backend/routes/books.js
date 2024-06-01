const express = require('express')
const router = express.Router()

const auth      = require('../middleware/auth');
const multer    = require('../middleware/multer-config')
const resizeImg = require('../middleware/resize-img');
const bookCtrl  = require('../controllers/books')

router.post('/', auth, multer, resizeImg, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getBook);
router.get('/', bookCtrl.getAllBooks);

router.put('/:id', auth, multer, resizeImg, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

router.post('/:id/rating', auth, bookCtrl.addRating)

module.exports = router