// role : upload the request file to upload folder on server

const ApiError = require('../utils/ApiError');
const debugWRITE = require('debug')('app:write');
const path = require('path');

const fileServerUpload = (req,res,next) => {
    // check if a file has been uploaded
    if(req.files){
        // store file
        const file = req.files.image;
        debugWRITE(`Image for server processing: ${file.name}`);

        //append unique file id
        const filename = Date.now() + '_' + file.name;
        debugWRITE(`unique filename" ${filename}`);
        
        // declare destination for files
        const uploadPath = path.join(
            __dirname, 
            '../../public/uploads',
            filename
        );

        //move file to directory
        file
        .mv(uploadPath)
        .then(() => {
            console.log(`Server Upload Successful: ${uploadPath}`);
            res.locals.filename = filename;
            next();
        })
        .catch(error => {
            if(error) return next(ApiError.internal("You're file request could not be processed at this time", error))
        })

    } else {
        next();
    }
}

module.exports = fileServerUpload;