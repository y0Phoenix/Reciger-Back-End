/**
 * @param  {string} unit the unit for the calories
 * @param  {{}} food the whole food object
 * @param  {number} amount the amount of the ingredient (default 1)
 * @param  {string} pref the ingredient prefered unit 
 * @returns {Object} the calculated nutrients in an object
 */
function calcNutrients(unit, food, amount = 1, pref) {
    var obj = {
        calories: {
            g: null,
            oz: null,
            ml: null,
            floz: null,
            pref: null
        },
        nutrients: {
            protein: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            fat: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            carbs: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            sugars: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            fiber: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            calcium: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            iron: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },
            sodium: {
                unit: 'mg',
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
            },

        }
    };
    var cal = food.labelNutrients.calories.value;
    const check = (name) => {
        switch (name) {
            case 'Protein':
                return {obj: obj.nutrients.protein, name: 'protein'};
            case 'Total lipid (fat)':
                return {obj: obj.nutrients.fat, name: 'fat'};
            case 'Carbohydrate, by difference':
                return {obj: obj.nutrients.carbs, name: 'carbohydrates'};
            case 'Sugars, total including NLEA':
                return {obj: obj.nutrients.sugars, name: 'sugars'};
            case 'Sodium, Na':
                return {obj: obj.nutrients.sodium, name: 'sodium'};
            case 'Fiber, total dietary':
                return {obj: obj.nutrients.fiber, name: 'fiber'};
            case 'Calcium, Ca':
                return {obj: obj.nutrients.calcium, name: 'calcium'};
            case 'Iron, Fe':
                return {obj: obj.nutrients.iron, name: 'iron'};  
            default:
                return null
        }
    }
    food.foodNutrients.forEach((nut, i, arr) => {
        const prop = check(nut.nutrient.name);
        if (prop) {
            prop.obj.unit = nut.nutrient.unitName.toLowerCase();
            const value = food.labelNutrients[prop.name].value;
            if (unit === 'ml' && !value <= 0) {
                prop.obj.ml = (value / amount).toFixed(2);
                prop.obj.floz = (value / (amount / 29.57)).toFixed(2);
                pref = pref === 'ml' || pref === 'floz' ? pref : 'ml';
                prop.obj.pref = prop.obj[pref];
            }
            else if (unit === 'g' && !value <= 0) {
                prop.obj.g = (value / amount).toFixed(2);
                prop.obj.oz = (value / (amount / 28.35)).toFixed(2);
                pref = pref === 'g' || pref === 'oz' ? pref : 'g';
                prop.obj.pref = prop.obj[pref];
            }
        }
    });
    if (unit === 'ml') {
        obj.calories.ml = (cal / amount).toFixed(2);
        obj.calories.floz = (cal / (amount / 29.57)).toFixed(2);
        obj.calories.pref = obj.calories.ml;
    }
    else {
        obj.calories.g = (cal / amount).toFixed(2);
        obj.calories.oz = (cal / (amount / 28.35)).toFixed(2);
        obj.calories.pref = obj.calories.g;
    }
    return obj;
}

module.exports = calcNutrients;