/**
 * @param  {[]} ingredients the array of ingredients for the recipe
 * @returns {Object} the new nutrients amounts for the recipe
 */
function updateRecipeNutrients(ingredients) {
    var obj = {
        calories: 0,
        nutrients: {
            protein: {
                unit: 'g',
                amount: 0
            },
            fat: {
                unit: 'g',
                amount: 0
            },
            carbs: {
                unit: 'g',
                amount: 0
            },
            sugars: {
                unit: 'g',
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
        obj.nutrients.iron.amount = parseInt(obj.nutrients.iron.amount + (ing.nutrients.iron.pref * amount));
        obj.nutrients.calcium.amount = parseInt(obj.nutrients.calcium.amount + (ing.nutrients.calcium.pref * amount));
        obj.nutrients.fiber.amount = parseInt(obj.nutrients.fiber.amount + (ing.nutrients.fiber.pref * amount));
        obj.nutrients.sugars.amount = parseInt(obj.nutrients.sugars.amount + (ing.nutrients.sugars.pref * amount));
        obj.nutrients.carbs.amount = parseInt(obj.nutrients.carbs.amount + (ing.nutrients.carbs.pref * amount));
        obj.nutrients.fat.amount = parseInt(obj.nutrients.fat.amount + (ing.nutrients.fat.pref * amount));
        obj.nutrients.protein.amount = parseInt(obj.nutrients.protein.amount + (ing.nutrients.protein.pref * amount));
    });
    return obj;
}

module.exports = updateRecipeNutrients;