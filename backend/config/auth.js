const jwt = require('jsonwebtoken');
const secret = 'mdkdfjdhfkjhdsafh8840505312@!$%#^&*';

function setUser(user) {
    // Ensure the user object has a 'role' property
    // You might want to add a default role if user.role is undefined, or handle it as an error
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role // Include the role in the payload
    };
    // It's good practice to add an expiration to tokens
    return jwt.sign(payload, secret, { expiresIn: '12h' });
}


function getUser(token){
    return jwt.verify(token,secret);
}

module.exports = {setUser, getUser};