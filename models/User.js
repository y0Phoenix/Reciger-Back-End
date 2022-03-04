const mon = require('mongoose');

const UserSchema = new mon.Schema({
    name: {
        type: String,
        required: true
    },
    preferences: {
        measurements: {
            type: [String],
            default: ['oz', 'floz']
        },
        money: {
            type: String,
            default: '$'
        }
    },
    categories: {
        ingredient: {
            type: [String],
            default: []
        },
        recipe: {
            type: [String],
            default: []
        }
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    recents: {
        ingredients: [{
            ing: {
                type: mon.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            categories: {
                type: [String],
                default: []
            },
            calories: {
                type: Number,
                default: 0
            },
            price: {
                type: String,
                default: '$0.00'
            },
            img: {
                type: String,
                default: ''
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
        recipes: [{
            rec: {
                type: mon.Schema.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            categories: {
                type: [String],
                default: []
            },
            calories: {
                type: Number,
                default: 0
            },
            price: {
                type: String,
                default: '$0.00'
            },
            yield: {
                type: String,
                default: '1 Person'
            },
            img: {
                type: String,
                default: ''
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    }
});

const User = mon.model('user', UserSchema);

module.exports = User;