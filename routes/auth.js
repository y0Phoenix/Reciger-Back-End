const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
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
        return res.status(400).json({errors: errors.array(), error: true});
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({errors: [{msg: 'Invalid Credentials', error: true}]});
        }
        const bool = bc.compare(password, user.password);

        if (!bool) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials', error: true}]});
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600000}, (err, token) => {
            if (err) throw err;
            res.json({token: token, error: false});
        });

        console.log(req.body);
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: 'Server Error U1', error: true});
    }
});

module.exports = router;