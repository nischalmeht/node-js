const express=require("express");
const router= express.Router();
const userController=require("../controllers/inditiy-controller")
router.post('/signup',userController.register)
router.post('/login',userController.login)
router.post('/refreshtoken',userController.refreshTokenUser);
router.post('/logout',userController.logout);

module.exports=router;