const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');




router.post('/signup', userCtrl.signup, );
router.post('/signup-admin', userCtrl.signupAdmin);
router.post('/login', userCtrl.login);
router.post('/login-admin', userCtrl.loginAdmin  );
router.get('/users', userCtrl.getUser);
router.delete('/users/:id', userCtrl.deleteUser);

module.exports = router;