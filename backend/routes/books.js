const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/books')

router.post('/', bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.get('/', bookCtrl.getAllBooks);

module.exports = router