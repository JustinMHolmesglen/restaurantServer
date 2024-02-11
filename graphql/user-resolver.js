const { GraphQLError } = require('graphql')
const { User, validateUser } = require("../models/user");
const Joi = require("joi");
const _ = require('lodash');
const { isAuthenticated, isAuthorized } = require('../helpers/auth');


const resolvers = {
    Query: {
        getUser: async (parent, args, context) => {

            try {

                isAuthenticated(context)
                const user = await User.findById(args.id)
                if (!user) {
                    throw new Error('User not found')
                }
                isAuthorized(user, context)
                return user
            } catch (error) {
                throw new GraphQLError(error, {
                    extensions: {
                        code: 'GET_USER_ERROR',
                    },
                });
            }
        },
        getUsers: async () => {
            try {
                // Find all users in the database
                const users = await User.find();
                return users;
            } catch (error) {
                // If there was an error, throw an ApolloError with a custom error code
                throw new GraphQLError(error, {
                    extensions: {
                        code: 'GET_USERS_ERROR',
                    },
                });
            }
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            try {
                console.log("args");
                console.log(args.input);
                const { error, value } = validateUser(args.input)
                if (error) {
                    throw new GraphQLError(`Invalid input data: ${error.message}`, { extensions: { code: 'BAD_USER_INPUT' } })
                }
                const user = new User(value)
                await user.save();

                const token = user.generateAuthToken()
                let userData = _.pick(user, ['id', 'username', 'email', 'createdAt'])
                userData.token = token
                return userData

            } catch (error) {
                throw new GraphQLError(`Failed to create User data: ${error.message}`, { extensions: { code: 'CREATE_USER_ERROR' } })
            }
        },
        deleteUser: async (parent, args, context) => {

            try {
                isAuthenticated(context)
                const user = await User.findById(args.id)
                if (!user) {
                    throw new Error("User not found!")
                }
                isAuthorized(user, context)
                const deletedUser = await User.findByIdAndDelete(args.id)
                return deletedUser
            } catch (error) {
                throw new GraphQLError(error, {
                    extensions: {
                        code: 'DELETE_USER_ERROR',
                    },
                });
            }
        },
        loginUser: async (parent, args) => {
            try {
                const loginSchema = Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                })
                const { error, value } = loginSchema.validate(args.input)
                if (error) {
                    throw new Error(`Invalid User Input ${error}`)
                }

                const user = await User.findOne({ email: value.email })
                if (!user) {
                    throw new Error("Invalid Email or Password")
                }

                const validPassword = await user.comparePassword(value.password, user.password)
                if (!validPassword) {
                    throw new Error("Invalid Email or Password")
                }


                const token = user.generateAuthToken();
                let userData = _.pick(user, ['id', 'username', 'email', 'createdAt'])
                userData.token = token
                return userData

            } catch (error) {
                throw new GraphQLError(error, {
                    extensions: {
                        code: 'LOGIN_USER_ERROR',
                    },
                });
            }
        },

        updateUser: async (parent, args, context) => {
            try {
                isAuthenticated(context)
                const user = await User.findById(args.id)
                if (!user) {
                    throw new Error("User not found!")
                }
                isAuthorized(user, context)
                const { error, value } = validateUser(args.input)
                if (error) {
                    throw new Error(`Invalid input data: ${error}`)
                }
                const updateUser = await User.findByIdAndUpdate(args.id, value, { new: true })
                return updateUser
            } catch (error) {
                throw new GraphQLError(`Invalid input data: ${error.message}`, { extensions: { code: 'UPDATE_USER_ERROR' }, });
            }
        },


    },
};


module.exports = resolvers