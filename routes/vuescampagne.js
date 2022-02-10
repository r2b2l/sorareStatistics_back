const express = require('express');
const router = express.Router();

const vuesCampagneController = require('../controllers/vuescampagne.controller');

router.get('/:id', vuesCampagneController.getVueCampagne);
router.post('/', vuesCampagneController.create);
router.post('/many', vuesCampagneController.incrementVues);

module.exports = router;