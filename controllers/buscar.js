const { response } = require('express');
const { isValidObjectId, ObjectId } = require('mongoose');
const categoria = require('../models/categoria');
const { Usuario, Producto, Categoria} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID =  isValidObjectId( termino)
    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            resuls: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp( termino, 'i');
    const usuarios = await Usuario.find({
        $or: [
            {nombre: regex}, 
            {correo: regex}
        ],
        $and: [ {estado: true}]
    })

    res.json({
        results: usuarios
    })
}
const buscarProductos = async( termino = '', res = response) => {

    const esMongoID =  isValidObjectId( termino)
    if( esMongoID ){
        const producto = await Producto.findById(termino);
        return res.json({
            resuls: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp( termino, 'i');
    const productos = await Producto.find({
        $or: [
            {nombre: regex}, 
        ],
        $and: [ {estado: true}]
    })

    res.json({
        results: productos
    })
}
const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID =  isValidObjectId( termino)
    if( esMongoID ){
        const categoria = await Categoria.findById(termino).populate('categoria','nombre');
        return res.json({
            resuls: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp( termino, 'i');
    const categorias = await Categoria.find({
        $or: [
            {nombre: regex}, 
        ],
        $and: [ {estado: true}]
    })
    .populate('categoria','nombre')
    res.json({
        results: categorias
    })
}

const buscar = async(req, res = response) => {

    const { coleccion , termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)){
        res.status(400).json({
            msg:`Las colecciones permitidas son: ${ coleccionesPermitidas}`
        })
    }

    switch (coleccion){
        case 'usuarios':
            await buscarUsuarios(termino, res)
        break;
        case 'categorias':
            await buscarCategorias(termino, res)
        break;
        case 'productos':
            await buscarProductos(termino, res)
        break;

        default: 
            res.status(500).json({
                masg: 'Se le olvido hacer esta busqueda'
            })
    }

    
}

module.exports = {
    buscar
}