
const {fetchTopics} = require('../models/topics.models')



exports.getTopics =  (req, res) =>{
    
    fetchTopics()
    .then((Data)=>{
        res.status(200).send(Data);
       
    })
    
}
