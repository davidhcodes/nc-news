
const {fetchArticles, fetchArticlesById, fetchCommentsByArticleID} = require('../models/articles.models')

exports.getArticles =  (req, res, next) =>{
    
    fetchArticles()
    .then((article_data)=>{
        res.status(200).send(article_data);
       
    })
    .catch(next)
    
}


exports.getArticlesById =  (req, res, next) =>{
    
    const {article_id} = req.params
    fetchArticlesById(article_id)
    .then((article_data)=>{
        res.status(200).send(article_data);
       
    })
    .catch(next)
    
}


exports.getCommentsByArticleId =  (req, res, next) =>{
    
    const {article_id} = req.params

    fetchCommentsByArticleID(article_id)
    .then((comment_data)=>{
        res.status(200).send(comment_data);
       
    })
    .catch(next)
    
}
