const mon = require('mongoose');

const IngredientSchema = new mon.Schema({
    user: {
        type: mon.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    units: {
        prefered: {
            type: String,
            required: true
        },
        weight: {
            type: [String],
        },
        volume: {
            type: [String]
        }
    },
    calories: {
        type: Number,
        default: 0
    },
    categories: {
        type: [String],
        default: []
    }
});

const Ingredient = mon.model('Ingredient', IngredientSchema);

module.exports = Ingredient;