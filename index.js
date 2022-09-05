const { ApolloServer, PubSub } = require('apollo-server')


let mongoose = require('mongoose')
let dotenv = require('dotenv') 

// let { MONGODB } = require('./config.js')

let typeDefs = require('./graphql/typeDefs')
let resolvers = require('./graphql/resolvers')

dotenv.config()


const pubsub = new PubSub()

let server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({ req, pubsub }),
})

let PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB, {useNewUrlParser: true}).then(() => {    
    console.table({        
        "Message": "Connected to Atlas Cloud Shared Server",
        "ServerApp": "Apollo Server & GraphQL",
        "ServerPort": PORT,
        "ProjectName": "Test MERNG Stack - Jefri Tambunan"
    })    
    return server.listen({port: PORT})

}).catch(err => {
    console.log(
        "It has been gone wrong, " + 
        err.message
    )
})

