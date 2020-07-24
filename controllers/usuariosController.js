const Usuarios= require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    
    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extraer email y password
    const {email, password} = req.body;

    try {
        // REVISAR QUE EL USUARIO SEA UNICO
        let usuario = await Usuarios.findOne({email});

        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        // crea el nuevo usuario
        usuario = new Usuarios(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)

        // guardarUsuario
        await usuario.save();

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
        res.status(400).send('Hubo un error');
    }
}