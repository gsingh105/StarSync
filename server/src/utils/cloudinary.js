import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; // Native Node.js module
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload from buffer (Memory)
const uploadFromBuffer = async (buffer) => {
    return new Promise((resolve, reject) => {
        // Create a stream to Cloudinary
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        // Convert the buffer to a readable stream and pipe it to Cloudinary
        Readable.from(buffer).pipe(stream);
    });
};

export { uploadFromBuffer };