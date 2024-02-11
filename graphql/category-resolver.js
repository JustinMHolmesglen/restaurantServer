const { model } = require('mongoose');
const CategoryModel = require('../models/category');
const DishModel = require('../models/dish')
const Joi = require('joi');
const { isAuthenticated, isAuthorized } = require('../helpers/auth');

const categoryResolver = {
    
    Query: {
        category: async (parent, args) => {
            const category = await CategoryModel.findById(args.id);
            if(!category) throw new Error('Category not found');
            return category;
        },
        categories: async (parent, args) => {
            const categories = await CategoryModel.find();
            if(!categories.length) throw new Error('no categories found');
            return categories;
        }
        
    },
    Mutation: {
        addCategory: async (parent, args) => {
            try{
                const schema = Joi.object({
                    name: Joi.string().required(),
                    
                })
                const { error } = schema.validate(args.input)
                if(error){
                    throw new Error(error.details[0].message);
                }
                const category = new CategoryModel(args.input);
                await category.save();
                return category;
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = categoryResolver;