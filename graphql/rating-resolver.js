const { RatingEntry, validateRatingEntry } = require('../models/rating');
const { User } = require('../models/user');
const { GraphQLError } = require('graphql');
const { isAuthenticated, isAuthorized } = require('../helpers/auth')

const ratingEntryResolver = {
    Query: {
        ratingEntries: async (parent, args, context) => {
            try {
                isAuthenticated(context)
                return await RatingEntry.find({ user: context.user._id })
            } catch (error) {
                throw new GraphQLError(error, {
                    extensions: {
                        code: 'GET_RATING_ENTRIES_ERROR',
                    },
                });
            }
        }
    },
    Mutation: {
        createRatingEntry: async (parent, args, context) => {
            console.log(context);
            try {

                isAuthenticated(context)
                console.log(args);
                const { error, value } = validateRatingEntry(args.input)
                if (error) {
                    throw new Error(`Invalid Rating input ${error}`)
                }
                const ratingEntry = new RatingEntry({
                    title: args.input.title,
                    body: args.input.body,
                    mood: args.input.mood,
                    user: context.user._id
                })
                await ratingEntry.save()
                return ratingEntry
            } catch (error) {
                throw new GraphQLError(error, {
                    extensions: {
                        code: 'CREATE_RATING_ERROR',
                    },
                });
            }
        },
        deleteRatingEntry: async (parent, args, context) => {
            try {
                isAuthenticated(context)
                const rating = await Rating.findById(args.id)
                if (!rating) {
                    throw new Error("Rating not found")
                }
                isAuthorized(rating, context)
                const deleteRating = await Rating.findByIdAndDelete(args.id)
                return deleteRating
            } catch (error) {
                throw new GraphQLError(error, {
                    extensions: { code: "DELETE_RATING_ERROR" },
                });
            }
        },
        updateRatingEntry: async (parent, args, context) => {
            try {
                isAuthenticated(context)
                const rating = await Rating.findById(args.id)
                if (!rating) {
                    throw new Error("Rating not updated")
                }
                isAuthorized(rating, context)
                const { error, value } = validateUser(args.input)
                if (error) {
                    throw new Error(`Invalid Rating: ${error}`)
                }
                const updateRating = await Rating.findByIdAndUpdate(args.id, args.input)
                return updateRating
            } catch (error) {
                throw new GraphQLError(`Invalid input data: ${error.message}`, { extensions: { code: 'UPDATE_RATING_ERROR' } })
            }
        },
    }
}

module.exports = ratingEntryResolver