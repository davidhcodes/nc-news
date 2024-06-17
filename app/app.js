// app.js

const cors = require('cors')
const express = require('express');




/* Middleware functions */
const app = express();
app.use(cors());
app.use(express.json())

/* Importing the controller files */
const apiRouter = require('../routes/api-router');

 app.use('/api', apiRouter)


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


