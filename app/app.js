// app.js


const express = require('express');


 /* Importing the controller files */
 const {getTopics} = require('../controllers/topics.controller');
 const {getArticles} = require('../controllers/articles.controller');
 const {getAPI} = require('../controllers/api.controller');


 /* Middleware functions */
const app = express();
app.use(express.json())


 /* API calls */
 app.get('/api/topics', getTopics)

 app.get('/api', getAPI)

 app.get('/api/articles/:article_id', getArticles)

 app.use((err, req, res, next) => {
  
   if (err.code === '22P02') {
     res.status(400).send({ msg: 'Bad Request' });
   } else {
     next(err);
   }
 });

//custom errors


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