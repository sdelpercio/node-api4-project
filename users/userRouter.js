const express = require('express');
const userDb = require('./userDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
	const userInfo = req.body;

	userDb
		.insert(userInfo)
		.then(newUser => {
			res.status(201).json(newUser);
		})
		.catch(error => {
			res.status(500).json({ error: 'New user could not be created.', error });
		});
}); // done

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
	// do your magic!
});

router.get('/', (req, res) => {
	userDb
		.get()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(error => {
			res.status(500).json({ error: 'Could not retrieve users data.', error });
		});
}); // done

router.get('/:id', validateUserId, (req, res) => {
	userDb
		.getById(req.params.id)
		.then(user => {
			res.status(200).json(user);
		})
		.catch(error => {
			res.status(500).json({
				error: 'There was an issue with retrieving the user ID.',
				error
			});
		});
}); // done

router.get('/:id/posts', validateUserId, (req, res) => {
	const { id } = req.params;

	userDb
		.getUserPosts(id)
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: "There was an error retrieving user's posts.", error });
		});
}); // done

router.delete('/:id', validateUserId, (req, res) => {
	const { id } = req.params;
	userDb
		.remove(id)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The user has been deleted' });
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue deleting the user.', error });
		});
}); // done

router.put('/:id', validateUserId, validateUser, (req, res) => {
	const userInfo = req.body;
	const { id } = req.params;

	userDb
		.update(id, userInfo)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The user has been updated' });
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue updating the user.', error });
		});
}); // done

//custom middleware
function validateUserId(req, res, next) {
	const id = req.params.id;

	if (!id) {
		res.status(400).json({ error: 'Must include user ID in URL.' });
	} else {
		userDb
			.getById(id)
			.then(user => {
				if (user === undefined) {
					res.status(400).json({ error: 'User does not exist.' });
				} else {
					next();
				}
			})
			.catch(error => {
				res.status(500).json({
					error: 'There was an issue with retrieving the user ID.',
					error
				});
			});
	}
}

function validateUser(req, res, next) {
	const body = req.body;
	const name = req.body.name;

	if (Object.keys(body).length === 0) {
		res.status(400).json({ error: 'Missing user data.' });
	} else if (!name) {
		res.status(400).json({ error: 'Missing required name field.' });
	} else {
		next();
	}
}

function validatePost(req, res, next) {
	const body = req.body;
	const text = req.body.text;

	if (Object.keys(body).length === 0) {
		res.status(400).json({ error: 'Missing post data.' });
	} else if (!text) {
		res.status(400).json({ error: 'Missing required text field.' });
	} else {
		next();
	}
}

module.exports = router;
