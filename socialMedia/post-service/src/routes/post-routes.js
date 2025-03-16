const express=require("express");
const router= express.Router();
const {createPost, getAllPosts, getPost, deletePost}=require("../controllers/post-controller")
const {authenticateRequest}=require("../middleware/auth-middleware")

router.use(authenticateRequest);
router.post("/create-post", createPost);
router.post("/get-all-post", getAllPosts);
router.get("/:id", getPost);
router.delete("/:id", deletePost);
module.exports=router;