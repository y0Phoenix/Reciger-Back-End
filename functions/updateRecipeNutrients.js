/**
 * @param  {[]} ingredients the array of ingredients for the recipe
 * @returns {Object} the new nutrients amounts for the recipe
 */
function updateRecipeNutrients(ingredients) {
    var obj = {
        calories: 0,
        nutrients: {
            protein: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            fat: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            carbs: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            sugars: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            fiber: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            calcium: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            iron: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            sodium: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },

        }
    };
    const calc = (ing, amount) => {
        let obj = {}
        obj.sodium = ing.nutrients.sodium * amount;
        obj.iron = ing.nutrients.iron * amount;
        obj.calcium = ing.nutrients.calcium * amount;
        obj.fiber = ing.nutrients.fiber * amount;
        obj.sugars = ing.nutrients.sugars * amount;
        obj.carbs = ing.nutrients.carbs * amount;
        obj.fat = ing.nutrients.fat * amount;
        obj.protein = ing.nutrients.protein * amount;
        return obj;
    }
    ingredients.forEach((ing, i, arr) => {
        const amount = ing.quantity.amount
        obj.calories = parseInt(obj.calories + (ing.calories.pref * amount));
        obj.nutrients.sodium = calc(ing.nutrients.sodium, amount);
        obj.nutrients.iron = calc(ing.nutrients.iron, amount);
        obj.nutrients.calcium = calc(ing.nutrients.calcium, amount);
        obj.nutrients.fiber = calc(ing.nutrients.fiber, amount);
        obj.nutrients.sugars = calc(ing.nutrients.sugars, amount);
        obj.nutrients.carbs = calc(ing.nutrients.carbs, amount);
        obj.nutrients.fat = calc(ing.nutrients.fat, amount);
        obj.nutrients.protein = calc(ing.nutrients.protein, amount);
    });
    return obj;
}

module.exports = updateRecipeNutrients;