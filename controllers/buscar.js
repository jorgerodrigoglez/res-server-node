const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'roles',
    'categorias',
    'productos'
];

const buscarUsuarios = async ( termino = '', res = response ) => {
    const isMongoID =  ObjectId.isValid( termino ); //TRUE

    if(isMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [ usuario ] : [],
        });
    }

    // expresión regular para que los termino de búsqueda sean insensibles a minusculas y mayusculas
    // y busque por palabra única en caso de que estas estén separadas por espacio
    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({ 
        /*nombre: -/termino/- regex */
        $or: [ {nombre: regex, estado: true}, { email: regex } ],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async ( termino = '', res = response ) => {
    const isMongoID =  ObjectId.isValid( termino ); //TRUE

    if(isMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [ categoria ] : [],
        });
    }

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });
}

const buscarProductos = async ( termino = '', res = response ) => {
    const isMongoID =  ObjectId.isValid( termino ); //TRUE

    if(isMongoID){
        const producto = await Producto.findById(termino)
            .populate('categoria','nombre');
        return res.json({
            results: (producto) ? [ producto ] : [],
        });
    }

    const regex = new RegExp( termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria','nombre');

    res.json({
        results: productos
    });
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        res.status(400).json({
            msg: `Las colecciones permitas son: ${ coleccionesPermitidas }`
        })
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'No se pudo realizar la búsqueda solicitada'
            });
    }

    /*res.json({
        //msg: 'buscar...',
        coleccion,
        termino
    })*/
}

module.exports = {
    buscar
}

