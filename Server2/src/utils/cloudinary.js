// // service/cloudinary.js
// service/cloudinary.js
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudinary = async (localFilePath) =>{
    if(!localFilePath) return null;

    try {
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successfully
        fs.unlinkSync(localFilePath);
        return response
    } 
    catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const uploadMultipleFilesOnCloudinary = async (filePaths = []) => {
    if (!Array.isArray(filePaths) || filePaths.length === 0) return [];
    const uploadPromises = filePaths.map((file) => uploadOnCloudinary(file.path));
    
    // Run uploads in parallel
    const results = await Promise.all(uploadPromises);

    // Filter out any failed uploads (nulls)
    const FilteredFile = results.filter((file) => file !== null)

    // tranformed file into desired way
    const transformedFiles = FilteredFile.map((file) => {
        return {
            url: file.url,
            public_id: file.public_id
        }
    })
    return transformedFiles
};


const destroyFromCloudinary = async (publicId) =>{
    if(!publicId) return null;

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
    destroyFromCloudinary,
    uploadMultipleFilesOnCloudinary
}