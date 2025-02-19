const express = require('express');
const { getAllBooks, getSingleBookById,addNewBook,updateBook,deleteBook } = require('../controller/book-controller');
const authMiddleware = require('../middleware/auth-middleware');
const router= express.Router();

router.get('/get',getAllBooks)
router.get('/get/:id',authMiddleware)
router.post('/add',addNewBook)
router.put('/update/:id',updateBook)
router.delete('/delete/:id',deleteBook)


module.exports=router