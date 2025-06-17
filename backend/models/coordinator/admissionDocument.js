const mongoose = require('mongoose');

const documentSubmit = mongoose.Schema({
    admissionId:{type:String,required:true},
    documentType:{type:String, required:true},
    documentUrl:{type:String, required:true}
},{timestamps:true});

const documentSchema = mongoose.model('DOCUMENTSCHEMA',documentSubmit);
module.exports = documentSchema;
