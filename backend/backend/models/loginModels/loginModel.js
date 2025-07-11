const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true}
},{timestamps:true});

const userLogin = mongoose.model('USERLOGIN',loginSchema);
module.exports = userLogin;