// RUTAS PARA AUTENTICAR USUARIO
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/autenticacion');

// Iniciar sesion
// api/auth
router.post('/', 
    authController.authUsuario
);

// Obtiene el usuario autenticado
router.get('/',
         auth,
         authController.obtieneUsuario
    )


module.exports = router;