const { application } = require('express');
let express = require('express');
const res = require('express/lib/response');


module.exports = (wagner) => {
    let api = express.Router();

    api.post('/addtenant/:property_id', [wagner.invoke((Tenant) => {
        return (req, res, next) => {
            Tenant.create(req.body, (err, tenant) => {
                if (err) {
                    res.send(err);
                }
                req.tenant_id = tenant._id;
                next();
            })
        }
    }),
        wagner.invoke((Property)=>{
            return (req, res)=>{
                //console.log(req.tenant_id);
                Property.findOneAndUpdate({_id:req.params.property_id}, 
                    {$addToSet: {tenants: [req.tenant_id]}},
                    function (err, result){
                        if(err){
                            res.send(err);
                        }
                        //console.log(result.tenants.length + '<' + result.max_number_of_tenants)
                        if(result.tenants.length < result.max_number_of_tenants){
                            result.tenants.push(req.tenant_id)
                            result.save().then((savedResult)=>{
                                res.json(savedResult);
                            }).catch((err)=>{
                                res.send(err);
                            });
                        }else{
                            //console.log('-----------------------------------------------');
                            res.send('Property capacity reached');                        }
                    }
                    )
            }
        })

]);

    api.post('/addproperty', wagner.invoke((Property) => {
        return (req, res) => {
            Property.create(req.body, (err, newproperty) => {
                if (err) {
                    res.send(err);
                }
                res.json(newproperty)
            });
        }
    }));

    api.post('/addtenanttoproperty', wagner.invoke((Property) => {
        return (req, res, next) => {

        }
    }));

    api.get('/property/:id', wagner.invoke((Property) => {
        return (req, res) => {
            Property.findById(req.params.id, (err, property) => {
                if (err) {
                    res.send(err);
                }
                res.json(property)
            })
        }
    }));

    api.delete('/property/tenant/:property_id/:tenant_id', wagner.invoke((Property)=>{
        return (req, res)=>{
            Property.findById(req.params.property_id, (err, property_document)=>{
                if(err){
                    res.send(err);
                }
                var index = property_document.tenants.indexOf(req.params.tenant_id);
                property_document.tenants.pop(index);
                property_document.save().then((updated_property_doc)=>{
                    index = property_document.tenants.indexOf(req.params.tenant_id);
                    res.json(updated_property_doc);
                }).catch((err)=>{
                    res.send(err)
                })
            });
        }
    }));

    return api
}




