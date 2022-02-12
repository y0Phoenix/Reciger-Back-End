const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');
const updateRecipePrice = require('../functions/updateRecipePrice');
const nutAPI = require('../api/nutAPI');
const calcNutrients = require('../functions/calcNutrients');
const updateRecipeNutrients = require('../functions/updateRecipeNutrients');
const updateUserCategories = require('../functions/updateUserCategories');

// @POST create ingredient
router.post('/', auth, [
    check('name', 'Ingredient Name Is Required').not().isEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({msgs: errors.array(), error: true});
        }

        const {
            name, 
            price = '$0.00', 
            units = {weight: ['oz'], volume: ['floz'], prefered: user.preferences.measurements[0]}, 
            categories,
        } = req.body;
        const user = req.user.id;
        let ingredient = await Ingredient.find({name: name}, {user: user});
        if (ingredient[0]) {
            return res.status(400).json({ msgs: [{ msg: 'Ingredient Already Exists' }], error: true });
        }
        
        let Res;
        let data;
        Res = await nutAPI.foodSearch(name);
        
        if (Res.status !== 200) {
            return res.status(Res.status).json({msgs: [{msg: 'Error While Creating Ingredient Try Again Later'}], msg: Res.statusText, error: true});
        }
        data = Res.data;
        const length = Object.keys(data.labelNutrients).length;
        const {calories, nutrients} = length > 0 ? 
        await calcNutrients(data.servingSizeUnit, data, data.servingSize, units.prefered) : 
        {calories: null, nutrients: null};
        
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
        await ingredient.save();

        let recipes = await Recipe.find({user: user});
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

        const ingredients = await Ingredient.find({user: user}).select({units: 0, calories: 0, nutrients: 0, __v: 0});

        res.json({ msgs: [{msg: `Ingredient ${ingredient.name} Created Successfully`}], error: false, data: ingredients});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error I4', error: true});
    }
});

// @POST update ingredient
router.post('/update', [
    check('price', 'Please Specify A New Price Or Name To Update').not().isEmpty(),
    check('_id', 'id Is Required').not().isEmpty()
], auth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({msgs: errors.array(), error: true});
        }
        const {name, price, _id, categories} = req.body;
        let ingredient = await Ingredient.findById(_id);
        if (!ingredient) {
            return res.status(400).json({msgs: [{msg: 'Ingredient Not Found Try Again Later'}], error: true});
        }
        ingredient = await Ingredient.findOneAndUpdate({_id: _id}, {$set: {name, price, categories}}, {new: true});
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
                rec.calories = calories;
                rec.nutrients = nutrients;
                await rec.save();
            };
        }
        const ingredients = await Ingredient.find({user: req.user.id}).select({units: 0, calories: 0, nutrients: 0, __v: 0});;
        res.json({msgs: [{msg: `Ingredient ${name} Updated Successfully`}], error: false, data: ingredients});
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
        const ingredients = await Ingredient.find({user: id}).select({units: 0, calories: 0, nutrients: 0});
    
        if (!ingredients[0]) {
            return res.status(400).json({msgs: [{msg: 'No Ingredients Found', error: true}]});
        }
    
        res.json(ingredients);
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
        const ingredients = await Ingredient.find({user: req.user.id}).select({units: 0, calories: 0, nutrients: 0, __v: 0});
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