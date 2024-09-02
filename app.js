const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { query } = require('./config/database');

// Middleware
app.use(bodyParser.json());

app.use('/', async (req, res) => {
    const data = await query('SELECT * FROM abc');
    res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
