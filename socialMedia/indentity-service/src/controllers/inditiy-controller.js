const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger");
const ValidatorSchema = require("../utils/validator");

class userController{
    
static async register(req,res){
    logger.info("User Register Hit")
    try{
        const {error}= ValidatorSchema.validate(req.body);
        if (error) {
            logger.warn("Validation error", error.details[0].message);
            return res.status(400).json({
              success: false,
              message: error.details[0].message,
            });
          }
      
        const { email, password, username } = req.body;
        // let user =User.findOne({$or:[{email},{username}]});
        let user = await User.findOne({
          $or: [
            { email: email },      // Match the email field against the value of the 'email' variable
            { username: username } // Match the username field against the value of the 'username' variable
          ]
        });

        if(user){
            logger.warn("User alread exist")
            return res.status(400).json({
                success: false,
                message: "User already exists",
              });
        }
        user = new User({ username, email, password });
        await user.save();
        logger.warn("User saved successfully", user._id);
        const {accessToken, refreshToken}=await generateTokens(user);
        
    res.status(201).json({
        success: true,
        message: "User registered successfully!",
        accessToken,
        refreshToken,
      });
    }catch(e){
        logger.error("Registration error occured", e);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
    }
}
static async login(req,res){
  logger.info("User Register Hit")
  try{
      const {error}= validatelogin(req.body);
      if (error) {
          logger.warn("Validation error", error.details[0].message);
          return res.status(400).json({
            success: false,
            message: error.details[0].message,
          });
        }
    
      const { email, password,  } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        logger.warn("Invalid user");
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if(user){
          logger.warn("User alread exist")
          return res.status(400).json({
              success: false,
              message: "User already exists",
            });
      }
     // user valid password or not
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
      const {accessToken, refreshToken}=await generateTokens(user);
      
  res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
      userId: user._id,
    });
  }catch(e){
      logger.error("Registration error occured", e);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
  }
}
}
module.exports=userController