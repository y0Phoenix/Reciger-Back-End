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
    ingredients: [{
        _id: {
            type: mon.Schema.Types.ObjectId,
            default: null
        },
        quantity: {
            unit: {
                type: String,
                default: null
            },
            amount: {
                type: Number,
                default: null
            }
        },
        price: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        user: {
            type: mon.Schema.Types.ObjectId,
            required: true
        }
    }],
    price: {
        type: String
    },
    category: {
        type: String
    }
});

const Recipe = mon.model('recipe', RecipeSchema);

module.exports = Recipe;