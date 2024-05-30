const {removeComment} = require('../models/comments.models')


  
exports.deleteComment =  (req, res, next) =>
    {
      const comment_id = req.params.comment_id
      
     
        removeComment(comment_id) 
        .then((deletedata) => {
          if(deletedata.rowCount === 0){
           next({status: 404, msg:"Comment does not exist"})
          }else res.status(204).send()
       
       
         }).catch((err)=>{
           next(err)
          
         })
           
    }
