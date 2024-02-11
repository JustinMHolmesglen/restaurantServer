const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

const dishSchema = new mongoose.Schema({
    dish: { type: String, required: true },
    description: { type: String, required: true },
    spice: { type: Number, required: true },
    category: { type: mongoose.Schema.ObjectId, ref: "category", required: true}
})
module.exports = mongoose.model('Dish', dishSchema);