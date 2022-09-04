module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword,
) => {
    let errors = {}

    if (username.trim() === '') {
        errors.username = 'Username must not be empty'        
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty'        
    } else {
        let regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z[-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
        
        if (!email.match(regex)) {
            errors.email = 'Email must be valid email address' 
        }
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty'        
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Confirm Password is not match' 
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1  // boolean
    }    
}

module.exports.validateLoginInput = (
    username,
    password
) => {
    let errors = {}

    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }

    if (password.trim() === '') {
        errors.password = 'Password must not be empty'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1  // boolean
    }
}