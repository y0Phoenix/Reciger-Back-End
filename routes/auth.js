const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

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
    const remember = req.query.remember && JSON.parse(req.query.remember);
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({msgs: [{msg: 'Invalid Credentials', error: true}]});
        }
        const bool = await bc.compare(password, user.password);

        if (!bool) {
            return res.status(401).json({msgs: [{msg: 'Invalid Credentials', error: true}]});
        }
        const payload = {
            user: {
                id: user.id
            },
            type: "user"
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: remember ? '60d' : '1d'}, async (err, token) => {
            if (err) throw err;
            const _user = await User.findById(user.id).select({password: 0});
            res.json({token: token, data: _user,  isAuthenticated: true, error: false});
        });

        console.log(req.body);
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: 'Server Error U1', error: true});
    }
});

router.get('/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, config.get('jwtSecret'));
        const user = await User.findById(decoded.user.id).select({password: 0});
        if (!user) {
            return res.status(401).json({msg: 'User Unathorized', error: true});
        }
        return res.json({data: user, isAuthenticated: true, error: false, token: req.params.token});
    } catch (err) {
        return res.status(500).json({isAuthenticated: false, error: true});
    }
});

// @get initiate password change request process
router.get('/passwordreq/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const email = req.query.email;
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        const user = await User.findById(decoded.user.id);
        if (!user) return res.status(404).json({isAuthenticated: false, msgs: [{msg: 'User Not Authenticated'}], error: true});
        const payload = {
            type: "changepassword",
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '1h'}, async (err, token) => {
            if (err) throw err;
            await User.findOneAndUpdate({user: user.id}, {$set: {changepass: token}});
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: false,
                service: 'Gmail',
                auth: {
                    user: config.get('nodemailerEmail'),
                    pass: config.get('nodemailerPass'),
                }, 
            });
            await transporter.sendMail({
                from: config.get('nodemailerEmail'),
                to: email,
                subject: 'Password Change',
                text: `Please Don't Reply To This Email\n
                Click here to change your password\n 
                http://localhost:3000/password/${token}`,

            });
            res.json({isAuthenticated: true, error: false});
        });
    } catch (err) {
        return res.status(500).json({msgs: [{msg: 'Server Error U6'}], error: true});
    }
});

// @post finish password change process
router.post('/changepassword/:token', auth, async (req, res) => {
    try {
        const token = req.params.token;
        const { newPass, oldPass } = req.body;
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        const bool = await bc.compare(oldPass, req.user.password);

        if (decoded.user.id !== req.user.id || req.user.changepass !== token || !bool) return res.status(403).json({msgs: [{msg: 'User Not Authorized'}], error: true});

        const salt = await bc.genSalt(10);
        req.user.password = await bc.hash(newPass, salt);
        req.user.changepass = '';
        await req.user.save();

        res.json({msgs: [{msg: 'Password Changed Successfully'}], error: false});
    } catch (err) {
        res.status(500).json({msgs: [{msg: 'Server Error U7'}], error: true});
    }
})

module.exports = router;