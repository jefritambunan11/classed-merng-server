let { AuthenticationError } = require('apollo-server')
let jwt = require('jsonwebtoken') 
let dotenv = require('dotenv') 
dotenv.config()

module.exports = (context) => {
    let authorization = context.req.headers.authorization

    if (authorization) {
        let _token_ = authorization.slice(7, authorization.length)

        if (_token_) {
            try {
                let user = jwt.verify(
                    _token_,
                    process.env.SECRET_KEY
                )

                return user

            } catch(err) {
                throw new AuthenticationError('Invalid/Expired Token')
            }
        }

        throw new Error('Authentication token must be \'Bearer [token]\' ')
    }

    throw new Error('Authorization header  must be provided ')
}   