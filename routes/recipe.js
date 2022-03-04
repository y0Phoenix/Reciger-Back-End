const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const updateRecipePrice = require('../functions/updateRecipePrice');
const updateRecipeNutrients = require('../functions/updateRecipeNutrients');

const Recipe = require('../models/Recipe');
const updateIngredientIng = require('../functions/updateIngredientIng');
const updatUserCategories = require('../functions/updateUserCategories');
const updateRIT = require('../functions/updateRIT');
const updateUserRecents = require('../functions/updateUserRecents');

// @POST create recipe
router.post('/', auth, [
    check('name', 'Name Is Required').not().isEmpty(),
    check('ingredients', 'Ingredients Are Required').isArray().not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    const update = JSON.parse(req.query.update);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msgs: errors.array(), error: true });
    }
    try {
        let {name = '', ingredients = [], categories = [], yield = {}, instructions = ''} = req.body;

        var price = await updateRecipePrice(ingredients, req.user.preferences.money);
        ingredients = await updateIngredientIng(ingredients);
        ingredients = await updateRIT(ingredients);
        const {calories, nutrients} = await updateRecipeNutrients(ingredients);

        const user = req.user.id;

        let recipe = await Recipe.findOne({name: name, user: user});

        if (recipe) {
            if (!update) {
                return res.status(400).json({msgs: [{msg: `Recipe ${name} Already Exists Would You Like To Update, Delete Or Change Name`}]});
            }
            recipe = await Recipe.findOneAndUpdate({name: name, user: user}, {$set: {name, ingredients, price, categories, yield, calories, nutrients, instructions}}, {new: true});
            await updateUserRecents(req.user, 'recipes', recipe);
            const recipes = await Recipe.find({ user: user }).select({ingredients: 0, nutrients: 0, calories: 0, yield: 0, instructions: 0, __v: 0});
            return res.json({msgs: [{msg: `Recipe ${recipe.name} Updated Successfully`}], data: recipes, error: false});
        }

        recipe = new Recipe({
            name,
            ingredients,
            price,
            user,
            categories,
            yield,
            calories,
            nutrients,
            instructions
        });
        await updatUserCategories(categories, req.user, 'recipe');
        await updateUserRecents(req.user, 'recipes', recipe);
        await recipe.save();
        const recipes = await Recipe.find({user: req.user.id}).select({ingredients: 0, nutrients: 0, calories: 0, yield: 0, instructions: 0, __v: 0});

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
        const all = JSON.parse(req.query.all);
        var recipes;
        if (all) {
            recipes = await Recipe.find({user: id});
        }
        else {
            recipes = await Recipe.find({user: id}).select({ingredients: 0, nutrients: 0, calories: 0, yield: 0, instructions: 0, __v: 0});
        }
    
        if (!recipes[0]) {
            return res.status(404).json({msgs: [{msg: 'No Recipes Found For You'}], error: true});
        }

        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error R1', error: true});
    }
});

// @DELETE delete a recipe
router.delete('/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({msgs: errors.array(), error: true});
    }
    const id = req.params.id;
    try {
        let recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(400).json({msgs: [{msg: 'Recipe Not Found Try Again Later'}], error: true});
        }
        await Recipe.findByIdAndDelete(id);
        const recipes = await Recipe.find({user: req.user.id}).select({ingredients: 0, nutrients: 0, calories: 0, yield: 0, instructions: 0, __v: 0});
        res.json({msgs: [{msg: `Recipe ${recipe.name} Deleted Successfully`}], error: false, data: recipes});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error R4', error: true});
    }
});

// @GET one recipe by id
router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({msgs: [{msg: 'recipe Not Found Try Again Later'}], error: true});
        }
        return res.json({msgs: [{msg: `${recipe.name} Found`}], error: false, data: recipe});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msgs: [{msg: 'Server Error R5'}], error: true});
    }
});

module.exports = router;