const { default: mongoose } = require("mongoose");
const Post = require("../model/post-model");
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validator");
const { publishEvent } = require("../utils/rabbitMq");
async function invalidatePostCache(req, input) {
  const cachedKey = `post:${input}`;
  await req.redisClient.del(cachedKey);

  const keys = await req.redisClient.keys("posts:*");
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
const createPost=async(req,res)=>{
    logger.info("Create Post ")
    try{
      console.log(req.body);
        const {error}=validateCreatePost(req.body);
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
          await publishEvent("post.created", { 
            postId: newlyCreatedPost._id.toString(), 
            userId: req.user.userId.toString(), 
            content: newlyCreatedPost.content,
            createdAt: newlyCreatedPost.createdAt 
          });
    await invalidatePostCache(req, newlyCreatedPost._id.toString());
          logger.info("Post created successfully", newlyCreatedPost);
          res.status(201).json({
            success: true,
            message: "Post created successfully",
          });     
    }catch(err){
        logger.error("Error creating post", err);
        res.status(500).json({
          success: false,
          message: "Error creating post",
        });
    }
}

const getAllPosts=async(req,res)=>{
    console.log('req.query')
    try{
      const page=parseInt(req.query.page)||1;
      const limit=parseInt(req.query.limit)||10;
      const skip=(page-1)*limit;
      const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if(cachedPosts){
      logger.info("Posts fetched from cache");
      return res.status(200).json({
        success: true,
        posts: JSON.parse(cachedPosts),
      });
    }
    const posts = await Post.find({}).skip(skip).limit(limit).sort({createdAt:-1});
    const totalNoOfPosts = await Post.countDocuments();
    const result = {
      posts,
      currentpage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPosts: totalNoOfPosts,
    };
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    res.json(result);

    }catch(err){
      console.log(err,'err')
      logger.error("Error fetching posts", err);
      res.status(500).json({
        success: false,
        message: "Error fetching posts",
      });
    }
}

const getPost=async(req,res)=>{
  console.log('req.params')
    try{
        const postId=req.params.id;
        const cacheKey = `post:${postId}`;
        const cachedPost = await req.redisClient.get(cacheKey);
        if (cachedPost) {
          logger.info("Post fetched from cache");
          return res.status(200).json({
            success: true,
            post: JSON.parse(cachedPost),
          });
        }
        const singlePostById=await Post.findById(postId);
        if(!singlePostById){
            return res.status(404).json({
                success: false,
                message: "Post not found",
              });
        }
        await req.redisClient.setex(cacheKey, 3600, JSON.stringify(singlePostById));
        res.status(200).json({
            success: true,
            post: singlePostById,
          });
          

    }catch(error){ logger.error("Error fetching post", error);
        res.status(500).json({
          success: false,
          message: "Error fetching post by ID",
        });}
}
const deletePost = async (req, res) => {
  try {
    let postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }


    await Post.findByIdAndDelete(post._id);

    await publishEvent("post.deleted", { postId: post._id, userId: req.user.userId ,content:post.content});
    await invalidatePostCache(req, postId);

    logger.info("Post deleted successfully", { postId });
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log(err)
    logger.error("Error deleting post", err);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
    });
  }
};

module.exports={createPost,getAllPosts,getPost,deletePost}