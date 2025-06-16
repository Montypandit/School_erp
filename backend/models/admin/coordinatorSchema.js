const mongoose = require('mongoose');

const coordinatorSchema = mongoose.Schema({
    empId:{type:String, required:true, unique:true},
    name:{type:String, required:true},
})