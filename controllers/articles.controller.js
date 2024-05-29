
const {fetchArticles, fetchArticlesById, fetchCommentsByArticleID, insertCommentsByArticleID, updateArticle} = require('../models/articles.models')

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


exports.postCommentsByArticleId = (req, res, next) => {
    const newComment = req.body;
    const {article_id} = req.params
    insertCommentsByArticleID(newComment, article_id)
    .then((comment) => {

      res.status(201).send({ comment });
    }).catch(next)
  
  };


  
exports.patchArticle = (req, res, next) => {

    const voteChange = req.body;
    const {article_id} = req.params
    updateArticle(voteChange, article_id)
    .then((updatedArticle) => {

      res.status(200).send( updatedArticle );
    }).catch(next)
  
  };