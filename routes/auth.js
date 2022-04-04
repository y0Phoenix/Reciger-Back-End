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
        res.status(500).json({msg: 'Server Error U1', error: true});
    }
});

router.get('/get/:token', async (req, res) => {
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
router.get('/passwordreq', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({isAuthenticated: false, msgs: [{msg: 'Error Try Again Later'}], error: true});
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({isAuthenticated: false, msgs: [{msg: `No User Associated With ${email}`}], error: true});
        const payload = {
            type: "changepassword",
            user: user.id
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
                text: `Please Don't Reply To This Email\n\nClick here to change your password\nhttp://localhost:3000/password/${token}`,

            });
            res.json({isAuthenticated: true, error: false});
        });
    } catch (err) {
        return res.status(500).json({msgs: [{msg: 'Server Error U6'}], error: true});
    }
});

// @post finish password change process
router.post('/changepassword/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const { newPass } = req.body;
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        const user = await User.findById(decoded.user);
        if (user.changepass !== token) return res.status(403).json({msgs: [{msg: 'User Not Authorized'}], error: true});

        const salt = await bc.genSalt(10);
        user.password = await bc.hash(newPass, salt);
        user.changepass = '';
        await user.save();

        res.json({msgs: [{msg: 'Password Changed Successfully'}], error: false});
    } catch (err) {
        res.status(500).json({msgs: [{msg: 'Server Error U7'}], error: true});
    }
});

// @post initiate email verification
router.post('/email', async (req, res) => {
    try {
        const {email, original} = req.body;
        const get = original ? original : email;
        const user = await User.findOne({email: get});
        if (!user) return res.status(403).json({msgs: [{msg: 'No User Associated With Email'}], error: true});
        user.verify.email.value = email;
        const payload = {
            email: email,
            user: user.id
        };
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '1h'}, async (err, token) => {
            if (err) throw err;
            user.verify.email.token = token;
            user.verify.email.bool = false;
            await user.save();
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
                subject: 'Verify Email',
                text: `Please Don't Reply To This Email\n\nClick here to verify your email\nhttp://localhost:3000/verifyemail/${token}`,
            });
            res.json({msgs: [{msg: 'Check Your Email For The Verification Link'}], isAuthenticated: true, error: false});
        });

    } catch (err) {
        res.status(500).json({msgs: [{msg: 'Server Error U8'}], error: true});
    }
});

// @get finish email verification
router.get('/email/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        const user = await User.findById(decoded.user);
        if (!user) return res.status(403).json({msgs: [{msg: 'Token Is Invalid Not Authorized.\nTry Resending Email Verification'}], error: true});
        if (token !== user.verify.email.token) return res.status(403).json({msgs: [{msg: 'Token Is Invalid Not Authorized.\nTry Resending Email Verification'}], error: true});
        user.email = decoded.email;
        user.verify.email.bool = true;
        user.verify.email.value = '';
        user.verify.email.token = '';
        await user.save();
        res.json({msgs: [{msg: 'Email Verified Successfully You May Close This Page'}], error: false});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msgs: [{msg: 'Server Error U9'}], error: true});
    }
});

module.exports = router;