let express = require('express');


module.exports = (wagner)=>{
    let api = express.Router();
    
    api.post('/addtenant', wagner.invoke((Tenant)=>{
        return  (req, res)=>{
            Tenant.create(req.body, (err, tenant)=>{
                if(err){
                    res.send(err);
                }
                res.json(tenant);
            })
        }
    }));

    api.post('./addproperty', wagner.invoke((Property)=>{
        return (req, res)=>{
            Property.create(req.body, (err, newproperty)=>{
                if(err){
                    res.send(err);
                }
                res.json(newproperty)
            });
        }
    }));

    return api
}




