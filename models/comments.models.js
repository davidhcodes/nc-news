const db = require('../db/connection.js');


exports.removeComment = (comment_id)=>{
  

    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])

}

exports.updateComment = async (voteChange, comment_id)=>{
    let inc_votes = voteChange.inc_votes;
    const comment_id_num = (+comment_id)
 
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING*;`, [inc_votes, comment_id_num])
    .then(({rows})=>{
        
        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "Comment does not exist"});
          }


        return rows[0]
    })
}
