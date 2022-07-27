const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
        if (!existeRol){
            throw new Error(`El rol ${rol} no esta registrado en la bd`)
        }
}
const emailExiste = async(correo = '') => {
    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo: correo});
    if (existeEmail) {
        throw new Error('Ese correo ya esta resgistrado')
        
    }
}
const existeUsuarioPorId = async(id) => {
    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error('ese Usuario no esta resgistrado')
        
    }
}
module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}