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
    const options = folder;
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload handler
exports.imageUpload = async(req,res)=>{
    try{

        // data fetch
        const {names,tags,email} = req.body;
        console.log(names,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        // Validation
        const supportedTypes = ['jpg','jpeg','png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not Supported",
            })
        }

        // If file format is supported
        const response = await uploadFileToCloudinary(file,"FileUploadApp");

        console.log(response);

        // Save entry in db
        // const fileData = await File.create({
        //     name,
        //     tags,
        //     email,
        //     imageUrl
        // })

        res.json({
            success:true,
            message:"Image Successfully uploaded",
        })

    } catch(err){
        console.log(err);
    }
}