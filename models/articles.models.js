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