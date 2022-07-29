const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generaJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const {correo, password } = req.body;

    try{

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario)  {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Correo'
            })
        }
        //Si el usuarios esta activo 
        if (!usuario.estado)  {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Estado: false'
            })
        }
        //Verificar la contraseña
        const validPassword = bcrypt.compareSync( password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Contraseña'
            })
        }

        //Generar el JWT
        const token = await generaJWT(usuario.id)

        res.json({
            usuario, 
            token
        })
    } catch (error){
        console.log(error)
        return res.status(500).json({
            msg:'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}