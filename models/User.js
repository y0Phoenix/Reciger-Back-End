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
    categories: {
        type: [String],
    }
});

const User = mon.model('user', UserSchema);

module.exports = User;