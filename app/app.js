// app.js


const express = require('express');


 /* Importing the controller files */
 const {getTopics} = require('../controllers/topics.controller');
 const {getArticles, getArticlesById, getCommentsByArticleId, postCommentsByArticleId, patchArticle} = require('../controllers/articles.controller');
 const {getAPI} = require('../controllers/api.controller');
 const {deleteComment}= require('../controllers/comments.controller');
 const {getUsers} = require('../controllers/users.controllers')


 /* Middleware functions */
const app = express();
app.use(express.json())


 /* API calls */
 app.get('/api/topics', getTopics)

 app.get('/api', getAPI)

 app.get('/api/articles', getArticles)

 app.get('/api/articles/:article_id', getArticlesById)
 
 app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

 app.get('/api/users', getUsers)


 app.post('/api/articles/:article_id/comments', postCommentsByArticleId);

 app.patch('/api/articles/:article_id', patchArticle)

 app.delete('/api/comments/:comment_id', deleteComment)

 app.use((err, req, res, next) => {
  
   if (err.code === '22P02') {
     res.status(400).send({ msg: 'Bad Request' });
   } else {
     next(err);
   }
 });

//custom errors

app.use((err,req,res,next)=>{
  if(err.msg){
    res.status(err.status).send({msg: err.msg})
    next()
  }else{
    
  next(err)
  }
})



  
  app.all('*', (req, res, next)=>{
    res.status(404).send({ msg: 'Cannot find the page' })
  })
 


module.exports = app;


// 


