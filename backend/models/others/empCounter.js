// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
},{timestamps:true});

const empCounter = mongoose.model('EMPCOUNTER', counterSchema);

module.exports = empCounter;
