require('dotenv').config();
let jwt = require('jsonwebtoken');

let GenerateToken = (user)   => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

module.exports = GenerateToken