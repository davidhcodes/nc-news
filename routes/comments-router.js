const { deleteComment } = require('../controllers/comments.controller');

// topics-router.js
const commentsRouter = require('express').Router();

commentsRouter
.route('/:comment_id')
.delete(deleteComment, (req, res) => {
  res.status(200).send('All OK from /api/comments/:comment_id');
});


module.exports = commentsRouter;