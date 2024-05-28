// app.js

const express = require('express');

const app = express();
app.use(express.json())


// custom errors
app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });
  
// PSQL errors
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;