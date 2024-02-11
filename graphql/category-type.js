const gql = require('graphql-tag')

const categoryType = gql `
    type CategoryType {
        _id: ID
        name: String
        
    }
    input CategoryInput{
        name: String
        
    }
    type Query {
        category(id: ID): CategoryType
        categories: [CategoryType]
    }
    type Mutation{
        addCategory(input: CategoryInput): CategoryType
    }
    `
    module.exports = categoryType;