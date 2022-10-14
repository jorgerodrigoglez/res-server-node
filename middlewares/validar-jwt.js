const { request, response } = require("express");
// npm i jsonwebtoken
const jwt = require('jsonwebtoken');
// modelo de usuario
const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    // se puede poner a la key del token cualquier nombre
    const token = req.header('xxx_token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }
    
    //console.log(token);
    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        //console.log(payload);
        //req.uid = uid;

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario no existe en la base de datos',
            })
        }

        // verificar que el usuario uid no ha sido borrado, y su estado es true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Toque no válido - usuario borrado con estado = false',
            })
        }


        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}