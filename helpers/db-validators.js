// modelo para verificación del usuario de la BBDD creados en DDBB
const { Categoria, Usuario, Producto } = require('../models');
// modelo para verificación de roles creados en DDBB
const Role = require('../models/role');


const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if(!existeRol){
            throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const comprobarSiEmailExiste = async (email = '' ) => {
    const existeEmail = await Usuario.findOne({ email });
    
    if(existeEmail){
        throw new Error(`El email ${email} ya está registrado en la BD`);
    }
}

const existeElUsuarioId = async (id) => {
    const existeIdUsuario = await Usuario.findById( id );
    
    if( !existeIdUsuario ){
        throw new Error(`El ID de Usuario: ${id} no existe`);
    }
}

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById( id );
    
    if( !existeCategoria ){
        throw new Error(`El ID de Categoría: ${id} no existe`);
    }
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById( id );
    
    if( !existeProducto ){
        throw new Error(`El ID de Producto: ${id} no existe`);
    }
}

// Validar colecciones de tipo de archivos que se pueden subir a la BBDD
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    // validacion de coleccion permitida
    const coleccionPermitida = colecciones.includes(coleccion);
    if(!coleccionPermitida){
        throw new Error(`La coleccion ${coleccion} no es permitida`);
    }
    
    return true;
}

module.exports = {
    esRolValido,
    comprobarSiEmailExiste,
    existeElUsuarioId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}