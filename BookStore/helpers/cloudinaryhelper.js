const cloudinary=require("../config/Configuration");

const uploadToCloudinary = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    //   return result.public_id;
    } catch (error) {
      console.error(error);
    }
};

module.exports={uploadToCloudinary}