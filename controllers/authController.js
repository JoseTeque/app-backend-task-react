const Usuarios= require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUsuario = async (req, res) => {
    
    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extraer email y password
    const {email, password} = req.body;

    try {
        // REVISAR QUE SEA UN USUARIO REGISTRADO
        let usuario = await Usuarios.findOne({email});

        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        // REVISAR EL PASSWORD
        const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passwordCorrecto){
            return res.status(400).json({msg: 'Contraseña invalida..!'});
        }

        // SI TODO ES CORRECTO
        // Crear y firmar el jsonwebtoken
        const payload = {
            usuario:{
                id: usuario.id
            }
        };
        // firmar el jwt
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn:3600
        }, (error, token) => {
            if(error) throw Error;
            // mensaje de confirmacion
            res.json({token});

        });


    } catch (error) {
        console.log(error);
    }
}

exports.obtieneUsuario = async(req, res) => {
    try {
        const usuario = await Usuarios.findById(req.usuario.id).select('-password'); //El password no lo queremos
        res.json({usuario});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}