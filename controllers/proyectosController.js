const Proyectos = require('../models/Proyecto');
const {validationResult} = require('express-validator');

// CREA PROYECTO
exports.crearProyecto = async (req,res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    try {
        const proyecto = new Proyectos(req.body);

        // Guardar el creador via jwt
        proyecto.creador = req.usuario.id

        // Guardamos el proyecto con el creador
        proyecto.save();
        res.json(proyecto)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// OBTIENE TODOS LOS PROYECTOS DEL USUARIO ACTUAL
exports.obtenerProyectos = async(req,res) => {
    try {
        
        const proyectos = await Proyectos.find({ creador: req.usuario.id}).sort({creado: -1});

        res.json(proyectos)

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error..'})
    }
}

// ACTUALIZAR UN PROYECTO
exports.actualizarProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extrae la informacion del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        
        // revisar el ID
        let proyecto = await Proyectos.findById(req.params.id);

        // si el proyecto existe o no
        if(!proyecto){
            res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // actualizar
        proyecto = await Proyectos.findByIdAndUpdate({_id: req.params.id }, {$set: nuevoProyecto}, { new: true});

        res.json({proyecto});


    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error..'});
    }
}

// ELIMINAR UN PROYECTO
exports.eliminarProyecto = async (req, res) => {

    try {
         // revisar el ID
         let proyecto = await Proyectos.findById(req.params.id);

         // si el proyecto existe o no
         if(!proyecto){
             res.status(404).json({msg: 'Proyecto no encontrado'});
         }
 
         // verificar el creador del proyecto
         if(proyecto.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No autorizado'});
         }

        //  ELIMINAR PROYECTO
        await Proyectos.findOneAndRemove({ _id: req.params.id});
        res.json({msg: 'Proyecto eliminado'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}