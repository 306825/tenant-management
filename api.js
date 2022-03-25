let express = require('express');


module.exports = (wagner)=>{
    let api = express.Router();
    
    api.post('/addtenant', wagner.invoke((Tenant)=>{
        return function (req, res){
            Tenant.create(req.body, (err, tenant)=>{
                if(err){
                    res.send(err);
                }
                res.json(tenant);
            })
        }
    }))

    return api
}




