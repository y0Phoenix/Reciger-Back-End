const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');

// @POST create ingredient
router.post('/', auth, [
    check('name', 'Ingredient Name Is Required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), error: true});
    }

    const {name, price = '$0.00'} = req.body;
    const user = req.user.id;

    let ingredient = await Ingredient.find({name: name}, {user: user});
    if (ingredient[0]) {
        return res.status(400).json({ errors: [{ msg: 'Ingredient Already Exists' }], error: true });
    }

    ingredient = new Ingredient({
        name,
        price,
        user
    });

    await ingredient.save();

    res.json({ msg: 'Ingredient Created Successfully', error: false });
});

// @GET get all ingrdients for user
router.get('/', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const ingredients = await Ingredient.find({user: id});
    
        if (!ingredients[0]) {
            return res.status(400).json({errors: [{msg: 'No Ingredients Found', error: true}]});
        }
    
        res.json(ingredients);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error I1', error: true});
    }
});

module.exports = router;