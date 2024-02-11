const { model } = require('mongoose');
const DishModel = require('../models/dish');
const CategoryModel = require('../models/category')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const { isAuthenticated, isAuthorized } = require('../helpers/auth');

const dishResolver = {
    Query: {
        dish: async (parent, args) => {
            const dish = await DishModel.findById(args.id);
            if(!dish) throw new Error('Dish not available today, sorry');
            return dish;
        },
        dishes: async (parent, args) => {
            const dishes = await DishModel.find();
            if(!dishes.length) throw new Error('no dishes found');
            return dishes;
        },
        searchDishes: async (parent, args) => {
            const result = await DishModel.find({ name: new RegExp('.*' + args.name + '.*', "i")})
            return result;
        }
        
    },
    Mutation: {
        addDish: async (parent, args) => {
            const dish = new DishModel(args.input);
            await dish.save();
            return dish;
        },
        editDish: async (parent, args) => {
            return await DishModel.findByIdAndUpdate(args.id, args.input, { new : true });
        },
        deleteDish: async (parent, args) => {
            return await DishModel.findByIdAndRemove(args.id);
        }
    },
}



module.exports = dishResolver;