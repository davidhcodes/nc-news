const db = require('../db/connection.js')

exports.fetchArticles = (articleID)=>{
    

    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleID])
    .then(({rows})=>{

        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "article does not exist"});
          }
        return rows
    })
   
}