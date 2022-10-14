//npm i express-validator
const { validationResult } = require('express-validator');

// se ejecuta en routes/user.js - en validaciones
const validarCampos = ( req, res, next) => {
      // express-validator - validacion de errores - routes/user
      const errors = validationResult(req);
      if( !errors.isEmpty() ){
          return res.status(400).json(errors);
      }

      next();
}

module.exports = {
    validarCampos,
}