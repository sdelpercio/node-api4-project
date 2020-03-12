const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

// creating server and applying global middleware
const server = express();
server.use(logger);
server.use(express.json());

// handle routing
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

// base url
server.get('/', (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
	const method = req.method;
	const path = req.originalUrl;
	console.log(`Request logged: ${method} to ${path}`);
	next();
}

module.exports = server;
