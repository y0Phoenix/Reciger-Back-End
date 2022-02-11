/**
 * @param  {[]} ingredients the array of ingredients for the recipe
 * @returns {Object} the new nutrients amounts for the recipe
 */
function updateRecipeNutrients(ingredients) {
    var obj = {
        calories: 0,
        nutrients: {
            protein: {
                unit: 'mg',
                amount: 0
            },
            fat: {
                unit: 'mg',
                amount: 0
            },
            carbs: {
                unit: 'mg',
                amount: 0
            },
            sugars: {
                unit: 'mg',
                amount: 0
            },
            fiber: {
                unit: 'mg',
                amount: 0
            },
            calcium: {
                unit: 'mg',
                amount: 0
            },
            iron: {
                unit: 'mg',
                amount: 0
            },
            sodium: {
                unit: 'mg',
                amount: 0
            },

        }
    };
    ingredients.forEach((ing, i, arr) => {
        const amount = ing.quantity.amount
        obj.calories = parseInt(obj.calories + (ing.calories.pref * amount));
        obj.nutrients.sodium.amount = parseInt(obj.nutrients.sodium.amount + (ing.nutrients.sodium.pref * amount));
        obj.nutrients.sodium.unit = ing.nutrients.sodium.unit;
        obj.nutrients.iron.amount = parseInt(obj.nutrients.iron.amount + (ing.nutrients.iron.pref * amount));
        obj.nutrients.iron.unit = ing.nutrients.iron.unit;
        obj.nutrients.calcium.amount = parseInt(obj.nutrients.calcium.amount + (ing.nutrients.calcium.pref * amount));
        obj.nutrients.calcium.unit = ing.nutrients.calcium.unit;
        obj.nutrients.fiber.amount = parseInt(obj.nutrients.fiber.amount + (ing.nutrients.fiber.pref * amount));
        obj.nutrients.fiber.unit = ing.nutrients.fiber.unit;
        obj.nutrients.sugars.amount = parseInt(obj.nutrients.sugars.amount + (ing.nutrients.sugars.pref * amount));
        obj.nutrients.sugars.unit = ing.nutrients.sugars.unit;
        obj.nutrients.carbs.amount = parseInt(obj.nutrients.carbs.amount + (ing.nutrients.carbs.pref * amount));
        obj.nutrients.carbs.unit = ing.nutrients.carbs.unit;
        obj.nutrients.fat.amount = parseInt(obj.nutrients.fat.amount + (ing.nutrients.fat.pref * amount));
        obj.nutrients.fat.unit = ing.nutrients.fat.unit;
        obj.nutrients.protein.amount = parseInt(obj.nutrients.protein.amount + (ing.nutrients.protein.pref * amount));
        obj.nutrients.protein.unit = ing.nutrients.protein.unit;
    });
    return obj;
}

module.exports = updateRecipeNutrients;