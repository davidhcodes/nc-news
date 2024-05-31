const { getTopics } = require('../controllers/topics.controller');

// topics-router.js
const topicsRouter = require('express').Router();

topicsRouter
.route('/')
.get(getTopics, (req, res) => {
  res.status(200).send('All OK from /api/topics');
});


module.exports = topicsRouter;