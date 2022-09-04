let { model, Schema } = require('mongoose')

let _config_ = {
    body: String,
    username: String,    
    createdAt: String,
    comments : [
        {
            body: String, 
            username: String,
            createdAt: String,
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users',
        }
    ]
}

let postSchema = new Schema(_config_)
module.exports = model('Post', postSchema)