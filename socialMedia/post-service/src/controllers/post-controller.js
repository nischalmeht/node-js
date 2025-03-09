const logger = require("../utils/logger")

const createPost=async(req,res)=>{
    logger.info("Create Post ")
    try{
        const {error}=req.body
        if (error) {
            logger.warn("Validation error", error.details[0].message);
            return res.status(400).json({
              success: false,
              message: error.details[0].message,
            });
          }
          const { content, mediaIds } = req.body;
          const newlyCreatedPost = new Post({
            user: req.user.userId,
            content,
            mediaIds: mediaIds || [],
          });
      
          await newlyCreatedPost.save();
      
    }catch(err){
        logger.error("Error creating post", error);
        res.status(500).json({
          success: false,
          message: "Error creating post",
        });
    }
}
const getAllPosts=async(req,res)=>{
    try{

    }catch(err){

    }
}
const getPost=async(req,res)=>{
    try{
        
    }catch(error){ logger.error("Error fetching post", error);
        res.status(500).json({
          success: false,
          message: "Error fetching post by ID",
        });}
}

module.exports={createPost,getAllPosts,getPost}