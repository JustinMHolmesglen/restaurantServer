const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, minlength: 3, maxlength: 255, validate: {
        validator: function (v) {
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: 'Invalid email address'
    },
},
password: {type: String, required: true, minLength: 6, maxlength: 1024, },
}, { timestamps: true })

userSchema.pre('save', async function() {
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
    } 
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, username: this.username, email: this.email }, config.get('appPrivateKey'));
    return token;
    
}


const User = mongoose.model('User', userSchema)

function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),

        email: Joi.string().email().min(3).max(255).required(),

        password: Joi.string().min(6).max(1024).required(),

    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;