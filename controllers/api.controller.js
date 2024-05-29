const fs = require('fs/promises')

exports.getAPI = async (req,res) =>{
    
    const endpointData = await  fs.readFile("./endpoints.json", "utf-8")


    const endPoints = JSON.parse(endpointData)

   

    res.status(200).send(endPoints)
   
}