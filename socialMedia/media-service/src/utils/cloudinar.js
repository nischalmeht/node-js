// require("dotenv").config();
const cloudinary= require('cloudinary').v2;
const logger = require("./logger");
console.log(process.env.cloud_name)
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });
  
  
const uploadMediaToCloudinary=(file)=>{
    return new Promise((resolve,reject)=>{
      const uploadStream = cloudinary.uploader.upload_stream({resource_type: 'auto'}, (error, result) => {
        if (result) {
          resolve(result)
        } else {
            logger.error('Error in uploading media', error)
          reject(error)
        }        
      })
      uploadStream.end(file.buffer)
    })
}
const deleteMediaFromCloudinary = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      logger.error("Error deleting media from cloudinary", error);
      throw error;
    }
  
}
module.exports = {uploadMediaToCloudinary,deleteMediaFromCloudinary}