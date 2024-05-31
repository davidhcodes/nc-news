const db = require('../db/connection.js');

exports.fetchUsers = ()=>{


    return db
    .query(`SELECT *
    FROM users
    ;
    `)
            
    .then(({rows})=>{

  
        if(rows.length === 0){
            return Promise.reject({ status:404, msg: "There are no articles"});
          }
        return rows
    })
   
}

exports.checkUserExists = (user)=>{
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [user])
    .then(({rows})=>{
        if(!rows.length){
           return Promise.reject({status: 404, msg: 'User does not exist'})
        }
    })
}


exports.fetchUserByUsername = (username)=>{
    const queryValues = []


 if((isNaN(username))===false){
    return Promise.reject({status: 400, msg: 'Bad Request'})
 }

 let sqlQuery =`SELECT * FROM users`

  if(username){
     sqlQuery +=  ` WHERE users.username = $1 `, [username]
      queryValues.push(username)
      }

   
 sqlQuery+= `;`


  return db
  .query(sqlQuery, queryValues)    

 .then(({rows})=>{
    if(rows.length === 0){
        return Promise.reject({ status:404, msg: "User does not exist"});
      }

     return rows[0]
 })


}
