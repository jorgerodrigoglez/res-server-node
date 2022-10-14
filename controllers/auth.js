const { response } = require("express");
// modelo de usuario
const Usuario = require('../models/usuario');
// npm i bcryptjs
const bcrypt = require('bcryptjs');
// genera los tokens de sesiones
const { generarJWT } = require("../helpers/generar-jwt");
// Verigica el token del ID de google en tu servidor
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        // verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(400).json({
                msg : 'El correo no existe - validación email'
            });
        }
        // verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg : 'El usuario no esta activo - estado : false'
            });
        }

        // verificar la contraseña
        const validarPassword = bcrypt.compareSync(password, usuario.password);
        if(!validarPassword){
            return res.status(400).json({
                msg : 'La contraseña no es correcta - verificción de password'
            });
        }
        // crear el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            msg: 'Login OK',
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error al realizar el login'
        })
    }
}

// signin google
const googleSignin = async ( req, res = response ) => {
    const { id_token } = req.body;

    try {
        
        //const googleUser = await googleVerify( id_token );
        const { email, nombre, img } = await googleVerify( id_token );
        //console.log(googleUser);

        let usuario = await Usuario.findOne({ email })
        // Si el usuario no existe creo uno nuevo
        if(!usuario){
            const data = {
                email,
                nombre,
                img,
                password: 'google',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        };

        // si el usuario ha sido borrado - estado:false
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado(borrado de DB) - estado:false'
            })
        }

        // crear el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            //msg: 'SingIn de google correcto',
            //id_token
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token de Google no de pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignin
}