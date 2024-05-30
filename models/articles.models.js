const db = require('../db/connection.js');
const { articleData } = require('../db/data/test-data/index.js');
const {articlesTable} = require('../utils/query.js')

exports.fetchArticlesById = (articleID)=>{
       const queryValues = []

    
    let sqlQuery =`SELECT  articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(*)::int AS comment_count 
    FROM articles
     LEFT JOIN comments ON articles.article_id = comments.article_id `
   
     if(articleID){
        sqlQuery +=  ` WHERE articles.article_id = $1 `, [articleID]
         queryValues.push(articleID)
         }

    sqlQuery+=   `  GROUP BY articles.article_id  `

    sqlQuery+= ` ORDER BY articles.created_at DESC`

    sqlQuery+= `;`



     return db
     .query(sqlQuery, queryValues)    

    .then(({rows})=>{

        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "article does not exist"});
          }
        return rows
    })
   
}

exports.fetchArticles = async (topic)=>{
    
    const queryValues = []
    
       
    articles = await articlesTable()

    if(topic){
    if (!(articles.some(article => article.topic === topic)) ){
        return Promise.reject({status:400, msg: "This query is invalid"})
      }
    }

    let sqlQuery =`SELECT  articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ,  COUNT(*) AS comment_count 
    FROM articles
     LEFT JOIN comments ON articles.article_id = comments.article_id `
   
     if(topic){
        sqlQuery +=  ` WHERE articles.topic = $1 `, [topic]
         queryValues.push(topic)
         }

    sqlQuery+=   `  GROUP BY articles.article_id  `

    sqlQuery+= ` ORDER BY articles.created_at DESC`

    sqlQuery+= `;`
    return db
    .query(sqlQuery, queryValues)      


            
    .then(({rows})=>{

        /* Strict typecasting the comment_count field so it will be a number and not a string */
        rows.forEach((article)=>{(article.comment_count) = Number(article.comment_count)})
     
        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "There are no articles"});
          }
        return rows
    })
   
}

exports.fetchCommentsByArticleID = (article_id)=>{

    const queryValues = []

       
     let sqlQuery = `SELECT  comments.comment_id, articles.article_id, comments.votes, comments.created_at, comments.author, comments.body
    FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id `
    

    if(article_id){
    sqlQuery +=  `WHERE comments.article_id = $1 `, [article_id]
    queryValues.push(article_id)
    }
    
    sqlQuery += `ORDER BY comments.created_at DESC `
        
    sqlQuery+=`;`

 
    
    return db
    .query(sqlQuery, queryValues)
    .then(({rows})=>{

        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "Article does not exist"});
          }
        return rows
    })
   
}


exports.insertCommentsByArticleID = ({username, body}, article_id)=>{
   let author = username
   let queryValues =  [username, body, article_id]
  
   const now = new Date ()
    
        return db.query(`INSERT INTO comments
        (author, body, article_id, votes, created_at)
        VALUES
        ($1, $2, $3, 0, $4)
        RETURNING * ;`, [author, body, article_id, now])

     .then((result)=>{
     
        const newComment = result.rows

           return newComment[0]
        })
        
      
        
    }


    
exports.updateArticle = async (voteChange, article_id)=>{
    let inc_votes = voteChange.inc_votes;
    const article_id_num = Number(article_id)
    let currentVotes = 0
 
    articles = await articlesTable()

   
    articles.forEach((article)=>{
      
    
        if(article.article_id === article_id_num){
            inc_votes+=article.votes
        }
        
    })

    return db.query(`
    UPDATE articles
    SET votes = $1
    WHERE article_id = $2
    RETURNING*;`, [inc_votes, article_id])
    .then(({rows})=>{
        
        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "Article does not exist"});
          }


        return rows[0]
    })
}


exports.removeComment = (comment_id)=>{
  

    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])

}
