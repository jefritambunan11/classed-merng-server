let { model, Schema } = require('mongoose')

let _config_ = {
    username: String,
    password: String,
    email: String,
    createdAt: String,
}

let userSchema = new Schema(_config_)
module.exports = model('User', userSchema)