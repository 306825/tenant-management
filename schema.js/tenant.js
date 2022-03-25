let mongoose = require('mongoose');

var tenantSchema = {
    name: {type: String, required: true},
    surname: {type:String},
    id_number:{type:String},
    move_in_date: {type: Date, require: Date.now()},
    move_out_date:{type: Date},
    isActive:{type:Boolean, default: true, require:true},
    rent_amount: {type: Number,  required: true, default: 0},
    outstanding_amount: {type: Number, default:0}
}

module.exports = new mongoose.Schema(tenantSchema);
module.exports.tenantSchema = tenantSchema;