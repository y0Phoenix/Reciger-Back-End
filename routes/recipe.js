const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const updateRecipePrice = require('../functions/updateRecipePrice');

const Recipe = require('../models/Recipe');

// @POST create recipe
router.post('/', auth, [
    check('name', 'Name Is Required').not().isEmpty(),
    check('ingredients', 'Ingredients Are Required').isArray().not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msgs: errors.array(), error: true });
    }
    try {
        let {name, ingredients, price = 0, categories} = req.body;

        price = await updateRecipePrice(ingredients, req.user.preferences.money);

        const user = req.user.id;

        let recipe = await Recipe.findOne({name: name, user: user});

        if (recipe) {
            recipe = await Recipe.findOneAndUpdate({name: name, user: user}, {$set: {name, ingredients, price, categories}}, {new: true});
            const recipes = await Recipe.find({ user: user });
            return res.json({msgs: [{msg: `Recipe ${recipe.name} Updated Successfully`}], data: recipes, error: false});
        }

        recipe = new Recipe({
            name,
            ingredients,
            price,
            user,
            categories
        });
        await recipe.save();
        const recipes = await Recipe.find({user: req.user.id});

        res.json({ msgs: [{msg: `Recipe ${name} Create Successfully`}], error: false, data: recipes });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error R2', errror: true});
    }
});

// @GET get all recipes for current user
router.get('/', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const recipes = await Recipe.find({user: id});
    
        if (!recipes[0]) {
            return res.status(400).json({msgs: [{msg: 'No Recipes Found For You'}], error: true});
        }

        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error R1', error: true});
    }
});

// @DELETE delete a recipe
router.delete('/', [
    check('id', 'id Is Required To Delete A Recipe').not().isEmpty()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({msgs: errors.array(), error: true});
    }
    const {id} = req.body;
    try {
        let recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(400).json({msgs: [{msg: 'Recipe Not Found Try Again Later'}], error: true});
        }
        await Recipe.findByIdAndDelete(id);
        recipe = await Recipe.findById(id);
        if (recipe) {
            return res.status(400).json({msgs: [{msg: 'Something Went Wrong While Trying To Delete This Recipe Try Again Later'}], error: true});
        }
        const recipes = await Recipe.find({user: req.user.id});
        res.json({msgs: [{msg: 'Recipe Deleted Successfully'}], error: false, data: recipes});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error R4', error: true});
    }
})

module.exports = router;