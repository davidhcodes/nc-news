const { getUsers, getUserByUsername } = require('../controllers/users.controllers');

// users-router.js
const usersRouter = require('express').Router();

usersRouter
.route('/')
.get(getUsers, (req, res) => {
  res.status(200).send('All OK from GET /api/users');
});

usersRouter
.route('/:username')
.get(getUserByUsername, (req, res) => {
  res.status(200).send('All OK from GET /api/users/:username');
});


module.exports = usersRouter;