/**
 * @param  {[]} ingredients the array of ingredients for the recipe
 * @returns {Object} the new nutrients amounts for the recipe
 */
function updateRecipeNutrients(ingredients) {
    var obj = {
        calories: {
            total: 0,
            g: 0
        },
        totalAmount: 0,
        nutrients: {
            g: {
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
            },
            total: {
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
    const typesArr = [
        'sodium', 'iron', 'calcium', 'fiber', 
        'sugars', 'carbs', 'fat', 'protein'];
    ingredients.forEach((ing, i, arr) => {
        let {amount, unit} = ing.quantity;
        amount = parseInt(amount);
        obj.calories.total = parseInt(obj.calories.total + (ing.calories.pref * calc(amount, unit)));
        obj.totalAmount = obj.totalAmount + calc(amount, unit);
        obj.nutrients.total.sodium.amount = parseInt(obj.nutrients.total.sodium.amount + (ing.nutrients.sodium.pref * calc(amount, unit)));
        typesArr.forEach(type => 
            obj.nutrients.total[type].amount = 
            parseInt(obj.nutrients.total[type].amount + 
            (ing.nutrients[type].pref * calc(amount, unit)))
        );
    });
    typesArr.forEach(type => 
        obj.nutrients.g[type].amount = 
        parseInt(obj.nutrients.g[type].amount / totalAmount)    
    );
    obj.calories.g = obj.calories.total / obj.totalAmount;
    return obj;
}

module.exports = updateRecipeNutrients;