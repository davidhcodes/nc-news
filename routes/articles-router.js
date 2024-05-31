const {getArticles, getArticlesById, getCommentsByArticleId, postCommentsByArticleId, patchArticle} = require('../controllers/articles.controller');
 

// articles-router.js
const articlesRouter = require('express').Router();

articlesRouter
.get('/', getArticles, (req, res) => {
  res.status(200).send('All OK from /api/articles');
});


articlesRouter
.route('/:article_id')
.get(getArticlesById, (req, res) => {
  res.status(200).send('All OK from GET /api/articles/:article_id');
})
.patch(patchArticle, (req, res) => {
res.status(200).send(' ALL OK from  PATCH /api/articles/:article_id')
})

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId, (req, res) => {
  res.status(200).send('All OK from GET /api/articles/:article_id/comments');
})
.post(postCommentsByArticleId, (req, res) => {
    res.status(200).send('All OK from POST /api/articles/:article_id/comments');
})


module.exports = articlesRouter;