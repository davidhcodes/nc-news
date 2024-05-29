const db = require('../db/connection.js');
const { articleData } = require('../db/data/test-data/index.js');

exports.fetchArticlesById = (articleID)=>{
    

    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleID])
    .then(({rows})=>{

        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "article does not exist"});
          }
        return rows
    })
   
}

exports.fetchArticles = ()=>{
    

    return db
    .query(`SELECT  articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ,COUNT(*) AS comment_count
    FROM articles
    INNER JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `)
            
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
    INNER JOIN articles ON comments.article_id = articles.article_id `
    

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
