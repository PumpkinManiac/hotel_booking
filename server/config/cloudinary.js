import cloudinaryPkg from 'cloudinary';

const { v2: cloudinary } = cloudinaryPkg;

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
};

export default connectCloudinary;
