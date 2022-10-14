const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', validarArchivo, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id','El Id debe de ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary );
//], actualizarImagen );

router.get('/:coleccion/:id', [
    check('id','El Id debe de ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen);

module.exports = router;