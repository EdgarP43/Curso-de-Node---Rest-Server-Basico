const {Schema, model} = require('mongoose');
const CategoriaSchema = Schema ({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function(){
    const {__v, _id, ... categoria } = this.toObject();
    categoria.uid = _id
    return categoria
}

module.exports = model('Categoria', CategoriaSchema);