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

async function uploadFileToCloudinary(file,folder){
    const options = {
        folder: folder
    };
    console.log("Temp File: ",file.tempFilePath);
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