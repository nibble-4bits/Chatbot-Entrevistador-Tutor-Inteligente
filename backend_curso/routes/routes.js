/*
	Aquí se ponen todas las rutas (URLs) del sistema
*/

'use strict';

const express = require('express');

const LOGIN = require('../controller/login');
const CHATBOT = require('../controller/chatbot');
const TEST = require('../controller/test');

const route = express.Router();

route.post('/login', LOGIN.login);
route.post('/test/registerStudent', TEST.registerStudent);
route.post('/chatbot/welcomeEvent', CHATBOT.welcomeEvent);
route.post('/chatbot/sendMessage', CHATBOT.sendMessage);

module.exports = route;