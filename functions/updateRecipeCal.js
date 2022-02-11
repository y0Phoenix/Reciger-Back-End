/**
 * @param  {[]} ingredients the array of ingredients for the recipe
 * @returns {number} the new calorie amount for the recipe
 */
function updateRecipeCal(ingredients) {
    var amount = 0;
    ingredients.forEach((ing, i, arr) => {
        amount = parseInt(amount + (ing.calories.pref * ing.quantity.amount));
    });
    return amount;
}

module.exports = updateRecipeCal;