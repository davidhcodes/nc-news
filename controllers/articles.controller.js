
const {fetchArticles, fetchArticlesById, fetchCommentsByArticleID, insertCommentsByArticleID, updateArticle, patchArticle, checkArticleExists, checkTopicExists} = require('../models/articles.models')

exports.getArticles =  (req, res, next) =>{
   const {topic, sort_by, order_by} = req.query
   
    
   const promises = [fetchArticles(topic, sort_by, order_by)]

   if(topic){
    promises.push(checkTopicExists(topic))
  }

  Promise.all(promises) 
  .then((resolvedPromises)=>{
     const articles = resolvedPromises[0]
       res.status(200).send({articles});
      
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

    const promises = [fetchCommentsByArticleID(article_id)]

    if(article_id){
      promises.push(checkArticleExists(article_id))
    }

   Promise.all(promises) 
   .then((resolvedPromises)=>{
      const comments = resolvedPromises[0]
        res.status(200).send(comments);
       
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


