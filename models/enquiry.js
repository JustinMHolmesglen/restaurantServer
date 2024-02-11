const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const enquirySchema = new Schema({
    
    
    
    message: String
    
})
module.exports = mongoose.model('Enquiry', enquirySchema);