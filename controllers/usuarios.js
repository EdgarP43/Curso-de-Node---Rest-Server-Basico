const {response } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');


const usuariosGet = async(req, res = response) => {
    //const {q,nombre='no name',apikey, limit, page='1'} = req.query;
    
    const {limite = 5, desde = 0} = req.query;

    const [total, resp] = await Promise.all([
        Usuario.countDocuments({estado : true}),
        Usuario.find({estado : true})
        .limit(limite)
        .skip(desde)
    ])

    res.json({
        total,
        resp
    })
}
const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password,rol} = req.body;
    const usuario = new Usuario({nombre, correo, password,rol});

    //Encriptar la contraseña 
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    //Guardar en DB
    await usuario.save();
    
    res.json({
        usuario
    })
}
const usuariosPut = async (req, res = response) => {
    
    const {id}= req.params;
    const {_id, password, google, correo, ...resto } = req.body;
    
    //TODO validar contra base de datos
    if( password){
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true});

    res.json({
        usuario
    })
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    })
}
const usuariosDelete = async(req, res = response) => {
    
    const {id}= req.params;

    //const usuario = await Usuario.findByIdAndDelete(id);
    
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false})

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}