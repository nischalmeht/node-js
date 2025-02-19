const Image = require("../Models/image");
const { uploadToCloudinary } = require("../helpers/cloudinaryhelper");
const fs = require("fs");
const cloudinary = require("../config/Configuration");

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required. Please upload an image",
            });
        }
            const { url, publicId } = await uploadToCloudinary(req.file.path);
            const newlyUpdatedImage = new Image({
                url,
                publicId,
                uploadedBy: req.userInfo.userId,
            })
            newlyUpdatedImage.save()
        fs.unlinkSync(req.file.path)
    res.status(201).json({
        success: true,
        message: "Imaged uploaded successfully",
        image: newlyUpdatedImage,
      });

    } catch (error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again",
        });
    }
}
const fetchImageController=async (req,res)=>{
   try{
    const images = await Image.find({});
    if (images){
        res.status(200).json({
            success:true,
            data:images
        })        
    }
   }catch(error){
    res.status(500).json({
        success:false,
        message: "Something went wrong! Please try again",
    })
   }
}
module.exports={uploadImage,fetchImageController}