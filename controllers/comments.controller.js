const {removeComment, updateComment} = require('../models/comments.models')


  
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

    exports.patchComment = (req, res, next) => {

      const voteChange = req.body;
      const {comment_id} = req.params
      updateComment(voteChange, comment_id)
      .then((updatedComment) => {
  
        res.status(200).send( updatedComment );
      }).catch(next)
    
    };
  
  
