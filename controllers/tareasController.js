const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

// Crear Tarea
exports.crearTarea = async(req,res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extrae el proyecto y comprueba si existe
    const { proyecto } = req.body;

    try {

        const proyectoId = await Proyecto.findById(proyecto);
        if(!proyectoId){
           return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertnece al usuario autenticado
         // verificar el creador del proyecto
         if(proyectoId.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);

        // Guardamos la tarea con el creador
        await tarea.save();
        res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtener Tareaspor proyecto
exports.obtenerTareas= async (req, res) => {

    try {

         // extrae el proyecto y comprueba si existe
        const { proyecto } = req.query;

        const proyectoId = await Proyecto.findById(proyecto);
        if(!proyectoId){
           return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertnece al usuario autenticado
         // verificar el creador del proyecto
         if(proyectoId.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // obetener las taras por proyecto
        const tareas = await Tarea.find({proyecto})
        res.json({tareas});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}

// ACTUALIZAR TAREA
exports.actualizarTarea = async (req, res) => {

    try {
        // extrae el proyecto y comprueba si existe
        const { proyecto, nombreTarea, estado } = req.body;

        // Revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No Existe la tarea'});
        }

        // Extraer proyecto
        const proyectoId = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertnece al usuario autenticado
        // verificar el creador del proyecto
        if(proyectoId.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // crear un objeto con la nueva informacion
        const nuevaTarea = {};
        
        nuevaTarea.nombreTarea = nombreTarea;
        nuevaTarea.estado = estado;


        // Guardar la nueva Tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({tarea});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}

// Eliminar Tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // extrae el proyecto y comprueba si existe
        const { proyecto } = req.query;

        // Revisar si la tarea existe o no
        let tareaExiste = await Tarea.findById(req.params.id);
        if(!tareaExiste){
            return res.status(404).json({msg: 'No Existe la tarea'});
        }

        // Extraer proyecto
        const proyectoId = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertnece al usuario autenticado
        // verificar el creador del proyecto
        if(proyectoId.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Eliminar Tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.status(200).json({msg: 'Se elimino la tarea con exito'});
        

        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}