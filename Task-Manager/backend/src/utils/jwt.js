const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,     // Must be userId
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    );
};

module.exports = {
    generateToken
};