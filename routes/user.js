const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

// @post new user
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'A Valid Email is Required').isEmail(),
    check('password', 'Please Enter A Password With 6 Or More Characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msgs: errors.array(), error: true });
    }

    const {name, email, password, preferences = null} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msgs: [{msg: 'User Already Exists', error: true}]});
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
                    preferences,
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
                res.json({ token: token, error: false });
            });

            console.log(req.body);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error U4', error: true})
    }
});

// @POST update user
router.post('/update', auth, async (req, res) => {
    try {
        let {name = null, preferences = null, password = null, email = null, categories = null} = req.body;
        const id = req.user.id;
        let user = await User.findById(id);
    
        if (!user) {
            return res.status(400).json({ msgs: [{msg: 'No User Found'}], error: true});
        }
        if (email) {
            const user = await User.findOne({email});
            if (user) {
                return res.status(400).json({msgs: [{msg: 'Email Already Exists On Another User'}], error: true});
            }
        }
        let fields = {
            name: name ? name : user.name,
            preferences: preferences ? preferences : user.preferences,
            password: password ? await bc.hash(password, await bc.genSalt(10)) : user.password,
            email: email ? email : user.email,
            avatar: user.avatar,
            categories: categories ? categories : user.categories
        };
        console.log(fields);
        user = await User.findOneAndUpdate({user: id}, {$set: fields}, {new: true});
        if (!user) {
            return res.status(400).json({msg: 'User Not Updated U3', error: true});
        }
        res.json({msgs: [{msg: 'User Updated Successfully'}], error: false})
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error U2', error: true});
    }
});

// @DELETE delete user
router.delete('/', auth, async (req, res) => {
    const {id} = req.user;
    try {
        let user = await User.findById(id);
        if (!user) {
            res.status(400).json({msgs: [{msg: 'User Not Found Try Again Later'}], error: true});
        }
        let recipes = await Recipe.find({user: id});
        if (recipes[0]) {
            for (let i = 0; i < recipes.length; i++) {
                const ID = recipes[i].id
                await Recipe.findByIdAndDelete(ID);
                const recipe = await Recipe.findById(ID);
                if (recipe) {
                    return res.status(400).json({msgs: [{msg: 'There Was A Problem While Deleting Your User Try Again Later'}], error: true});
                }
            }
        }
        let ingredients = await Ingredient.find({user: id});
        if (ingredients[0]) {
            for (let i = 0; i < ingredients.length; i++) {
                const ID = ingredients[i].id
                await Ingredient.findByIdAndDelete(ID);
                const ingredient = await Ingredient.findById(ID);
                if (ingredient) {
                    return res.status(400).json({msgs: [{msg: 'There Was A Problem While Deleting Your User Try Again Later'}], error: true});
                }
            }
        }
        res.json({msgs: [{msg: 'User Deleted Successfully Now Redirecting To The Home Page'}], error: false})
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error U5', error: true});
    }
})


module.exports = router;