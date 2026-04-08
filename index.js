// dns
const dns = require('dns');
dns.setServers(['8.8.8.8','1.1.1.1']);

// app create
const express = require('express');
const app = express();

require('dotenv').config();

// Find Port
PORT = process.env.PORT || 3000;

// Add middlewares
app.use(express.json());
const fileupload = require('express-fileupload');
app.use(fileupload(
    {
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// db connection
const db = require('./config/database')
db.connect();

// cloud connection
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();


// api Route Mount
const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload/',Upload);

// Activate server
app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`);
})