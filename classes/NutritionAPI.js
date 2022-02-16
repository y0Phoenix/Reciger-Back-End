const { default: axios, Axios } = require("axios");
const config = require('config');

class NutritionAPI {
    constructor() {
        this.app = config.get('nutAPIApp');
        this.key = config.get('nutAPIKey');
        this.res = null;
        console.log('nutAPI Running');
    }
    /**
     * @param  {string} query the food search query
     * @param  {string} pref the users prefered unit of measurment
     * @returns {{}} 
     */
    async foodSearchAndParse(query, pref) {
        this.res = await this.foodSearch(query);
        if (this.res.status !== 200 && !isNaN(this.res.status)) {
            return {error: {
                status: this.res.status,
                statusText: this.res.statusText
            }};
        }
        return this.parse(pref);
        
    }
    /**
     * @param  {string} query the food to search
     * @returns {Axios} the res from the axios call
     */
    async foodSearch(query) {
        try {
            this.res = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=1&api_key=${this.key}`);
            const bool = this.res.data.foods.map(food => food.dataType === 'Branded')[0];
            if (bool)  {
                this.res = await (await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${this.res.data.foods[0].fdcId}?api_key=${this.key}`)).data;
                return this.res
            }
            return {
                status: 404,
                statusText: `No Good Matches Found For ${query} In The Nutritional Database.
                Try Specifying With The Type ex. Beef Sirloin instead of Just Sirloin
                Or You Can Opt out for Nutritional Data for this Ingredient`
            }
        } catch (err) {
            return err.response;
        }
    }
    /**
     * @param  {string} pref the ingredient prefered unit 
     * @returns {{calories: {}, nutrients: {}}} the parsed data from the response
     */
    async parse(pref) {
        const unit = this.res.servingSizeUnit;
        const amount = this.res.servingSize;
        var obj = {
            calories: {
                g: 0,
                oz: 0,
                ml: 0,
                floz: 0,
                pref: 0
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
            },
            error: {
                status: 200,
                statusText: 'Good Request'
            }
        };
        const length = this.res.labelNutrients ? Object.keys(this.res.labelNutrients).length : 0;
        if (length <= 0) {
            return obj; 
        } 
        var cal = this.res.labelNutrients.calories.value;
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
        this.res.foodNutrients.forEach((nut, i, arr) => {
            const prop = check(nut.nutrient.name);
            if (prop) {
                prop.obj.unit = nut.nutrient.unitName.toLowerCase();
                const value = this.res.labelNutrients[prop.name].value;
                if (unit === 'ml' && !value <= 0) {
                    prop.obj.ml = (value / amount).toFixed(2);
                    prop.obj.floz = (value / (amount / 29.57)).toFixed(2);
                    const p = pref === 'ml' || pref === 'floz' ? pref : 'ml';
                    prop.obj.pref = prop.obj[p];
                }
                else if (unit === 'g' && !value <= 0) {
                    prop.obj.g = (value / amount).toFixed(2);
                    prop.obj.oz = (value / (amount / 28.35)).toFixed(2);
                    const p = pref === 'g' || pref === 'oz' ? pref : 'g';
                    prop.obj.pref = prop.obj[p];
                }
                if (pref === 'ea') {
                    prop.obj.pref = value;
                }
            }
        });
        if (pref === 'ea') {
            obj.calories.pref = cal;
            if (unit === 'ml') {
                obj.calories.ml = (cal / amount).toFixed(2);
                obj.calories.floz = (cal / (amount / 29.57)).toFixed(2);    
            }
            else {
                obj.calories.g = (cal / amount).toFixed(2);
                obj.calories.oz = (cal / (amount / 28.35)).toFixed(2);    
            }
        }
        else if (unit === 'ml') {
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
}

module.exports = NutritionAPI;