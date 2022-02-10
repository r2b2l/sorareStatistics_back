var express = require('express');
var router = express.Router();
const multer = require('../middleware/multer-config');
var CampagneMarketing = require ('../models/CampagneMarketing.js');


 const campagne = require('../controllers/campagnemarketing.controller');
 const role = require('../controllers/user');
 

router.get('/', campagne.getCampagnes,);
router.get('/live', campagne.getCampagnesEnDirect)
router.post('/', multer, campagne.createCampagne);
router.get('/:id', campagne.getCampagne);
router.put('/:id', multer, campagne.modifyThing);
router.delete('/:id', campagne.deleteCampagne);
router.get('/creneau/live', campagne.getCampagnesEnDirect)
router.get('/creneau/:query', campagne.getCreneau)
router.get('/creneau/date/actif/:query', campagne.getCreneauActif)
router.get('/creneau/date/nonactif/:query', campagne.getCreneauNonActif)


module.exports = router;