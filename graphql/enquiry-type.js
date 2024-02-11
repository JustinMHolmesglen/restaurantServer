const gql = require('graphql-tag')

const enquiryType = gql `
    type EnquiryType {
        _id: ID
        message: String
        
    }
    input EnquiryInput{
        message: String
        
    }
    type Query {
        enquiry(id: ID): EnquiryType
        enquiries: [EnquiryType]
    }
    type Mutation{
        addEnquiry(input: EnquiryInput): EnquiryType
    }
    `
    module.exports = enquiryType;