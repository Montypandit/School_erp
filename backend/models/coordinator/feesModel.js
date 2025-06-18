const mongoose = require('mongoose');

const feesSchema = mongoose.Schema({
    recietId:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    class:{type:String, required:true},
    fatherName:{type:String, required:true},
    gender:{type:String},
    totalAmount:{type:String, required:true},
    paidAmount:{type:String, required:true},
    dueAmount:{type:String, required:true},

},{timestamps:true});

const feesModel= mongoose.model('FEES',feesSchema);
module.exports = feesModel;