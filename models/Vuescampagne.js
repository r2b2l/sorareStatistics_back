const mongoose = require('mongoose');
const mangoose = require("mongoose");

const suiviVuesSchema = mongoose.Schema(
    {
        campagneId: {type: mangoose.Schema.Types.ObjectID, ref:'CampagneMarketing', required: true},
        entreprise: {type: String, required: true},
        creneau: {type: Number, required: true},
        dateChaine: {type: String, required: true},
        nbvues: {type: Number, required: true}
    }
);

module.exports = mongoose.model('Vuescampagne', suiviVuesSchema);