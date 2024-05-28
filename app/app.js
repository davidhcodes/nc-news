// app.js


const express = require('express');


 /* Importing the controller files */
 const {getTopics} = require('../controllers/topics.controller');
 const {getAPIs} = require('../controllers/apis.controller');


 /* Middleware functions */
const app = express();
app.use(express.json())


 /* API calls */
 app.get('/api/topics', getTopics)
 app.get('/api', getAPIs)



// custom errors
app.use((err, req, res, next) => {
  if (err.code) {
    next()
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});


app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });
  
// PSQL errors
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;