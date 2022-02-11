/**
 * @param  {string} unit the unit for the calories
 * @param  {[]} nutrients the nutrients of the food item
 * @param  {number} amount the amount of the ingredient (default 1)
 * @param  {string} pref the ingredient prefered unit 
 * @returns {Object} the calculated nutrients in an object
 */
function calcNutrients(unit, nutrients, amount = 1, pref) {
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
    var cal = 0;
    nutrients.forEach((nut, i, arr) => {
        const prop = obj.nutrients[nut.nutrientName.toLowerCase()];
        if (prop) {
            if (unit === 'ml') {
                prop.ml = (nut.value / amount).toFixed(2);
                prop.floz = (nut.value / (amount / 29.57)).toFixed(2);
                pref = pref === 'ml' || pref === 'floz' ? pref : 'ml';
                prop.pref = prop[pref];
            }
            else {
                prop.g = (nut.value / amount).toFixed(2);
                prop.oz = (nut.value / (amount / 28.35)).toFixed(2);
                pref = pref === 'g' || pref === 'oz' ? pref : 'g';
                prop.pref = prop[pref];
            }
        }
        if (nut.nutrientName === 'Energy') {
            cal = nut.value;
        }
    });
    if (unit === 'ml') {
        obj.calories.ml = (cal / amount).toFixed(2);
        obj.calories.floz = (cal / (amount / 29.57)).toFixed(2);
        obj.calories.pref = obj.ml;
    }
    else {
        obj.calories.g = (cal / amount).toFixed(2);
        obj.calories.oz = (cal / (amount / 28.35)).toFixed(2);
        obj.calories.pref = obj.g;
    }
    return obj;
}

module.exports = calcNutrients;