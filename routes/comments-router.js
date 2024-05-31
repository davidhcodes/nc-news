const { deleteComment, patchComment } = require('../controllers/comments.controller');

// topics-router.js
const commentsRouter = require('express').Router();

commentsRouter
.route('/:comment_id')
.delete(deleteComment, (req, res) => {
  res.status(200).send('All OK from DELETE /api/comments/:comment_id');
})
.patch(patchComment, (req, res) => {
  res.status(200).send('All OK from PATCH /api/comments/:comment_id');
});


module.exports = commentsRouter;