const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({     // config means make relation ==> joining our cloudinary a/c with our backened//
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({    // we are creating a storage//
    cloudinary:cloudinary,                
    params:{
        folder:"wanderlust_DEV",            // making our folder "wanderlust_Dev" in cloudinary to upload file or images//
        allowedFormats : ["jpg", "jpeg", "png"],  // formats allowed//
    }
})



module.exports={
    cloudinary,
    storage,
}

