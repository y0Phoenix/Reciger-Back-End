const mon = require('mongoose');

const categorySchema = new mon.Schema({
    user: {
        type: mon.Schema.Types.ObjectId,
        required: true
    },
    ingredient: {
        type: Boolean,
        required: true
    },
    recipe: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Category = mon.model('category', categorySchema);

module.exports = Category;