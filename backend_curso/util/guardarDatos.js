'use strict';

const ALUMNO = require('../model/alumno');

const guardarDatos = {
    guardarDatosPersonales: async function (parameters, studentId) {
        let params = parameters;
        let campos = {};

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const param = params[key];

                if (param.kind === 'stringValue') {
                    campos[key] = param[param.kind]; // Guardamos los campos string en el objeto
                }
                else if (param.kind === 'structValue') {
                    let struct = param[param.kind].fields; // Es un objeto
                    let address = '';
                    for (const keyStruct in struct) {
                        if (struct.hasOwnProperty(keyStruct)) {
                            const structElement = struct[keyStruct];
                            if (structElement[structElement.kind] !== '') {
                                address += structElement[structElement.kind]
                            }
                        }
                    }
                    campos[key] = address; // Guardamos la direccion en el objeto
                }
                else if (param.kind === 'listValue') {
                    let list = param[param.kind].values; // Es un arreglo
                    let nombrePila = '';

                    list.forEach(nombre => {
                        nombrePila += `${nombre[nombre.kind]} `;
                    });

                    campos[key] = nombrePila.trim();
                }
            }
        }

        try {
            return await ALUMNO.modeloAlumno.findOneAndUpdate({ ID: studentId }, campos, { new: true });
        }
        catch (err) {
            console.error(err);
        }
    },
    guardarNivelConocimiento: async function (nivel, studentId) {
        try {
            return await ALUMNO.modeloAlumno.findOneAndUpdate({ ID: studentId }, { NivelConocimiento: nivel }, { new: true });
        }
        catch (err) {
            console.error(err);
        }
    },
    guardarRespuestasConocimiento: async function (respuestas, studentId) {
        try {
            return await ALUMNO.modeloAlumno.findOneAndUpdate({ ID: studentId }, { RespuestasConocimiento: respuestas }, { new: true });
        }
        catch (err) {
            console.error(err);
        }
    },
    guardarEstiloAprendizaje: async function (resultados, studentId) {
        try {
            return await ALUMNO.modeloAlumno.findOneAndUpdate({ ID: studentId }, { EstilosAprendizaje: resultados }, { new: true });
        }
        catch (err) {
            console.error(err);
        }
    },
    guardarRespuestasAprendizaje: async function (respuestas, studentId) {
        try {
            return await ALUMNO.modeloAlumno.findOneAndUpdate({ ID: studentId }, { RespuestasEstilo: respuestas }, { new: true });
        }
        catch (err) {
            console.error(err);
        }
    },
    establecerEntrevistaFinalizada: async function (studentId) {
        try {
            await ALUMNO.modeloAlumno.findOneAndUpdate({ ID: studentId }, { EntrevistaRealizada: true });
        }
        catch (err) {
            console.error(err);
        }
    }
};

module.exports = guardarDatos;