// service/cloudinary.js
import {v2 as cloudinary} from "cloudinary";

// configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudinary = async (file) => {
  const buffer = file.buffer
  if (!buffer) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: "auto"},
      (error, result) => {
        if (error) return reject(null);
        return resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const destroyFromCloudinary = async (publicId) =>{
    if(!publicId || publicId == "default-avatar_i9k939") return null;

    try {
        // delete the file from Cloudinary
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } 
    catch(error){
        return null;
    }
}

export {
    uploadOnCloudinary,
    destroyFromCloudinary
}