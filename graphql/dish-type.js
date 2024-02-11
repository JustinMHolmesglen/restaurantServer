const gql = require('graphql-tag')

const dishType = gql `
    type DishType {
        _id: ID
        dish: String
        description: String
        spice: Int
        category: ID
    }
    input DishInput{
        dish: String
        description: String
        spice: Int
        category: ID
    }
    type Query {
        dish(id: ID): DishType
        dishes: [DishType]
        searchDishes(dish:String): [DishType]
    }
    type Mutation{
        addDish(input: DishInput): DishType
        editDish(id: ID!, input: DishInput): DishType
        deleteDish(id: ID!): DishType
        
    }
    `
    module.exports = dishType;