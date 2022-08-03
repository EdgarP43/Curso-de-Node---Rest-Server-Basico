const Role = require('../models');
const { Usuario, Producto} = require('../models');
const Categoria = require('../models')

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
const categoriaExiste = async(id) => {
    //Verificar si el correo existe
    const existeCategoria = await Categoria.findById({id});
    if (!existeCategoria) {
        throw new Error('Esa categoria no esta resgistrado')
        
    }
}
const productoExiste = async(id) => {
    //Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error('Ese producto no esta resgistrado')
        
    }
}
module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    categoriaExiste,
    productoExiste
}