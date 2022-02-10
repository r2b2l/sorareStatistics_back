const mongoose = require('mongoose');

const campagneMarketingSchema = mongoose.Schema({
    entreprise: {type: String, required: true},
    creneau: {type: Number, required: true},
    debutCampagne: {type: Date, required: true},
    finCampagne: {type: Date, required: true},
    imageUrl: {type: String, required: true},
});

module.exports = mongoose.model('CampagneMarketing', campagneMarketingSchema);