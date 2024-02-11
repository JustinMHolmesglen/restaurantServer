const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

//rating works same as category, dont fill top part

const ratingEntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    body: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3000,
    },
    mood: {
        type: Number,
        required: true,
        min: 0,
        max: 4
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const RatingEntry = mongoose.model('RatingEntry', ratingEntrySchema);

function validateRatingEntry(ratingEntry) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        body: Joi.string().min(3).max(3000).required(),
        mood: Joi.number().min(0).max(4).required(),
        user: Joi.objectId().required(),
    });
    return schema.validate(ratingEntry);
}

module.exports.RatingEntry = RatingEntry;
module.exports.validate = validateRatingEntry;