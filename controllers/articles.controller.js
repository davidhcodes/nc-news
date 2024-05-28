
const {fetchArticles} = require('../models/articles.models')



exports.getArticles =  (req, res, next) =>{
    
    const {article_id} = req.params
    fetchArticles(article_id)
    .then((article_data)=>{
        res.status(200).send(article_data);
       
    })
    .catch(next)
    
}
