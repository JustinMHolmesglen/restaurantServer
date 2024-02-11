const mongoose = require('mongoose');

async function connect(connectionString){
    try{
        const connectionResult = await mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

        if (connectionResult) console.log("Connected to MongoDB");
    }catch(error){
        console.error('connection failed', error)
    }
}

module.exports.connect = connect;