let gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: ID! 
        body: String!
        createdAt: String! 
        username: String! 
        comments: [Comment]! 
        likes: [Like]!
        commentCount: Int! 
        likeCount: Int! 
    }

    type Comment {
        id: ID!
        createdAt: String!
        username: String
        body: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query { 
        getPosts: [Post],
        getPost(postID: ID!): Post,
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postID: ID!): String!
        createComment(postID: String!, body: String!): Post!
        deleteComment(postID: ID!, commentID: ID!): Post!
        likePost(postID: ID!): Post!
    }

    type Subscription {
        newPost: Post!
    }
` 