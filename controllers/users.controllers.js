

const {fetchUsers} = require('../models/users.models')


exports.getUsers =  (req, res, next) =>{
    fetchUsers()
    .then((user_data)=>{
        res.status(200).send(user_data);
       
    })
    .catch(next)
    
}