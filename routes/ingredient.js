const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');
const updateRecipePrice = require('../functions/updateRecipePrice');
const updateRecipeNutrients = require('../functions/updateRecipeNutrients');
const updateUserCategories = require('../functions/updateUserCategories');
const updateUserRecents = require('../functions/updateUserRecents');
const NutritionAPI = require('../classes/NutritionAPI');
const checkUnits = require('../functions/checkUnits');

// @POST create ingredient
router.post('/', auth, [
    check('name', 'Ingredient Name Is Required').not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({msgs: errors.array(), error: true});
        }
        const user = req.user;
        const {
            name, 
            price = '$0.00', 
            units = {weight: ['oz'], volume: ['floz'], prefered: user.preferences.measurements[0]}, 
            categories,
        } = req.body;
        const bool = checkUnits(units.prefered);
        if (!bool) {
            return res.status(400).json({msgs: [{mgs: `Invalid Unit of Measurement
            Valid Measurements are g, kg, oz, lb, ml, l, tsp, tbl, cup, quart, gallon, ea`}], error: true});
        }
        const noNut = JSON.parse(req.query.noNut);
        const all = JSON.parse(req.query.all);
        let ingredient = await Ingredient.find({name: name}, {user: user.id});
        if (ingredient[0]) {
            return res.status(400).json({ msgs: [{ msg: 'Ingredient Already Exists' }], error: true });
        }
        
        if (!noNut) {
            const api = new NutritionAPI();
            var {calories, nutrients, error} = await api.foodSearchAndParse(name, units.prefered);
            if (error.status !== 200) {
                return res.status(error.status)
                .json({msgs: [{msg: error.statusText.includes('No Good Matches Found') ? error.statusText : 'Error While Creating Ingredient Try Again Later'}], error: true});
            }
        }
        
        ingredient = new Ingredient({
            name,
            price,
            user,
            units,
            categories,
            calories,
            nutrients
        });
        await updateUserCategories(categories, req.user, 'ingredient');
        await updateUserRecents(req.user, 'ingredients', ingredient);
        await ingredient.save();

        let recipes = await Recipe.find({user: user.id});
        if (recipes[0]) {
            for (let i = 0; i < recipes.length; i++) {
                let recipe = await Recipe.findById(recipes[i].id);
                if (recipe) {
                    recipe.ingredients.forEach((ing, i, arr) => {
                        if (ing.name === ingredient.name) {
                            arr[i].ing = ingredient.id; 
                            arr[i].quantity = ingredient.quantity; 
                            arr[i].categories = ingredient.categories;
                            console.log('poop');
                        }
                    });
                    await recipe.save();
                }
            }
        }

        let ingredients
        if (all) {
            ingredients = await Ingredient.find({user: user.id});
        }
        else {
            ingredients = await Ingredient.find({user: user.id}).select({calories: 0, nutrients: 0, __v: 0});
        }

        res.json({ msgs: [{msg: `Ingredient ${ingredient.name} Created Successfully`}], error: false, data: ingredients});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error I4', error: true});
    }
});

