const mon = require('mongoose');

const RecipeSchema = new mon.Schema({
    user: {
        type: mon.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [mon.Schema.Types.ObjectId],
        required: true
    },
    price: {
        type: String
    }
});

const Recipe = mon.model('recipe', RecipeSchema);

module.exports = Recipe;