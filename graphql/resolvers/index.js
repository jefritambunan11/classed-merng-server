let postsResolvers = require('./posts')
let usersResolvers = require('./users')
let commentsResolvers = require('./comments')

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        
        commentCount: (parent) => parent.comments.length
    },

    Query: {
        ...postsResolvers.Query,
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    
    Subscription: {
        ...postsResolvers.Subscription,
    }
}