const { getUsers } = require('../controllers/users.controllers');

// users-router.js
const usersRouter = require('express').Router();

usersRouter
.route('/')
.get(getUsers, (req, res) => {
  res.status(200).send('All OK from /api/users');
});


module.exports = usersRouter;