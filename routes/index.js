const authRouter = require('./auth-route.js');
const usersRouter = require('./users-route.js');
const postsRouter = require('./posts-route.js');
const commentsRouter = require('./comments-route.js');

module.exports = [
    authRouter,
    usersRouter,
    postsRouter,
    commentsRouter
]