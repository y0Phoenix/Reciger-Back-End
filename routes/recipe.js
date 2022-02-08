const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

// @POST create recipe
router.post('/', auth, [
    check('name', 'Name Is Required').not().isEmpty(),
    check('ingredients', 'Ingredients Are Required').isArray().not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), error: true });
    }

    let {name, ingredients, price = '$0.00'} = req.body;

    ingredients.forEach(ing => {
        
    });

    const user = req.user.id;

    let recipe = await Recipe.findOne({name: name, user: user});

    if (recipe) {
        recipe = await Recipe.findOneAndUpdate({name: name, user: user}, {$set: {name, ingredients, price}}, {new: true});
        const recipes = await Recipe.find({ user: user });
        if (!recipes[0]) {
            return res.status(400).json({ msg: 'Recipe Updated But Recipes Not Found', error: true });
        }
        return res.json({recipes: recipes, error: false});
    }

    recipe = new Recipe({
        name,
        ingredients,
        price,
        user
    });
    await recipe.save();

    res.json({ msg: `Recipe ${name} Create Successfully`, error: false })
});

// @GET get all recipes for current user
router.get('/', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const recipes = await Recipe.find({user: id});
    
        if (!recipes[0]) {
            return res.status(400).json({errors: [{msg: 'No Recipes Found For You'}], error: true});
        }

        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error R1', error: true});
    }
})

module.exports = router;