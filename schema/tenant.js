let mongoose = require('mongoose');

var tenantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type:String},
    id_number:{type:String},
    move_in_date: {type: Date, require: true, default: Date.now()},
    move_out_date:{type: Date},
    isActive:{type:Boolean, default: true, require:true},
    rent_amount: {type: Number,  required: true, default: 0},
    outstanding_amount: {type: Number, default:0}
});

module.exports = tenantSchema;
module.exports.tenantSchema = tenantSchema;