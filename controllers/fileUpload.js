const File = require('../models/File');
const cloudinary = require('cloudinary').v2;

// local file upload -> handler function
exports.localFileUpload = async(req,res)=>{
    try{

        // fetch files from request
        const file = req.files.file;
        console.log("Files : ",file);

        // create path where file needs to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("Path : ",path);
        
        // add path to the move function
        file.mv(path , (err)=> {
            console.log(err);
        });

        // Create a successfull response
        res.json({
            success:true,
            message:"Local files uploaded successfully",
        })

    } catch(err){
        console.log(err);
    }

}

function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options = {
        folder: folder,
        resource_type: "auto"
    };
    console.log("Temp File: ",file.tempFilePath);

    if(quality){
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload handler
exports.imageUpload = async(req,res)=>{
    try{

        // data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportedTypes = ['jpg','jpeg','png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        console.log("FileType:",fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not Supported",
            })
        }

        // If file format is supported
        console.log("Uploading to FileUploadApp");
        const response = await uploadFileToCloudinary(file,"FileUploadApp");

        console.log(response);

        // Save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            image:response.secure_url,
        })

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully uploaded",
        })

    } catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something Went Wrong",
        })
    }
}

// Video Upload Handler
exports.videoUpload = async(req,res) =>{
    try{
        // fetch data
        const {name,email,tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.videoFile;

        // Validation
        const supportedTypes = ['mp4','mov'];
        const fileType = file.name.split('.')[1].toLowerCase();

        console.log("FileType:",fileType);

         
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not Supported",
            })
        }

        // If file format is supported
        console.log("Uploading to FileUploadApp");
        const response = await uploadFileToCloudinary(file,"FileUploadApp");

        console.log(response);

        // Save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            image:response.secure_url,
        })

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:"Video Successfully uploaded",
        })

    } catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something Went Wrong",
        })
    }
}


// Image Reducer
exports.imageReducerUpload = async(req,res)=>{
    try{
        // fetch data
        const {name,email,tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.imageFile;

        // Validation
        const supportedTypes = ['jpg','jpeg','png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        console.log("FileType:",fileType);

        // TODO: Add an upper limit of 5MB for Video 
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not Supported",
            })
        }

        // If file format is supported
        console.log("Uploading to FileUploadApp");
        const response = await uploadFileToCloudinary(file,"FileUploadApp", 30);

        console.log(response);

        // Save entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            image:response.secure_url,
        })

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:"Video Successfully uploaded",
        })

    } catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something Went Wrong",
        })
    }
}