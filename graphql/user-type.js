const gql = require('graphql-tag')

const userType = gql `
    type Query{
        getUser(id: ID!): User
        getUsers: [User]
        

    }
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String!
        token: String
    }
    input CreateUserInput {
        username: String!
        email: String!
        password: String!
    }

    input UpdateUserInput {
        username: String
        email: String
        password: String
    }

    input LoginInput {
        email: String!
        password: String!
    }    
    type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): User
        loginUser(input: LoginInput!): User
    }
`;

module.exports = userType;