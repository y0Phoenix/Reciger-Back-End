const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const Recipe = require('../models/Recipe');

// @POST create recipe
router.post('/', auth, [
    check('name', 'Name Is Required').not().isEmpty(),
    check('ingredients', 'Ingredients Are Required').isArray().not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let {name, ingredients, price = '$0.00'} = req.body;
    const user = req.user;

    let recipe = await Recipe.find({name: name}, {user: user.id});

    if (recipe) {
        return res.status(400).json({ errors: [{msg: `Recipe ${name} Already Exists`}] });
    }

    recipe = new Recipe({
        name,
        ingredients,
        price,
        user
    });
    await recipe.save();

    res.json({ msg: `Recipe ${name} Create Successfully` })
});

module.exports = router;