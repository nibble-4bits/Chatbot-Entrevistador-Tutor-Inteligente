'use strict';

const evaluacion = {
    /**
     * @description Función que recibe el ID de la sesión con el chatbot, 
     * procesa las preguntas contestadas y obtiene el nivel de conocimientos del alumno
     * @param {String} sessionId 
     * @returns Un string que indica el nivel de conocimientos del alumno
     */
    evaluarExamenConocimientos: function (sessionId) {
        let puntaje = 0;
        let nivel;
        let i = 0;
        let respuestasConocimiento = [];

        // Por cada pregunta de las preguntas del alumno
        for (const pregunta of preguntasTecnicasAlumno[sessionId].preguntas) {
            // Convertimos la respuesta en letra a índice numérico (por ejemplo: 'A' sería 0, 'B' sería 1, etc)
            let indiceRespuestaDada = respuestasTecnicasAlumno[sessionId][i].charCodeAt(0) - 65;

            respuestasConocimiento.push({
                pregunta: pregunta,
                respuesta: indiceRespuestaDada,
            });

            if (pregunta.indexRightAnswer === indiceRespuestaDada) {
                switch (pregunta.type) {
                    case 1: // pregunta básica
                        puntaje += 1;
                        break;
                    case 2: // pregunta intermedia
                        puntaje += 3;
                        break;
                    case 3: // pregunta avanzada
                        puntaje += 5;
                        break;
                }
            }
            i++;
        }

        if (puntaje < 21) {
            nivel = 'Básico';
        }
        else if (puntaje < 41) {
            nivel = 'Intermedio';
        }
        else {
            nivel = 'Avanzado';
        }

        return {
            nivel: nivel,
            respuestas: respuestasConocimiento
        };
    },
    /**
     * @description Función que recibe el ID de la sesión con el chatbot, 
     * procesa las preguntas contestadas y obtiene los estilos de aprendizaje del alumno (Test de Felder)
     * @param {String} sessionId
     * @returns Un arreglo con las puntuación y los estilos predominante del alumno
     */
    evaluarExamenEstilo: function (sessionId) {
        let activo = 0, reflexivo = 0, sensorial = 0, intuitivo = 0,
            visual = 0, verbal = 0, secuencial = 0, global = 0;
        let puntajes = [], estilosPredominantes = [];
        let respuestasEstilo = [];

        for (let i = 0; i < respuestasEstiloAlumno[sessionId].length; i++) {
            respuestasEstilo.push(respuestasEstiloAlumno[sessionId][i]);
            switch (i % 4) {
                case 0: // Activo-Reflexivo
                    if (respuestasEstiloAlumno[sessionId][i] === '1') {
                        ++activo;
                    }
                    else {
                        ++reflexivo;
                    }
                    break;
                case 1: // Sensorial-Intuitivo
                    if (respuestasEstiloAlumno[sessionId][i] === '1') {
                        ++sensorial;
                    }
                    else {
                        ++intuitivo;
                    }
                    break;
                case 2: // Visual-Verbal
                    if (respuestasEstiloAlumno[sessionId][i] === '1') {
                        ++visual;
                    }
                    else {
                        ++verbal;
                    }
                    break;
                case 3: // Secuencial-Global
                    if (respuestasEstiloAlumno[sessionId][i] === '1') {
                        ++secuencial;
                    }
                    else {
                        ++global;
                    }
                    break;
            }
        }

        puntajes[0] = activo - reflexivo;
        puntajes[1] = sensorial - intuitivo;
        puntajes[2] = visual - verbal;
        puntajes[3] = secuencial - global;

        puntajes.forEach((puntaje, i) => {
            switch (i) {
                case 0:
                    if (puntaje > 0) {
                        estilosPredominantes[i] = 'Activo';
                    }
                    else {
                        estilosPredominantes[i] = 'Reflexivo';
                    }
                    break;
                case 1:
                    if (puntaje > 0) {
                        estilosPredominantes[i] = 'Sensorial';
                    }
                    else {
                        estilosPredominantes[i] = 'Intuitivo';
                    }
                    break;
                case 2:
                    if (puntaje > 0) {
                        estilosPredominantes[i] = 'Visual';
                    }
                    else {
                        estilosPredominantes[i] = 'Verbal';
                    }
                    break;
                case 3:
                    if (puntaje > 0) {
                        estilosPredominantes[i] = 'Secuencial';
                    }
                    else {
                        estilosPredominantes[i] = 'Global';
                    }
                    break;
            }
        });

        let resultados = [];
        for (let i = 0; i < puntajes.length; i++) {
            resultados.push({
                puntuacion: Math.abs(puntajes[i]), // no nos importa el signo de la puntuacion
                estiloPredominante: estilosPredominantes[i]
            });
        }

        return {
            resultados: resultados,
            respuestas: respuestasEstilo
        };
    }
}

module.exports = evaluacion;