'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const CONFIG = require('./config');

const app = express();

app.use(function (req, res, next) { // Permitir CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/entrevista', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/entrevista.html'));
});

app.listen(CONFIG.port, () => console.log(`Servidor corriendo en puerto ${CONFIG.port}`));