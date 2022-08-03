const { response } = require("express");
const { Categoria } = require('../models')


//Obtener categorias - paginar - limite
const categoriasGet = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        categorias
    });
}

//Obtener una categoria
const especificaGet = async(req, res = response) => {

    const {id} = req.params;

    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const categoria = await Categoria.findById( id )
    res.json({
        categoria
    })

}

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

        if (categoriaDB){
            return res.status(400).json({msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria ( data );

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

//Actualizar categoria 
const categoriasPut = async (req, res = response) => {
    
    const {id}= req.params;
    const {nombre, estado, usuario, ... resto } = req.body;
    
    resto.nombre = nombre.toUpperCase();
    resto.usuario = usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate( id, resto, {new: true});

    res.json({
        categoria
    })
}
//eliminar Categoria
const categoriaDelete = async(req, res = response) => {
    
    const {id}= req.params;

    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const categoria = await Categoria.findByIdAndUpdate( id, {estado: false})
    res.json({
        categoria
    })
}

module.exports = {
    crearCategoria,
    categoriasGet,
    especificaGet,
    categoriasPut,
    categoriaDelete
}