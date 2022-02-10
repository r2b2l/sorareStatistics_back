const vuesCampagne = require('../models/Vuescampagne');
const campagneMarketing = require('../models/CampagneMarketing');
const vuescampagneCtrl = {};

const DelaiCallImages = 600;

/**
 * GET Simple d'une vue
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
vuescampagneCtrl.getVueCampagne = async (req, res) => {
    const vueCampagne = await vuesCampagne.findById(req.params.id);
    res.json(vueCampagne);
};

/**
 * Ajout simple d'une vue en + à une campagne
 * Si existante, on incremente
 * Si non existante, on cree la vue
 * @param request
 * @param res
 * @returns {Promise<void>}
 */
vuescampagneCtrl.create = async (request, res) => {
    const body = request.body;

    let searchedVueCampagne = await vuesCampagne.find({
        campagneId: body.campagneId,
        creneau: body.creneau,
        dateChaine: body.dateChaine
    });

    if (searchedVueCampagne.length < 1) {
        date = new Date;
        const vueCampagne = new vuesCampagne({
            campagneId: body.campagneId,
            entreprise: body.entreprise,
            creneau: body.creneau,
            dateChaine: date.getDate() + '-' + date.getMonth()+1 + '-' + date.getFullYear(),
            nbvues: 1
        });

        await vueCampagne.save()
            .then(() => res.status(201).json(vuesCampagne))
            .catch(error => {
                console.log(error.errors);
                res.status(400).json(error.message)
            });
    } else if (searchedVueCampagne.length === 1) {
        let vueToUpdate = searchedVueCampagne[0];
        vueToUpdate.nbvues = vueToUpdate.nbvues + 1;
        let result = await vuesCampagne.updateOne({
            _id: vueToUpdate._id
        }, {
            nbvues : vueToUpdate.nbvues
        })
        res.status(200).json(vueToUpdate);
    } else {
        console.log('Plusieurs entrées repérées pour la demande.');
        res.status(400).json({message : 'Plusieurs entrées repérées pour la demande.'});
    }
};

/**
 * Incremente le nombre de vues des campagnes precisses dans le tableau campagnes du JSON
 * @param request
 * @param res
 * @returns {Promise<void>}
 */
vuescampagneCtrl.incrementVues = async (request, res) => {
    const body = request.body;
    toIncrementCampagnes = body.campagnes;
    date = new Date;
    for (const campagne of toIncrementCampagnes) {
        /**
         * Si Vue existante => On rajoute le calcul au nombre de vues déja saisies
         * Si vue non exsitante => On cree la vue et on met le nombre de vues en 10mn
         */
        let searchedVueCampagne = await vuesCampagne.find({
            campagneId: campagne,
            creneau: body.creneau,
            dateChaine: date.getDate() + '-' + date.getMonth()+1 + '-' + date.getFullYear()
        });
        if (searchedVueCampagne.length < 1) {
            date = new Date;
            const vueCampagneMarketing = await campagneMarketing.findById(campagne).exec();
            const vueCampagne = new vuesCampagne({
                campagneId: campagne,
                entreprise: vueCampagneMarketing.entreprise,
                creneau: body.creneau,
                dateChaine: date.getDate() + '-' + date.getMonth()+1 + '-' + date.getFullYear(),
                nbvues: Math.round(DelaiCallImages / toIncrementCampagnes.length / 10)
            });
            await vueCampagne.save()
                .then()
                .catch(error => {
                    console.log(error.errors);
                    res.status(400).json(error.message)
                });
        } else if (searchedVueCampagne.length === 1) {
            let vueToUpdate = searchedVueCampagne[0];
            vueToUpdate.nbvues = vueToUpdate.nbvues + (Math.round(DelaiCallImages / toIncrementCampagnes.length / 10));
            let result = await vuesCampagne.updateOne({
                _id: vueToUpdate._id
            }, {
                nbvues : vueToUpdate.nbvues
            }).catch(error => {
                console.log(error.errors);
                res.status(400).json(error.message)
            })
        }
    }
    res.status(200).json({message: 'OK'});
};

module.exports = vuescampagneCtrl;
