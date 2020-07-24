const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// conectar a la base de datos
conectarDB();

// HABILITAR express.JSON
app.use(express.json({extended:true}))

// Habilitar CORS
app.use(cors());


const port = process.env.port || 4000;

// IMPORTAR RUTAS
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// ARRANCAR EL SERVIDOR
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})