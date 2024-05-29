const db = require('../db/connection')

exports.commentsTable = () => {

 

    return db.query(`SELECT *
    FROM comments;`)
    .then(({rows})=>{

      
       return rows
    })
   
   
   }

   exports.articlesTable = () => {

 

    return db.query(`SELECT *
    FROM articles;`)
    .then(({rows})=>{

       return rows
    })
   
   
   }

   exports.commentsPerArticle = (comments, articles) =>
   {

    

   }

   

