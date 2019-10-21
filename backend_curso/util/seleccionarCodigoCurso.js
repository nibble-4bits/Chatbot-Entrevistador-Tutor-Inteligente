'use strict';

const CONFIG = require('../config');

let seleccion = {
	/**
     * @description Función que recibe el nivel de conocimiento y 
	 * 				el estilo de aprendizaje del alumno y devuelve el código 
	 *				del curso que se adapta a dichos parámetros
     * @param {String} sessionId 
     * @returns Un string que representa el código del curso de Schoology
     */
    seleccionarCodigo: function (nivelConocimiento, estiloAprendizaje) {
        if (nivelConocimiento === 'Básico') {
            if (estiloAprendizaje === 'Visual') {
                return CONFIG.schoologyCoursesCodes.basicoVisual;
            }
            else if (estiloAprendizaje === 'Auditivo') {
                return CONFIG.schoologyCoursesCodes.basicoAuditivo;
            }
        }
        else if (nivelConocimiento === 'Intermedio') {
            if (estiloAprendizaje === 'Visual') {
                return CONFIG.schoologyCoursesCodes.intermedioVisual;
            }
            else if (estiloAprendizaje === 'Auditivo') {
                return CONFIG.schoologyCoursesCodes.intermedioAuditivo;
            }
        }
        else if (nivelConocimiento === 'Avanzado') {
            if (estiloAprendizaje === 'Visual') {
                return CONFIG.schoologyCoursesCodes.avanzadoVisual;
            }
            else if (estiloAprendizaje === 'Auditivo') {
                return CONFIG.schoologyCoursesCodes.avanzadoAuditivo;
            }
        }
    }
};

module.exports = seleccion;