const { response, json } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generaJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;

    try{
        const {nombre, img, correo } =  await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo})

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ';P',
                img,
                rol: 'USER_ROLE',
                google: true,
              };
            usuario = new Usuario ( data );
            await usuario.save();
        }

        //Si el usuario en base de datos
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar JWT
        const token = await generaJWT(usuario.id);

        res.json ({ 
            usuario,
            token
        })
    } catch(err){
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

    
}

module.exports = {
    login,
    googleSignIn
}