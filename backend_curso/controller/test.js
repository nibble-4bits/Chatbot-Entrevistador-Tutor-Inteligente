'use strict';

const fs = require('fs');
const hsc = require('http-status-codes');
const _ = require('lodash');

// Cargamos las preguntas del test de conocimientos del archivo JSON
let preguntasTecnicasArchivo = fs.readFileSync('./technical_questions.json', { encoding: 'utf8' });
let preguntasTecnicas = JSON.parse(preguntasTecnicasArchivo);

// Cargamos las preguntas del test de Felder (estilo de aprendizaje) del archivo JSON
let preguntasEstiloArchivo = fs.readFileSync('./learning_style_questions.json', { encoding: 'utf8' });
let preguntasEstilo = JSON.parse(preguntasEstiloArchivo);

// Inicializamos las variables globales donde guardaremos las preguntas y respuestas de ambos exámenes
global.preguntasTecnicasAlumno = {};
global.respuestasTecnicasAlumno = {};
global.preguntasEstiloAlumno = {};
global.respuestasEstiloAlumno = {};

const testController = {
    registerStudent: function (req, res) {
        let peticion = req.body;

        revolverPreguntasTecnicas(peticion);
        inicializarPreguntasEstilo(peticion);

        res.sendStatus(hsc.OK);
    }
};

function revolverPreguntasTecnicas(peticion) {
    let sessionId = peticion.sessionId;
    let preguntasBasicas = preguntasTecnicas.basicExam.questions;
    let preguntasIntermedias = preguntasTecnicas.intermediateExam.questions;
    let preguntasAvanzadas = preguntasTecnicas.advancedExam.questions;

    let questionArray = [];

    for (const question of preguntasBasicas) {
        questionArray.push(question);
    }
    for (const question of preguntasIntermedias) {
        questionArray.push(question);
    }
    for (const question of preguntasAvanzadas) {
        questionArray.push(question);
    }

    // Revolvemos las respuestas
    for (const question of questionArray) {
        let rightAnswer = question.answers[0];
        question.answers = _.shuffle(question.answers);

        for (let i = 0; i < question.answers.length; i++) {
            if (question.answers[i] === rightAnswer) {
                question.indexRightAnswer = i;
            }
        }
    }

    preguntasTecnicasAlumno[sessionId] = {
        preguntas: _.shuffle(questionArray), // revolvemos las preguntas
        indiceActual: 0
    };
    respuestasTecnicasAlumno[sessionId] = [];
}

function inicializarPreguntasEstilo(peticion) {
    let sessionId = peticion.sessionId;

    preguntasEstiloAlumno[sessionId] = {
        preguntas: preguntasEstilo.questions,
        indiceActual: 0
    }
    respuestasEstiloAlumno[sessionId] = [];
}

module.exports = testController;