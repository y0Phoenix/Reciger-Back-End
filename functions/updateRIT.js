/**
 * @param  {[]} ingredients the ingredients array
 * @returns {[]} the updated ingredients array with quantity types
 */
async function updateRIT(ingredients) {
    const check = (unit) => {
        switch (unit) {
            case 'g':
                return 'weight';
            case 'kg':
                return 'weight';
            case 'oz':
                return 'weight';
            case 'lb':
                return 'weight';
            case 'ml':
                return 'volume';
            case 'l':
                return 'volume';
            case 'tsp':
                return 'volume';
            case 'tbl':
                return 'volume';
            case 'floz':
                return 'volume';
            case 'cup':
                return 'volume';
            case 'quart':
                return 'volume';
            case 'gallon':
                return 'volume';
            default:
                return null
        }
    }
    ingredients.forEach((ing, i, arr) => {
        arr[i].quantity.type = check(ing.quantity.unit);
    });
    return ingredients;
}

module.exports = updateRIT;