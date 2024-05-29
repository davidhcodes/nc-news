
const {fetchArticles, fetchArticlesById} = require('../models/articles.models')

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
