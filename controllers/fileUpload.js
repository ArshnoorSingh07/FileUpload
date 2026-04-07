const File = require('../models/File');

// local file upload -> handler function
exports.localFileUpload = async(req,res)=>{
    try{

        // fetch files
        const file = req.files.file;
        console.log("Files : ",file);

        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("Path : ",path);
        
        file.mv(path , (err)=> {
            console.log(err);
        });

        res.json({
            success:true,
            message:"Local files uploaded successfully",
        })

    } catch(err){
        console.log(err);
    }

}