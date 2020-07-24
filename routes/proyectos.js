const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const auth =require('../middleware/autenticacion');
const {check} = require('express-validator');

//Crea proyectos
//api/proyectos
router.post('/',
            auth, 
            [
                check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
            ],
            proyectosController.crearProyecto);

// Obtener todos los proyectos
router.get('/',
            auth, 
            proyectosController.obtenerProyectos);

// ACTUALIZA PROYECTO
router.put('/:id', 
            auth,
            [
                check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
            ],
            proyectosController.actualizarProyecto)

// ELIMINAR UN PROYECTO
router.delete('/:id', 
            auth,
            proyectosController.eliminarProyecto)

module.exports = router;
