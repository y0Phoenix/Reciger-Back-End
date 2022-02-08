const mon = require('mongoose');

const UserSchema = new mon.Schema({
    name: {
        type: String,
        required: true
    },
    preferences: {
        measurements: {
            type: [String],
            required: true
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
    }
});

const User = mon.model('user', UserSchema);

module.exports = User;