const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, categoriasGet, especificaGet, categoriasPut, categoriaDelete } = require('../controllers/categorias');
const { categoriaExiste } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();


//obtener todas las categorias - publico 
router.get('/', categoriasGet)

// obtener una categoria en particular 
router.get('/:id', 
    [ 
        //check('id').custom(categoriaExiste),
        check('id','No es un id valido').isMongoId(),
        validarCampos,
    ],
    especificaGet)

//Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
    ], crearCategoria )

//Actualizar un registro por este id - cualquier rol valido 
router.put('/:id', 
    [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
     categoriasPut)

//borrar una categoria - administrador 
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un id de Mongo válido').isMongoId(),
        validarCampos
    ]
    ,categoriaDelete)


module.exports = router;