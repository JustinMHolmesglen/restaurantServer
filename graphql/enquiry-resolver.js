const { model } = require('mongoose');
const EnquiryModel = require('../models/enquiry');

const Joi = require('joi');
const { isAuthenticated, isAuthorized } = require('../helpers/auth');

const enquiryResolver = {
    
    Query: {
        enquiry: async (parent, args) => {
            const enquiry = await EnquiryModel.findById(args.id);
            if(!enquiry) throw new Error('Enquiry not found');
            return enquiry;
        },
                
    },
    Mutation: {
        addEnquiry: async (parent, args) => {
            try{
                const schema = Joi.object({
                    message: Joi.string().min(5).max(1024).required()
                    
                })
                const { error } = schema.validate(args.input)
                if(error){
                    throw new Error(error.details[0].message);
                }
                const enquiry = new EnquiryModel(args.input);
                await enquiry.save();
                return enquiry;
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = enquiryResolver;