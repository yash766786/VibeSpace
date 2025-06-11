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
    console.log("localpath->", localFilePath)

    try {
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary");
        fs.unlinkSync(localFilePath);

        return response
    } 
    catch(error){
        fs.unlinkSync(localFilePath);
        console.log("Error uploading file on Cloudinary: ", error);
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

        console.log("file is deleted from cloudinary ");
        return response;
    } 
    catch(error){
        console.log("Error deleting file from Cloudinary: ", error);
        return null;
    }
}

export {
    uploadOnCloudinary,
    destroyFromCloudinary,
    uploadMultipleFilesOnCloudinary
}



// import cloudinary from "../config/cloudinary.js";
// // import { v2 as cloudinary } from "cloudinary";
// import { v4 as uuid } from "uuid";
// import { getBase64 } from "../lib/helper.js";

// // configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const uploadOnCloudinary = async (files = []) => {
//     // Ensure files is always an array
//     // const fileArray = Array.isArray(files) ? files : [files];
//     console.log(`cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}, api key: ${process.env.CLOUDINARY_API_KEY}, api secret ${process.env.CLOUDINARY_API_SECRET}`)
//     const uploadPromises = files.map((file) => {
//         return new Promise((resolve, reject) => {
//             cloudinary.uploader.upload(
//                 getBase64(file),
//                 {
//                     resource_type: "auto",
//                     public_id: uuid(),
//                 },
//                 (error, result) => {
//                     if (error) return reject(error);
//                     resolve(result);
//                 }
//             );
//         });
//     });

//     try {
//         const results = await Promise.all(uploadPromises);

//         const formattedResults = results.map((result) => ({
//             public_id: result.public_id,
//             url: result.secure_url,
//         }));
//         return formattedResults;
//     } catch (err) {
//         console.log(err)
//     }
// };

// const destroyFromCloudinary = async (publicId) => {
//     if (!publicId) return null;

//     try {
//         // delete the file from Cloudinary
//         const response = await cloudinary.uploader.destroy(publicId);

//         console.log("file is deleted from cloudinary ");
//         return response;
//     }
//     catch (error) {
//         console.log("Error deleting file from Cloudinary: ", error);
//         return null;
//     }
// }

// export {
//     uploadOnCloudinary,
//     destroyFromCloudinary
// }