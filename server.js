const express = require('express');
const cors = require('cors');

const app = express();

const connectDB = require('./config/db');

connectDB();

app.use(express.json({ extended: false }));
app.use(cors);

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/users', require('./api/users'));
app.use('/api/recipes', require('./api/recipes'));
app.use('/api/ingredients', require('./api/ingredients'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started On ${PORT}`));