const { Router} = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosDelete,
        usuariosPut, usuariosPost, 
        usuariosPatch } = require('../controllers/usuarios');

const { esRoleValido, emailExiste,
        existeUsuarioPorId } = require('../helpers/db-validators');

//const { validarCampos } = require('../middleware/validar-campos');
//const { validarJWT } = require('../middleware/validar-jwt');
//const { esAdminRole, tieneRole } = require('../middleware/validar-roles');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middleware')

const router = Router();

router.get('/', usuariosGet) ;
router.put('/:id', [
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido),
    validarCampos 
    ],
    usuariosPut) ;
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido),
    validarCampos
]
, usuariosPost) ;
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId)
    ] 
    ,usuariosDelete) ;
router.patch('/', usuariosPatch );

module.exports = router;