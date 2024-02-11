const { bucket } = require('../config/db');
const debugBucket = require('debug')('app:bucket');
const uuid = require('uuid');
const fs = require('fs');

module.exports = {
    async storageBucketUpload(filename){
        // generate random uuid storage token
        debugBucket(`Firestore Filename: ${filename}`)
        const storageToken = uuid.v4();

        // declare our filepath and optional params for bucket upload
        const serverFilePath = `./public/uploads/${filename}`;
        const options = {
            destination: filename,
            resumable: true,
            validation: 'crc32c',
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: storageToken
                },
            }
        }

           // OPTIONAL DEBUGGING: Checks if server-side /uploads file exists before BUCKET UPLOAD
            fs.access(serverFilePath, fs.F_OK, (err) => {
                if (err) {
                debugBucket(err);
                return({
                    message: 'Error occurred in storing file to server'
                });
                } else {
                debugBucket("File Successfully Stored in Server");
                }
             });
        // cloud firstore upload
        const result = await bucket.upload(serverFilePath, options)
        const bucketName = result[0].metadata.bucket;
        debugBucket(`Bucket Name : ${bucketName}`)

        // retrieve link to file
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filename}?alt=media&token=${storageToken}`;
        console.log(`File Successfully uploaded: ${downloadURL}`)

        //delete temp file
        fs.unlink(serverFilePath, error => {
            if(error){
                debugBucket(error);
                return({
                    message: 'Error occured in removing file from temporary storage'
                });
            } else {
                debugBucket('file in temporary storage has been deleted')
            }
        })

        return downloadURL;

        // save the download link to firestore
    }
}