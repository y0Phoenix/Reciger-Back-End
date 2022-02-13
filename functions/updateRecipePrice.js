/**
 * @param  {[]} ingredients the array of ingredients 
 * @param {string} pref the user preference for money
 * @returns  {string} the new price
 */
async function updateRecipePrice(ingredients, pref) {
    const check = (unit, price, type) => {
        if (type === 'weight') {
            switch (unit) {
                case 'oz':
                    return price * 28.35;
                case 'lb':
                    return price * 454;
                case 'kg':
                    return price * 1000;
                default:
                    return null;
            }
        }
        switch (unit) {
            case 'tsp':
                return price * 4.93;
            case 'tbl':
                return price * 14.79;
            case 'floz':
                return price * 29.57;
            case 'cup':
                return price * 237;
            case 'quart':
                return price * 946;
            case 'gallon':
                return price * 3785;
            case 'liter':
                return price * 1000;
            default:
                return null;
        }
    }
    var price = 0
    ingredients.forEach(ing => {
        let amount = ing.quantity.amount;
        let _price = ing.price; 
        _price = _price.split(pref).join('');
        _price = parseFloat(_price);
        if (ing.quantity.unit === 'g') {
            price = price + (_price * amount);
        }
        else {
            _price = check(ing.quantity.unit, _price, ing.quantity.type);
            price = price + (_price * amount)
        }
    });
    price = `${pref}${price.toFixed(2)}`;
    return price;
}

module.exports = updateRecipePrice;