const { response } = require("express");
const { Producto } = require('../models')


//Obtener Productos - paginar - limite
const productosGet = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}

//Obtener una Producto
const productoGet = async(req, res = response) => {

    const {id} = req.params;

    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const producto = await Producto.findById( id )
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre')
    res.json({
        producto
    })

}

const crearProducto = async (req, res = response) => {
    const {estado, usuario, ...body}  = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if (productoDB){
        return res.status(400).json(
        {
            msg: `La categoria ${productoDB.nombre} ya existe`
        })
    }
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }

    const producto = new Producto ( data );

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

//Actualizar Producto 
const ProductosPut = async (req, res = response) => {
    
    const {id}= req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate( id, data, {new: true});

    res.json({
        producto
    })
}
//eliminar Producto
const ProductoDelete = async(req, res = response) => {
    
    const {id}= req.params;

    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const producto = await Producto.findByIdAndUpdate( id, {estado: false})
    res.json({
        producto
    })
}

module.exports = {
    crearProducto,
    productosGet,
    productoGet,
    ProductosPut,
    ProductoDelete
}