const { default: axios, Axios } = require("axios");
const config = require('config');

class NutritionAPI {
    constructor() {
        this.app = config.get('nutAPIApp');
        this.key = config.get('nutAPIKey');
        console.log('nutAPI Running');
    }
    /**
     * @param  {string} query the food to search
     * @returns {Axios} the res from the axios call
     */
    async foodSearch(query) {
        try {
            const res = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=1&api_key=${this.key}`); 
            return await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${res.data.foods[0].fdcId}?api_key=${this.key}`); 
        } catch (err) {
            return err.response;
        }
    }
}

module.exports = NutritionAPI;