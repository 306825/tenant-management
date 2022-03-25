let mongoose = require('mongoose');

module.exports = function (wagner){

    mongoose.connect(process.env.MONGODB_ATLAS_CONNECION);

    var Tenant = mongoose.model('Tenant', require('./schema/tenant.js'), 'tenants');

    wagner.factory('Tenant', function(){
        return Tenant;
    });

    return {Tenant:Tenant}

}