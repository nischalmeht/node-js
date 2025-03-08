const express = require('express');
const { loginUser, registerUser, deleteImageController } = require('../controller/auth-controller');
const { uploadImage, fetchImageController } = require('../controller/image-controller');
const authMiddleware = require('../middleware/auth-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const router = express.Router();


router.post('/login',loginUser);
router.post('/upload',authMiddleware,uploadMiddleware.single('image'),uploadImage);
router.get('/fetch',fetchImageController)
router.post('/signup',registerUser);
router.delete('/:id',authMiddleware,deleteImageController);
module.exports=router