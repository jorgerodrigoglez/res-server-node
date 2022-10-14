// middleware de validación de campos
const validarCampos = require('./validar-campos');
// validacion de JWT - si esta logeado o estado = true/false
const validarJWT = require('./validar-jwt');
// verifica el rol
const validarRoles = require('./validar-roles');
// verifica si se esta enviando un archivo 
const validarArchivo = require('./validar-archivo')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo
}