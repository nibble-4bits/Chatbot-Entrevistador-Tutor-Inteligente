'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const io = require('socket.io');

const CONFIG = require('./config');
const ROUTES = require('./routes/routes');

// guardamos en un objeto la lista de clientes que se han conectado mediante socket.io
global.socketsConectados = {};

const app = express();

app.use(function (req, res, next) { // Permitir CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(bodyParser.json());
app.use('/api', ROUTES);

// Establecemos la conexión con la base de datos de MongoDB
mongoose.connect(CONFIG.database.connectionString, { useNewUrlParser: true, useFindAndModify: false }, (err) => {
    if (err) {
        console.log(`Error al conectar a la base de datos: ${err}`);
    }
    else {
        console.log('Conexion a la base de datos establecida');

        let httpServer = app.listen(CONFIG.port, () => console.log(`Servidor corriendo en puerto ${CONFIG.port}`));
        let ioServer = io(httpServer);

        ioServer.on('connection', socket => {
            console.log('Client connected!');
            console.log('Clients connected so far:', Object.keys(ioServer.sockets.sockets).length);
            
            socket.on('send_session_id', data => {
                socketsConectados[data.sessId] = socket;
            });

            // Nos encargamos de eliminar el socket una vez que el alumno se desconecta, para
            // minimizar recursos
            socket.on('disconnect', () => {
                for (const socketId in socketsConectados) {
                    if (socketsConectados.hasOwnProperty(socketId)) {
                        const currentSocket = socketsConectados[socketId];
                        if (currentSocket === socket) {
                            delete socketsConectados[socketId];
                            break;
                        }
                    }
                }
            });
        });
    }
});