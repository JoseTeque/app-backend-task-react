const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const { check } = require('express-validator');
const auth = require('../middleware/autenticacion');

//Crea tarea
//api/tareas
router.post('/', 
    auth, 
    [
        check('nombreTarea', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto de la tarea es obligatorio').not().isEmpty()
    ],
    tareasController.crearTarea);

// OBTENER LAS TAREAS
router.get('/',
    auth,
    tareasController.obtenerTareas)

// ACTUALIZAR UNA TAREA
router.put('/:id', 
    auth,
    tareasController.actualizarTarea    
)

// Eliminar tarea
router.delete('/:id',
    auth,
    tareasController.eliminarTarea  
)

module.exports = router;