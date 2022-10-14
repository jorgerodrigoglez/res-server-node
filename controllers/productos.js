const { response } = require("express");
const { Producto } = require('../models');

// obtener productos - paginado - total - populate
const obtenerProductos = async ( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true };

    const [ total, productos ] = await Promise.all([
       Producto.countDocuments( query ),
       Producto.find( query )
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .limit(Number(limite))
            .skip(Number(desde))
    ]);

    res.json({
        total,
        productos,
    });

}

// obtener producto - populate
const obtenerProducto = async (req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById( id )
        .populate('usuario','nombre')
        .populate('categoria','nombre')

    res.json(producto);
}

const crearProducto = async (req, res=response, next) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre });

    if( productoDB ){
        return res.status(400).json({
            msg: `La categoría ${productoDB.nombre}, ya existe`
        })
    }

    // generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //console.log(data);
    const producto = new Producto(data);
    await producto.save();

    res.status(200).json( producto );

}

// actualizar categoria
const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});
    res.json(producto);
}

// borrar categoría - cambiar estado a false
const borrarProducto = async(req,res = response) => {
    const { id } = req.params;
    const productoBorrada = await Producto.findByIdAndUpdate(id, { estado:false }, { new:true });
    res.json(productoBorrada);
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}