const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @POST authenicate user
router.post('/', [
    check('email', 'Email Is Required').isEmail(),
    check('password', 'Password Is Required').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({errors: [{msg: 'Invalid Credentials'}]});
        }
        const bool = bc.compare(password, user.password);

        if (!bool) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600000}, (err, token) => {
            if (err) throw err;
            res.json({token});
        });

        console.log(req.body);
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: 'Server Error'});
    }
});

module.exports = router;