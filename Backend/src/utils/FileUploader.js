const cloudinary = require('cloudinary').v2;

exports.uploadFiles = async (file,folder,quality,height) => {
     try {
        const option ={folder};
        if(quality) {
            option.quality = quality;
        }
        if(height) {
            option.height = height;
        }
        option.resource_type = "auto"; // Automatically detect resource type (image or video)
        return result = await cloudinary.uploader.upload(file.tempFilePath, option);
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return {
            success: false,
            message: "Image upload failed"
        };
    }
}