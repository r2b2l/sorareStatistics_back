const CampagneMarketing = require("../models/CampagneMarketing");
const fileStream = require('fs');
const campagneCtrl = {};

campagneCtrl.getCampagnes = async (req, res) => {
    const campagnes = await CampagneMarketing.find();
    res.json(campagnes);
};

campagneCtrl.createCampagne = async (req, res) => {
    const campagneObject = JSON.parse(req.body.campagne);
    delete campagneObject._id;
    const campagne = new CampagneMarketing({
        ...campagneObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    await campagne.save()
        .then(() => res.status(201).json({message: 'objet enregistré!'}))
        .catch(error => res.status(400).json({error}));
};

campagneCtrl.getCampagne = async (req, res) => {
    const campagne = await CampagneMarketing.findById(req.params.id);
    res.json(campagne);
};

campagneCtrl.editCampagne = async (req, res) => {
    const {id} = req.params;
    const campagne = {
        entreprise: req.body.entreprise,
        creneau: req.body.creneau,
        debutCampagne: req.body.debutCampagne,
        finCampagne: req.body.finCampagne,
        imageUrl: req.body.imageUrl
    };
    await CampagneMarketing.findByIdAndUpdate(id, {$set: campagne}, {new: true})
    res.json({status: 'campagne mise a jour '})
};

campagneCtrl.modifyThing = (req, res, next) => {
    const campagneObject = req.file ?
        {
            ...JSON.parse(req.body.campagne),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    CampagneMarketing.updateOne({_id: req.params.id}, {...campagneObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

campagneCtrl.deleteCampagne = (req, res, next) => {
    CampagneMarketing.findOne({_id: req.params.id})
        .then(campagne => {
            const filename = campagne.imageUrl.split('/images/')[1];
            fileStream.unlink(`images/${filename}`, () => {

                CampagneMarketing.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};

campagneCtrl.getCreneau = async (req, res) => {
    var query = req.params.query;
    const heure = await CampagneMarketing.find({'creneau': query});
    res.json(heure);
};

campagneCtrl.getCampagnesEnDirect = async (req, res) => {
    const creneauxHeures = {
        1 : {start : 1, end : 5},
        2 : {start : 5, end : 8},
        3 : {start : 8, end : 11},
        4 : {start : 11, end : 15},
        5 : {start : 15, end : 18},
        6 : {start : 18, end : 22},
        7 : {start : 22, end : 25}
    };
    const dateActuelle = new Date();
    dateActuelle.setMinutes(dateActuelle.getMinutes() + 60);
    let heureActuelle = dateActuelle.getUTCHours();
    let creneau = null;
    for (let key of Object.keys(creneauxHeures)) {
        if (key === '7' && heureActuelle === 0) {
            heureActuelle = heureActuelle + 24;
        }
        if (heureActuelle < creneauxHeures[key].end && heureActuelle >= creneauxHeures[key].start) {
            creneau = key;
            break;
        }
    }
    console.log(creneau);
    let campagnesEnCours = await CampagneMarketing.find({
        'creneau': creneau,
        'debutCampagne': {$lte: dateActuelle},
        'finCampagne': {$gte: dateActuelle}
    });
    res.json(campagnesEnCours);
}

campagneCtrl.getCreneauActif = async (req, res) => {
    var query = req.params.query;
    var date = new Date();
    const heure = await CampagneMarketing.find({
        'creneau': query,
        'debutCampagne': {$lte: date},
        'finCampagne': {$gte: date}
    });
    res.json(heure);
};

campagneCtrl.getCreneauNonActif = async (req, res) => {
    var query = req.params.query
    var date = new Date();
    const heure = await CampagneMarketing.find({
        'creneau': query, $or: [
            {'debutCampagne': {$gte: date}},
            {'finCampagne': {$lte: date}}
        ]
    });
    res.json(heure);
};


module.exports = campagneCtrl;
