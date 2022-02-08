const mon = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mon.connect(db, {
            useNewURLParser: true
        });
        console.log('connected to MongoDB');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB
