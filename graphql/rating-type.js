const gql = require('graphql-tag');

const ratingEntryType = gql`
    type RatingEntry {
        id: ID!
        title: String!
        body: String!
        mood: Int!
        user: ID!
        createdAt: String!
        updatedAt: String!
    },
    input RatingEntryInput {
        title: String!
        body: String!
        mood: Int!
        user: ID!
    }
    type Query {
        getRatingEntry(id: ID!): RatingEntry,
        ratingEntries: [RatingEntry]
    }
    type Mutation {
        createRatingEntry(input: RatingEntryInput!): RatingEntry
        deleteRatingEntry(id: ID!): User
        updateRatingEntry(id: ID!, input: RatingEntryInput!): User
    }
`

module.exports = ratingEntryType;