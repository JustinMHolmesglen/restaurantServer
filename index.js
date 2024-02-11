const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
// const express = require('express');
// const helmet = require('helmet');
// const fileUpload = require('express-fileupload');
// const cors = require('cors');
// const morgan = require('morgan');
// const debugStartup = require('debug')('app:startup');

// const ApiError = require('./src/utils/ApiError');
// const apiErrorHandler = require('./src/middleware/apiErrorHandler');

//Helpers
const glob = require('glob');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

require('dotenv').config();
const config = require('config')
const { connect } = require('./helpers/connection');
const appEnv = config.get('appEnv');

const appPrivateKey = config.get('appPrivateKey');
const dbConnectionString = config.get('db.connectionString');

// const app = express();
// EXPRESS MIDDLEWARE:
// HTTP Header setter and security & CORS
// app.use(cors({ origin : '*' }))
// app.use(helmet());
// app.use(cors(corsOptions))
// debugStartup('Parsing Cors and Helmet')

// (b) Cycle our requests through morgan to track our queries
// app.use(morgan('dev'));
// debugStartup('Starting Morgan')
// app.use(apiErrorHandler)


if(!appPrivateKey && !dbConnectionString){
    console.error('App private key and DB connection string are required');
    debugStartup('App initialisation failed')
    process.exit(1);
}

const resolvers = glob.sync('graphql/*-resolver.js')
const types = glob.sync('graphql/*-type.js')

const registerResolvers = resolvers.map((resolver)=> require(`./${resolver}`));
const registerTypes = types.map((type)=> require(`./${type}`));

const typeDefsMerged = mergeTypeDefs(registerTypes);
const resolversMerged = mergeResolvers(registerResolvers);

async function startServer(){
    const server = new ApolloServer({
        typeDefs: typeDefsMerged,
        resolvers: resolversMerged,
        introspection: true,
        formatError: (err) => {
            const {message, extensions} = err;
            if(appEnv !== "development"){
                delete err.extensions.exception;
                delete err.extensions.stacktrace;
                debugStartup('error in app environment')
            }
            return { message, extensions};
        }
    })
    
    const databaseName = 'crispy-eats'
    connect(`${dbConnectionString}${databaseName}`)
    const { url } = await startStandaloneServer(server, {listen: {port:4000}})
    console.log(`🚀 Server ready at ${url}`)
}

startServer();