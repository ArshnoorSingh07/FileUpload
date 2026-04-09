const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

require('dotenv').config();

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});

// post middleware
fileSchema.post('save',async function(doc){
    try{

        console.log("DOC : ",doc);

        // transporter
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASSWORD,
            },
        })

        // Send mail
        let info = await transporter.sendMail({
            from: `Arshnoor Singh`,
            to: doc.email,
            subject: "New file Uploaded on Cloudinary",
            html:`<h2>Hello sir!</h2> <p>File Uploaded View here:<a href=${doc.image}>${doc.image}</a></p> `,
        })

        console.log("INFO : ",info);

    } catch(err){
        console.error(err);
    }
})

const File = mongoose.model("File",fileSchema);

module.exports = File;