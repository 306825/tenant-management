const mongoose = require('mongoose');
const models = require('../models');
const tenant = require('./tenant');

const propertySchema = new mongoose.Schema({
    name: {type: String, required: true},
    property_type: {type: String,enum: ['Single Tenant House', 'Multi Tenant House', 'Apartment Block', 'Apartment', 'Cortage Set'] },
    max_number_of_tenants: {type: Number, default: 1},
    tenants: [{type: mongoose.Schema.Types.ObjectId, ref:'Tenant'}]
});

propertySchema.methods.addTenantId = function(id){
    this.tenants.push(id);
    this.save();
}

module.exports = propertySchema;
module.exports.propertySchema = propertySchema;