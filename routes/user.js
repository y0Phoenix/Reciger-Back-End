const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @post new user
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'A Valid Email is Required').isEmail(),
    check('password', 'Please Enter A Password With 6 Or More Characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({errors: [{msg: 'User Already Exists'}]});
        }
        else {
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                    name,
                    email, 
                    password, 
                    avatar
            });

            const salt = await bc.genSalt(10);

            user.password = await bc.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600000},
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

            console.log(req.body);
        }
    } catch (err) {
        
    }
});

module.exports = router;