const { Router } = require('express');
//npm i express-validator
const { check } = require('express-validator');
const { crearProducto,
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

// {{url}}/api/productos
// obtener todas los productos - público
router.get('/', obtenerProductos );

// obtener un producto por id - público
router.get('/:id', [
    check('id','No es un Id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// crear producto - privado - cualquiera con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un Id de Mongo Válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);

// actualizar producto - privado - cualquiera con un token válido
router.put('/:id',[
    validarJWT,
    //check('categoria','No es un Id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

// borrar producto - solo Admin - cualquiera con un token válido
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un Id de Mongo Válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto );


module.exports = router;
