const express = require('express');
const postDb = require('../posts/postDb');

const router = express.Router();

router.get('/', (req, res) => {
	postDb
		.get()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an error retrieving posts.', err });
		});
}); // done

router.get('/:id', validatePostId, (req, res) => {
	const { id } = req.params;

	postDb
		.getById(id)
		.then(post => {
			res.status(200).json(post);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an error retrieving the post', err });
		});
}); // done

router.delete('/:id', validatePostId, (req, res) => {
	const { id } = req.params;
	postDb
		.remove(id)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The post has been deleted' });
			} else {
				res.status(404).json({ message: 'The post could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue deleting the post.', error });
		});
}); // done

router.put('/:id', validatePostId, (req, res) => {
	const postInfo = req.body;
	const { id } = req.params;

	postDb
		.update(id, postInfo)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The post has been updated' });
			} else {
				res.status(404).json({ message: 'The post could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue updating the post.', error });
		});
}); // done

// custom middleware

function validatePostId(req, res, next) {
	const id = req.params.id;

	if (!id) {
		res.status(400).json({ error: 'Must include post ID in URL.' });
	} else {
		postDb
			.getById(id)
			.then(post => {
				if (post === undefined) {
					res.status(400).json({ error: 'Post does not exist.' });
				} else {
					next();
				}
			})
			.catch(error => {
				res.status(500).json({
					error: 'There was an issue with retrieving the post ID.',
					error
				});
			});
	}
}

module.exports = router;
