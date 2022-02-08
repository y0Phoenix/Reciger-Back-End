const mon = require('mongoose');

const IngredientSchema = new mon.Schema({
    user: {
        type: mon.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String
    }
});

const Ingredient = mon.model('Ingredient', IngredientSchema);

module.exports = Ingredient;