let { AuthenticationError, UserInputError } = require('apollo-server')

let Post = require('../../models/Post.js')
let checkAuth = require('../../util/check-auth')

module.exports = {
    Query : { 
        getPosts: async() => {        
            try {
                let posts =  await Post.find().sort({createdAt: -1})
                return posts

            } catch(err) {
                throw new Error(err)
            }
        },

        getPost: async(_, {postID}) => {
            try {
                let post =  await Post.findById(postID)         
                
                if (post) return post
                else throw new Error('Post not found')

            } catch(err) {
                throw new Error(err)
            }
        },

    },

    Mutation: {
        createPost: async(_, {body}, context) => {
            let user = checkAuth(context)
          
            if (body.trim() === '') {
                throw new Error('Post body must not be empty')
            }

            let newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                email: user.email,
                createdAt: new Date().toISOString()
            })
            
            let post = await newPost.save()

            // share post to pubsub
            context.pubsub.publish('NEW_POST', {
                newPost: post,
            })

            return post
        },
        
        deletePost: async(_, {postID}, context) => {
            let user = checkAuth(context)

            try {
                let post = await Post.findById(postID)
                
                if (user.username === post.username) {
                    await post.delete()
                    return "Post has deleted successfully"
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch(err) {
                throw new Error(err)
            }

        },

        likePost: async (_, {postID}, context) => {
            let {username: _u_} = checkAuth(context)

            try {
                let post = await Post.findById(postID)

                if (post) {
                    if (post.likes.find(like => like.username === _u_)) {
                        post.likes = post.likes.filter(like => like.username !== _u_)                        
                    } else {
                        post.likes.push({ 
                            username: _u_,
                            createdAt: new Date().toISOString(),
                        })
                    }

                    await post.save()
                    return post

                } else {
                    throw new UserInputError('Post not found')
                }


            } catch(err) {

            }
        }

    },

    Subscription: {
        newPost: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_POST') 
        }
    }
}