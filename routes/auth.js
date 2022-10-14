const { Router } = require('express');
//npm i express-validator
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
// controlador del login
const { login, googleSignin } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email','El email es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token','Id Token de google es necesario').not().isEmpty(),
    validarCampos
], googleSignin);

module.exports = router;