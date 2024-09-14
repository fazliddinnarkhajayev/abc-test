const express = require('express');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();

const routes = require('./routes');

// cron-jobs
require('./cron/cron-job.js');

// Middlewares
const errorHandler = require('./middlewares/error-handler.js');
const { authenticateToken } = require('./middlewares/auth.js');

app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api', authenticateToken, routes);

// Use the error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
