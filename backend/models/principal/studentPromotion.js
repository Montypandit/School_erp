const mongoose = require('mongoose');

const studentPromotionSchema = new mongoose.Schema({
    admissionId: { type: String, required: true, unique:true },
    previousClass: [
        {
            class: { type: String, required: true },
            section: { type: String, required: true }
        }
    ],
    currentClass: { type: String, required: true },
},{timestamps:true});

const studentPromotionModel = mongoose.model('StudentPromotion',studentPromotionSchema);

module.exports = studentPromotionModel;