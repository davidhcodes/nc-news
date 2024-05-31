

const {fetchUsers, fetchUserByUsername, checkUserExists} = require('../models/users.models')


exports.getUsers =  (req, res, next) =>{
    fetchUsers()
    .then((user_data)=>{
        res.status(200).send({user_data});
       
    })
    .catch(next)
    
}

exports.getUserByUsername =  (req, res, next) =>{
    
    const {username} = req.params
    fetchUserByUsername(username)
    .then((user)=>{
        res.status(200).send({user});
       
    })
    .catch(next)
    
}

