const express = require('express');
const userDb = require('./userDb');

const router = express.Router();

router.post('/', (req, res) => {
	// do your magic!
});

router.post('/:id/posts', validateUserId, (req, res) => {
	// do your magic!
});

router.get('/', (req, res) => {});

router.get('/:id', validateUserId, (req, res) => {
	// do your magic!
});

router.get('/:id/posts', validateUserId, (req, res) => {
	// do your magic!
});

router.delete('/:id', validateUserId, (req, res) => {
	// do your magic!
});

router.put('/:id', validateUserId, (req, res) => {
	// do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
	const { id } = req.params;
	if (!id) {
		res.status(400).json({ error: 'Must include user ID in URL.' });
	} else {
		userDb
			.getById(id)
			.then(user => {
				if (user.length === 0) {
					res.status(400).json({ error: 'User does not exist' });
				} else {
					next();
				}
			})
			.catch(error => {
				res
					.status(500)
					.json({
						error: 'There was an issue with retrieving the user ID.',
						error
					});
			});
	}
}

function validateUser(req, res, next) {
	// do your magic!
}

function validatePost(req, res, next) {
	// do your magic!
}

module.exports = router;
