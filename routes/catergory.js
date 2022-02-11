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

// @POST create catergory
router.post('/', [
    check('name', 'Please Specify With A Category Name').not().isEmpty(),
    check('type', 'Category Type Is Required').not().isEmpty()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(403).json({msgs: errors.array(), error: true});
    }
    let {name, type} = req.body;
    const user = req.user;
    var bool = true;
    try {
        user.categories[type].forEach((cat, i, arr) => {
            if (cat === name) {
                bool = false;
                res.status(500).json({msgs: [{msg: 'Category Already Exists'}], error: true});
            }
        });
        if (bool) {
            user.categories[type].push(name);
            await user.save();
            res.json({msgs: [{msg: `Category ${name} Created Successfully`}], error: false, categories: user.categories});
        }
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msgs: [{msg: 'Server Error C1'}], error: true});
    }
});

// @GET get all categories for user
router.get('/', auth, async (req, res) => {
    const user = req.user;
    try {
        if (!user.categories.ingredient[0] && !user.categories.recipe[0]) {
            return res.status(500).json({msgs: [{msg: 'No catergories Found For User'}], error: true});
        }
        res.json({categories: user.categories, error: false});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error C2', error: true});
    }
});

// @DELETE delete a category
router.delete('/', auth, async (req, res) => {
    const {name, type} = req.body;
    const user = req.user;
    try {
        let category;
        user.categories[type].forEach((cat, i, arr) => {
            if (cat === name) {
                category = cat;
                arr.splice(i, 1);
            }
        });
        await user.save();
        if (!category) {
            return res.status(500).json({msgs: [{msg: 'Category Not Found'}], error: true});
        }
        let recipes = await Recipe.find({user: user});
        if (recipes[0]) {
            for (let i = 0; i < recipes.length; i++) {
                let recipe = await Recipe.findById(recipes[i].id);
                if (type === 'recipe') {
                    recipe.categories.forEach((cat, i, arr) => {
                        if (cat === name) {
                            arr.splice(i, 1);
                        }
                    });
                }
                else {
                    recipe.ingredients.forEach(ing => {
                        ing.categories.forEach((cat, i, arr) => {
                            if (cat === name) {
                                arr.splice(i, 1);
                            }
                        });
                    });
                }
                await recipe.save();
            }
        }
        let ingredients = type === 'ingredient' ? await Ingredient.find({user: user}) : [];
        if (ingredients[0]) {
            for (let i = 0; i < ingredients.length; i++) {
                let ingredient = await Ingredient.findById(ingredients[i].id);
                ingredient.categories.forEach((cat, i, arr) => {
                    if (cat === name) {
                        arr.splice(i, 1);
                    }
                })
                await ingredient.save();
            }
        }
        res.json({msgs: [{msg: `Category ${name} Deleted Successfully`}], error: false});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({msg: 'Server Error C3', error: true});
    }

});

module.exports = router;