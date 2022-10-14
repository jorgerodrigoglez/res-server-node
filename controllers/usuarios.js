const { response, request } = require('express');
// npm i bcryptjs
const bcrypt = require('bcryptjs');
// models/usuario
const Usuario = require('../models/usuario');
const { countDocuments } = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    //const query = req.query;
    //const { q, nombre='no name', apiKey, page = 1, limit } = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true };

    // forma sincrona la segunda promesa depende del tiempo que tarde la primera en contestar
    /*const usuarios = await Usuario.find( query )
        .limit(Number(limite))
        .skip(Number(desde));

    const total = await Usuario.countDocuments( query );*/

    // IDEM: se lanzan las 2 promesas a la vez de forma asincrona
    //const resp = await Promise.all([
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .limit(Number(limite))
            .skip(Number(desde))
    ]);

    res.json({
        total,
        usuarios,
        //resp
    });

    /*res.json(
        {
            msg: 'get API - controlador',
            //query,
            q,
            nombre,
            apiKey,
            page,
            limit
        }
    );*/
};

const usuariosPost = async(req = request, res = response) => {
   
    /* express-validator - validacion de errores - routes/user
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }*/
      
    // const body = req.body;
    const { nombre, email, password, rol } = req.body;
    // models/usuario
    const usuario = new Usuario( {nombre, email, password, rol} );

    // -- encriptacion de contraseña -- //
    // verificar que el correo existe
    /*const existeEmail = await Usuario.findOne({ email });
    if(existeEmail){
        return res.status(400).json({
            msg: 'Ese correo ya está registrado'
        })
    }*/

    // encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );
    // Guardar en BBDD
    await usuario.save();

    res.json(
        {
            //msg: 'post API - controlador',
            usuario
            //body,
            //nombre,
            //edad
        }
    );
};

const usuariosPut = async(req, res = response) => {

    //const id = req.params.id;
    const {id} = req.params;
    const { _id, password, google, email, ...resto} = req.body;

    // validar y encriptar password en DB
    if( password ){
        // encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );
    }
    // actualizar el modelo usuario - modificar por id y añadir el resto
    const updateUsuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(updateUsuario);

    /*res.json(
        {
            //msg: 'put API - controlador',
            //id
            updateUsuario
        }
    );*/
};

const usuariosPatch = (req, res) => {

    res.json(
        {
            msg: 'patch API - controlador'
        }
    );
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    // jwt
    //const uid = req.uid;

    // lo borramos fisicamente de la DB
    //const deleteUsuario = await Usuario.findByIdAndDelete(id); - borra el objeto completo
    const deleteUsuario = await Usuario.findByIdAndUpdate( id, { estado: false});
    // usuario autenticado
    //const usuarioAutenticado = req.usuario;

    res.json(
        {
            //msg: 'delete API - controlador'
            //id,
            deleteUsuario,
            //uid
            //usuarioAutenticado
        }
    );
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}