function checkUnits(unit) {
    unit = unit.toLowerCase();
    switch (unit) {
        case 'g':
            return true;
        case 'kg':
            return true;
        case 'oz':
            return true;
        case 'lb':
            return true;
        case 'ml':
            return true;
        case 'l':
            return true;
        case 'tsp':
            return true;
        case 'tbl':
            return true;
        case 'floz':
            return true;
        case 'cup':
            return true;
        case 'quart':
            return true;
        case 'gallon':
            return true;
        case 'ea':
            return true
        default:
            return false
    }
}

module.exports = checkUnits;