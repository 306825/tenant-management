let mongoose = require('mongoose');

module.exports = function (wagner){

    mongoose.connect(process.env.MONGODB_ATLAS_CONNECION);

    var Tenant = mongoose.model('Tenant', require('./schema/tenant.js'), 'tenants');
    var Property = mongoose.model('Property', require('./schema/property.js'), 'properties');

    wagner.factory('Tenant', function(){
        return Tenant;
    });

    wagner.factory('Property', function(){
        return Property
    })

    return {
        Tenant:Tenant,
        Property:Property
    }

}