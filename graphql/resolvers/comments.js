let { UserInputError, AuthenticationError } = require('apollo-server')

let Post = require('../../models/Post.js')
let checkAuth = require('../../util/check-auth')

module.exports = {
    Mutation: {
        createComment: async (_, {postID, body}, context ) => {
            let {username} = checkAuth(context)            
           
            if (body.trim() === '') {
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: 'Comment body must not be empty',
                    }
                })
            } 

            let post = await Post.findById(postID)

            if (post) {
                post.comments.unshift({
                    body, 
                    username,
                    createdAt: new Date().toISOString()
                })

                await post.save()
                return post 

            } else throw new UserInputError('Post not found')
          
        },


        deleteComment: async (_, {postID, commentID}, context) => {
            let {username:  _u_} = checkAuth(context)    

            let post = await Post.findById(postID)

            if (post) {
                let commentIndex = post.comments.findIndex(c => c.id === commentID)

                if (post.comments[commentIndex].username === _u_) {
                    post.comments.splice(commentIndex, 1)
                    
                    await post.save()
                    return post

                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw new UserInputError('Post not found')
            }

        }
       
    }
}