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

   exports.articlesTableColumns = () => {

 

      return db.query(`SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'articles';`)
      .then(({rows})=>{
         const columns = rows
         let columnArray = []
         columns.forEach((element)=>{
            columnArray.push( element.column_name)
         })
        
     
         return columnArray
      })
     
     
     }
     


