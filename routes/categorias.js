const { Router } = require('express');
//npm i express-validator
const { check } = require('express-validator');
const { crearCategoria,
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// {{url}}/api/categorias
// obtener todas las categorias - público
router.get('/', obtenerCategorias );

// obtener una categoria por id - público
router.get('/:id', [
    check('id','No es un Id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria );

// crear categoría - privado - cualquiera con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// actualizar categoría - privado - cualquiera con un token válido
router.put('/:id',[
    validarJWT,
    check('id','No es un Id de Mongo Válido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

// borrar categoría - solo Admin - cualquiera con un token válido
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un Id de Mongo Válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria );


module.exports = router;

