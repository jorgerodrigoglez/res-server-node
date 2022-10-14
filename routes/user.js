const { Router } = require('express');
//npm i express-validator
const { check } = require('express-validator');
// middleware de validación de campos
//const { validarCampos } = require('../middlewares/validar-campos');
// validacion de JWT - si esta logeado o estado = true/false
//const { validarJWT } = require('../middlewares/validar-jwt');
// verifica el rol
//const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole    
} = require('../middlewares');

// modelo para verificación de roles creados en DDBB ...
//const Role = require('../models/role');
const { esRolValido, comprobarSiEmailExiste, existeElUsuarioId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.post('/',[
        // express-validator
        // middleware, le especifico el campo del body que necesito validar
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser al menos de 6 letras').isLength({ min:6 }),
        check('email','El email no es válido').isEmail(),
        check('email').custom( comprobarSiEmailExiste ),
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        // IDEM : check('rol').custom( (rol) => esRolValido(rol) ),
        check('rol').custom( esRolValido ),
        // middleware de validación de campos
        validarCampos
],usuariosPost);

router.put('/:id', [
        check('id','El ID es invalido porque no existe en la BD').isMongoId(),
        check('id').custom( existeElUsuarioId ),
        check('rol').custom( esRolValido ),
        validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'),
        check('id','El ID es invalido porque no existe en la BD').isMongoId(),
        check('id').custom( existeElUsuarioId ),
        validarCampos
], usuariosDelete);


module.exports = router;