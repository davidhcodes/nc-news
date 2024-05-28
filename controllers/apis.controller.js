const {fetchAPIs} = require('../models/apis.models')

exports.getAPIs = (req,res) =>{
    fetchAPIs()
    .then((APIs)=>{
        res.status(200).send(APIs)
     
    })
}