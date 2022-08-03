const { Router } = require('express');
const { check } = require('express-validator');
const { productosGet, productoGet, crearProducto, ProductosPut, ProductoDelete } = require('../controllers/productos');
const { productoExiste, categoriaExiste } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();

router.get('/', productosGet);
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( productoExiste ),
    validarCampos,
],  productoGet);
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    validarCampos
],  crearProducto);
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( productoExiste ),
    validarCampos
], ProductosPut);
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( productoExiste ),
    validarCampos,
], ProductoDelete);
module.exports = router;
