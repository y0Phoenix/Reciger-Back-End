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
    const calc = (amount, unit) => {
        switch (unit) {
            case 'kg':
                return (amount + 1000);
            case 'oz':
                return (amount + 28.35);
            case 'lb':
                return (amount + 454);
            case 'tsp':
                return (amount + 4.93);
            case 'tbl':
                return (amount + 14.79);
            case 'floz':
                return (amount + 29.57);
            case 'cup':
                return (amount + 237);
            case 'quart':
                return (amount + 946);
            case 'gallon':
                return (amount + 3785);
            case 'liter':
                return (amount + 1000);
            default:
                return amount;
        }
    }
    ingredients.forEach((ing, i, arr) => {
        const {amount, unit} = ing.quantity;
        obj.calories = parseInt(obj.calories + (ing.calories.pref * calc(amount, unit)));
        obj.nutrients.sodium.amount = parseInt(obj.nutrients.sodium.amount + (ing.nutrients.sodium.pref * calc(amount, unit)));
        obj.nutrients.iron.amount = parseInt(obj.nutrients.iron.amount + (ing.nutrients.iron.pref * calc(amount, unit)));
        obj.nutrients.calcium.amount = parseInt(obj.nutrients.calcium.amount + (ing.nutrients.calcium.pref * calc(amount, unit)));
        obj.nutrients.fiber.amount = parseInt(obj.nutrients.fiber.amount + (ing.nutrients.fiber.pref * calc(amount, unit)));
        obj.nutrients.sugars.amount = parseInt(obj.nutrients.sugars.amount + (ing.nutrients.sugars.pref * calc(amount, unit)));
        obj.nutrients.carbs.amount = parseInt(obj.nutrients.carbs.amount + (ing.nutrients.carbs.pref * calc(amount, unit)));
        obj.nutrients.fat.amount = parseInt(obj.nutrients.fat.amount + (ing.nutrients.fat.pref * calc(amount, unit)));
        obj.nutrients.protein.amount = parseInt(obj.nutrients.protein.amount + (ing.nutrients.protein.pref * calc(amount, unit)));
    });
    return obj;
}

module.exports = updateRecipeNutrients;