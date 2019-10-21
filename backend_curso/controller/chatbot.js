'use strict';

const hsc = require('http-status-codes');

const DIALOGFLOW = require('../model/dialogflow');
const GUARDAR_DATOS = require('../util/guardarDatos');
const EVALUACION = require('../util/evaluarExamen');
const INTERPRETACION = require('../util/interpretarEstilos');
const SELECCIONADOR = require('../util/seleccionarCodigoCurso');

// El mensaje con el cual el bot empieza la conversación
const MENSAJE_BIENVENIDA = function (nombreAlumno) {
    return `¡Perfecto ${nombreAlumno}! 
    Ahora que he recabado tus datos personales, procederemos a realizar el examen técnico. 
    Contesta A, B, C o D según cuál sea tu respuesta. 
    Si no sabes la respuesta, escribe 'no sé'. 
    Contesta de la manera más honesta posible. 
    ¡Estoy emocionado por saber cuánto sabes de programación!`;
}

// El mensaje con el cual el bot indica que ya se terminó el examen técnico
const MENSAJE_EXAMEN_TECNICO_TERMINADO = function () {
    return `¡Muy bien, has contestado la última pregunta 
    del examen de conocimientos! Ahora procederemos a realizar el examen para determinar tu estilo de aprendizaje.
    Contesta 1 ó 2 según sea el caso. 
    Contesta de la manera que más se asemeje a tu personalidad.`;
}

// El mensaje con el cual el bot indica que ya se terminó la entrevista
const MENSAJE_ENTREVISTA_TERMINADA = function (resultadoNivelCon, resultadoInterpretacion, codigoSchoology) {
    return `¡Genial, hemos terminado con la entrevista! 
    Con la información recabada me alegra decirte que el curso que debes tomar en base a tu nivel 
    de conocimiento y estilo de aprendizaje es el curso: ${resultadoNivelCon} ${resultadoInterpretacion}, cuyo
    codigo es ${codigoSchoology} en Schoology
    ¡Espero que disfrutes y aprendas mucho durante el curso!`;
}

let resNivelCon = {};

const chatbotController = {
	// Esta función hace que se dispare el evento de bienvenida y envíe al alumno el mensaje de bienvenida
    welcomeEvent: async function (req, res) {
        const sessionId = req.body.sessionId;

        const dialogflowAPI = new DIALOGFLOW(sessionId);
        const response = await dialogflowAPI.callWelcomeEvent();

        res.status(hsc.OK).send(response);
    },
	// Esta función es la que se encarga de responder al alumno en base a la etapa 
	// en la que se encuentre el alumno durante la entrevista  y de enviar las preguntas 
	// para que se muestren en el cliente
	// Hay 3 etapas:
	// BIENVENIDA: El bot saluda al alumno y le da la bienvenida
	// EXAMEN DE CONOCIMIENTOS TECNICOS: El bot pregunta al alumno cual es su respuesta a la pregunta mostrada
	// EXAMEN DE ESTILO DE APRENDIZAJE: El bot pregunta al alumno cual es su respuesta a la pregunta mostrada
    sendMessage: async function (req, res) {
        const studentId = req.body.studentId;
        const sessionId = req.body.sessionId;
        const message = req.body.message;
        const preguntasTecnicas = preguntasTecnicasAlumno[sessionId];
        const preguntasEstilo = preguntasEstiloAlumno[sessionId];

        const dialogflowAPI = new DIALOGFLOW(sessionId);
        const response = await dialogflowAPI.sendTextMessage(message);

        if (/Contesta A, B, C o D según cuál sea tu respuesta/.test(response[0].queryResult.fulfillmentText)) {
            let alumno = await GUARDAR_DATOS.guardarDatosPersonales(response[0].queryResult.parameters.fields, studentId);
            let nombreAlumno = alumno.Nombre;

            response[0].queryResult.fulfillmentText = MENSAJE_BIENVENIDA(nombreAlumno);
            socketsConectados[sessionId].emit('next_tech_question', preguntasTecnicas.preguntas[preguntasTecnicas.indiceActual++]);
        }
        if (response[0].queryResult.intent.displayName === 'entrevista_nivel_conocimientos') {
            // guardamos la respuesta que dió el alumno
            respuestasTecnicasAlumno[sessionId].push(response[0].queryResult.queryText);

            // Si ya se contestó la última pregunta
            if (preguntasTecnicas.indiceActual === preguntasTecnicas.preguntas.length) {
                resNivelCon[studentId] = EVALUACION.evaluarExamenConocimientos(sessionId);
                await GUARDAR_DATOS.guardarNivelConocimiento(resNivelCon[studentId].nivel, studentId);
                await GUARDAR_DATOS.guardarRespuestasConocimiento(resNivelCon[studentId].respuestas, studentId);

                response[0].queryResult.fulfillmentText = MENSAJE_EXAMEN_TECNICO_TERMINADO();

                socketsConectados[sessionId].emit('next_style_question', preguntasEstilo.preguntas[preguntasEstilo.indiceActual++]);
            }
            else {
                socketsConectados[sessionId].emit('next_tech_question', preguntasTecnicas.preguntas[preguntasTecnicas.indiceActual++]);
            }
        }
        if (response[0].queryResult.intent.displayName === 'entrevista_estilo_aprendizaje') {
            // guardamos la respuesta que dió el alumno
            respuestasEstiloAlumno[sessionId].push(response[0].queryResult.queryText);

            // Si ya se contestó la última pregunta
            if (preguntasEstilo.indiceActual === preguntasEstilo.preguntas.length) {
                let resultadoEstiloApr = EVALUACION.evaluarExamenEstilo(sessionId);
                let resInterpretacion = INTERPRETACION.interpretarEstiloDominante(resultadoEstiloApr.resultados);
                let codigoSchoology = SELECCIONADOR.seleccionarCodigo(resNivelCon[studentId].nivel, resInterpretacion);
                await GUARDAR_DATOS.guardarEstiloAprendizaje(resultadoEstiloApr.resultados, studentId);
                await GUARDAR_DATOS.guardarRespuestasAprendizaje(resultadoEstiloApr.respuestas, studentId);

                response[0].queryResult.fulfillmentText = MENSAJE_ENTREVISTA_TERMINADA(resNivelCon[studentId].nivel, resInterpretacion, codigoSchoology);

                finalizarEntrevista(sessionId);

                await GUARDAR_DATOS.establecerEntrevistaFinalizada(studentId);
            }
            else {
                socketsConectados[sessionId].emit('next_style_question', preguntasEstilo.preguntas[preguntasEstilo.indiceActual++]);
            }
        }

        res.status(hsc.OK).send(response);
    }
};

module.exports = chatbotController;

function finalizarEntrevista(sessionId) {
    socketsConectados[sessionId].emit('finished_interview');
}