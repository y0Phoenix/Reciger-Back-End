/**
 * @param  {string} unit the unit for the calories
 * @param  {number} cal the calories per the unit
 * @param  {number} amount the amount of the ingredient (default 1)
 * @param  {string} pref the ingredient prefered unit 
 * @returns {number} the calculated calorie count
 */
function calcCal(unit, cal, amount = 1, pref) {
    var obj = {
        g: null,
        oz: null,
        ml: null,
        floz: null,
        pref: null
    };
    if (unit === 'ml') {
        obj.ml = (cal / amount).toFixed(2);
        obj.floz = (cal / (amount / 29.57)).toFixed(2);
        obj.pref = obj.ml;
        return obj;
    }
    obj.g = (cal / amount).toFixed(2);
    obj.oz = (cal / (amount / 28.35)).toFixed(2);
    obj.pref = obj.g;
    return obj
}

module.exports = calcCal;