const express = require('express')
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/books')

const router = express.Router()

router.post('/', auth, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.get('/', bookCtrl.getAllBooks);

module.exports = router