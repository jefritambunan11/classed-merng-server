let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
let dotenv = require('dotenv') 
let { UserInputError } = require('apollo-server')

let User = require('../../models/User.js')
let {validateRegisterInput, validateLoginInput} = require('../../util/validator')
dotenv.config()


let generateToken = (_user_) => {
    let _convert_to_token_ = {
        id: _user_.id,
        email: _user_.email,
        username: _user_.username,
    }
    let _jwt_config_ = { expiresIn: '1h' }
    let token = jwt.sign(_convert_to_token_, process.env.SECRET_KEY, _jwt_config_)
    return token
}

module.exports = { 
    Mutation : { 
        async register(
            _, 
            {
                registerInput: {
                    username, 
                    email, 
                    password, 
                    confirmPassword,
                }
            },              
            context, 
            info
        ) {

            let user = await User.findOne({username})

            if (user) {
                throw new UserInputError('Username is taken', {})
            }

            let {valid, errors} = validateRegisterInput(username, email, password, confirmPassword)

            if (!valid) {
                throw new UserInputError("Errors", {errors})
            }

            password = await bcrypt.hash(password, 12)

            let newUser = new User({
                email, 
                username, 
                password,
                createdAt: new Date().toISOString()
            })

            let res = await newUser.save()
          
            let token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        async login(
            _, 
            {
                username,                     
                password,
            }            
        ) {

            let {valid, errors} = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError("Errors", {errors})
            }

            let user = await User.findOne({username})
            if (!user) {
                errors.general = 'User not found' 
                throw new UserInputError('User not found', {errors})
            }       
            
            let match = bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong Credentials' 
                throw new UserInputError('Wrong Credentials', {errors})                
            }


            let token = generateToken(user)


            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        
    }
} 