// @POST update ingredient
router.post('/update/:id', auth, async (req, res) => {
    try {
        const {name, price, categories, units} = req.body;
        const id = req.params.id;
        const _bool = checkUnits(units.prefered);
        const all = JSON.parse(req.query.all);
        const noNut = JSON.parse(req.query.noNut);
        if (!_bool) {
            return res.status(400).json({msgs: [{mgs: `Invalid Unit of Measurement
            Valid Measurements are g, kg, oz, lb, ml, l, tsp, tbl, cup, quart, gallon, ea`}], error: true});
        }
        let ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(400).json({msgs: [{msg: 'Ingredient Not Found Try Again Later'}], error: true});
        }
        if (!noNut) {
            const api = new NutritionAPI();
            var {calories, nutrients, error} = await api.foodSearchAndParse(name, units.prefered);
            if (error.status !== 200) {
                return res.status(error.status)
                .json({msgs: [{msg: error.statusText.includes('No Good Matches Found') ? error.statusText : 'Error While Creating Ingredient Try Again Later'}], error: true});
            }
        }
        if (calories || nutrients) {
            ingredient = await Ingredient.findOneAndUpdate({_id: id}, {$set: {name, price, categories, units, nutrients, calories}}, {new: true});
        }
        else {
            ingredient = await Ingredient.findOneAndUpdate({_id: id}, {$set: {name, price, categories, units,}}, {new: true});
        }
        if (!ingredient) {
            return res.status(400).json({msgs: [{msg: 'Ingredient Not Updated I2'}], error: true});
        }
        await updateUserCategories(categories, req.user, 'ingredient');
        let recipes = await Recipe.find({user: req.user.id});
        if (recipes[0]) {
            for (let i = 0; i < recipes.length; i++) {
                let rec = await Recipe.findById(recipes[i].id);
                rec.ingredients.forEach((ing, i, arr) => {
                    if (ing.name === ingredient.name) {
                        ing.name = ingredient.name;
                        ing.price = ingredient.price;
                        ing.categories = ingredient.categories;
                    }
                })
                rec.price = await updateRecipePrice(rec.ingredients, req.user.preferences.money);
                const {calories, nutrients} = await updateRecipeNutrients(rec.ingredients);
                rec.calories = calories.total;
                rec.nutrients = nutrients.total;
                await rec.save();
            };
        }
        await updateUserRecents(req.user, 'ingredients', ingredient);
        const bool = async () => {
            let matches = [];
            for (let i = 0; i < req.user.recents.recipes.length; i++) {
                let bool;
                const recipe = await Recipe.findById(req.user.recents.recipes[i].rec);
                if (recipe) {
                    recipe.ingredients.forEach(ing => {
                        if (ing.name === ingredient.name) return bool = true;
                    });
                }
                if (bool) matches.push(recipe);
            }
            if (matches[0]) return matches;
            return null;
        }
        const matches = await bool();
        if (matches) {
            matches.forEach((async mat => await updateUserRecents(req.user, 'recipes', mat)));
        }
        if (all) {
            ingredient = await Ingredient.find(ingredient.id);
        }
        else {
            ingredient = await Ingredient.findById(ingredient.id).select({calories: 0, nutrients: 0, __v: 0});
        }
        res.json({msgs: [{msg: `Ingredient ${name} Updated Successfully`}], error: false, data: ingredient});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error I3', error: true});
    }
})

// @GET get all ingrdients for user
router.get('/', auth, async (req, res) => {
    try {
        const id = req.user.id;
        const all = JSON.parse(req.query.all);
        const recipe = JSON.parse(req.query.recipe);
        const name = req.query.name;
        if (recipe && name !== 'none') {
            const recipe = await Recipe.findOne({user: id, name: name});
            if (!recipe) {
                return res.status(404).json({msgs: [{msg: 'Correlative Ingredient Not Found'}], error: true})
            }
            return res.json({data: recipe, error: false});
        }
        var ingredients;
        if (all) {
            ingredients = await Ingredient.find({user: id});
        }
        else {
            ingredients = await Ingredient.find({user: id}).select({units: 0, nutrients: 0, __v: 0});
        }
        if (!ingredients[0]) {
            return res.status(400).json({msgs: [{msg: 'No Ingredients Found For You', error: true}]});
        }
    
        res.json({data: ingredients});
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error I1', error: true});
    }
});

// @DELETE delete an ingredient
router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        let ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(400).json({msgs: [{msg: 'Ingredient Not Found'}], error: true});
        }
        await updateUserRecents(req.user, 'ingredients', ingredient, true);
        await Ingredient.findByIdAndRemove(id);
        const recipes = await Recipe.find({user: req.user.id});
        if (recipes) {
            for (let i = 0; i < recipes.length; i++) {
                let recipe = await Recipe.findById(recipes[0].id);
                recipe.ingredients.forEach((ing, i, arr) => {
                    if (ing.id === id) {
                        arr.push({name: ing.name, user: req.user.id,
                            calories: ing.calories, nutrients: ing.nutrients, quantity: ing.quantity});
                        arr.splice(i, 1);
                    }
                });
                await recipe.save();
            }
        }
        const ingredients = await Ingredient.find({user: req.user.id});
        res.json({msgs: [{msg: `Ingredient ${ingredient.name} Deleted Successfully`}], error: false, data: ingredients});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error I5', error: true});
    }
});

// @GET one ingredient by id
router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).json({msgs: [{msg: 'Ingredient Not Found Try Again Later'}], error: true});
        }
        return res.json({msgs: [{msg: `${ingredient.name} Found`}], error: false, data: ingredient});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msgs: [{msg: 'Server Error I6'}], error: true});
    }
});

module.exports = router;