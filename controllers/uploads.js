const path = require("path");
const fs = require("fs");
// npm i cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async ( req, res = response) => {

    try {
        const nombre = await subirArchivo( req.files, /*['txt','md']*/ undefined , 'imgs' );
        res.json( { nombre } );
    } catch (msg) {
        res.status(400).json({ msg });
    }   

}

const actualizarImagen = async ( req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    // validar si el usuario o producto exite en bd
    // si exite generamos el modelo
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con Id: ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con Id: ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // actualizar imagen previa, para evitar repeticiones
    if( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync(pathImage) ){
            fs.unlinkSync(pathImage)
        }
    }

    // subir archivo a db con su nombre y colección
    const nombre = await subirArchivo( req.files, undefined , coleccion );
    modelo.img = nombre;
    // grava de bd nombre del archivo - img - subido
    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    // validar si el usuario o producto exite en bd
    // si exite generamos el modelo
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con Id: ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con Id: ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // actualizar imagen previa, para evitar repeticiones
    if( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImage = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( pathImage ) ){
            // hay que modificarlo
            return res.sendFile(pathImage)
        }
    }

    // hay que modificarlo
    /*res.json({
        msg: 'falta placeholder'
    });*/
    const pathNoImage = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathNoImage );
}

const actualizarImagenCloudinary  = async ( req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    // validar si el usuario o producto exite en bd
    // si exite generamos el modelo
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con Id: ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con Id: ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    // actualizar imagen previa, para evitar repeticiones
    if( modelo.img ){
       const nombreArr = modelo.img.split('/');
       const nombre = nombreArr[ nombreArr.length -1 ];
       const [ public_id ] = nombre.split('.');
       cloudinary.uploader.destroy( public_id );
    }

    //console.log(req.files.archivo);
    const { tempFilePath } = req.files.archivo;
    //const resp = await cloudinary.uploader.upload( tempFilePath );
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;

    // grava de bd nombre del archivo - img - subido
    await modelo.save();

    //res.json(resp);
    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}