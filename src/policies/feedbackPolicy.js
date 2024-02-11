// Import Joi Validation module
const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const debugJoi = require('debug')('app:joi');

module.exports = {
  // [1] POST Validation
  validateFeedback(req, res, next){
    debugJoi(req.body);
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      message: Joi.string().required(),
    });
    
    // Return one of two values
    const { error, value } = schema.validate(req.body);

    // ON VALIDATION ERROR: We call Error Middleware & Pass Bad Request with Dynamic Validation Error Message
    if ( error ) {
      debugJoi(error);
      switch(error.details[0].context.key){
        case 'username':
          next(ApiError.badRequest('You must provide a valid name'))
          break

        case 'phone':
          next(ApiError.badRequest('You must provide a valid phone number'))
          break    

        case 'email':
          next(ApiError.badRequest('You must provide a valid email'))
          break

        
        case 'message':
          next(ApiError.badRequest('You must provide a message'))
          break   

        
        default: 
          next(ApiError.badRequest('Invalid Form Information - please check form information and submit again'))
      }

    // ON SUCCSSS: We pass to next middleware
    
   } else {
    next();
   }
  }
}