const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, auth denied' });

    }
    // verify token

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(500).json({msg: 'User Not Fount At Auth Middleware', error: true});
        }
        req.user = user;
        next();
    }
    catch(err) {
        res.status(401).json({ msg: 'Token Is Not Valid' });
    }
}