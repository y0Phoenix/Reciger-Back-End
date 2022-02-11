/**
 * @param  {[]} ingredients the array of ingredients 
 * @param {string} pref the user preference for money
 * @returns  {string} the new price
 */
async function updateRecipePrice(ingredients, pref) {
    var price = 0
    ingredients.forEach(ing => {
        let amount = ing.quantity.amount;
        let _price = ing.price; 
        _price = _price.split(pref).join('');
        _price = parseFloat(_price);
        price = price + (_price * amount);
    });
    price = `${pref}${price.toFixed(2)}`;
    return price;
}

module.exports = updateRecipePrice;