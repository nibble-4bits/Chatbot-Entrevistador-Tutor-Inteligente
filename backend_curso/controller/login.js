'use strict';

const hsc = require('http-status-codes');

const ALUMNO = require('../model/alumno');
// const TOKEN = require('../util/token');
// const CONFIG = require('../config');
// const ERROR = require('../util/error');

const loginController = {
    login: function (req, res) {
		// recibimos el ID del alumno del cuerpo de la petición HTTP
        const query = {
            ID: req.body.ID
        };

		// buscamos si el alumno ya existe en la base de datos, basandonos en el ID
        ALUMNO.modeloAlumno.findOne(query, (err, queryResult) => {
            if (err) {
                return ERROR.sendErrorResponse(res,
                    'Error al intentar iniciar sesión',
                    `Error al buscar alumno en la base de datos: ${err}`);
            }

            if (queryResult) { // Sí existe, enviar al cliente la URL de bienvenida
                res.status(hsc.OK).send(queryResult.URLBienvenida);
            }
            else { // No existe el alumno
                // Creamos un nuevo modelo e inicializamos sus propiedades a las que hayamos recibido en el JSON del request
                let nuevoAlumno = new ALUMNO.modeloAlumno({
                    ID: req.body.ID
                });

                nuevoAlumno.save((err, alumnoStored) => {
                    if (err) {
                        return ERROR.sendErrorResponse(res,
                            'Error al intentar registrar una nueva cuenta',
                            `Error al guardar nuevo alumno en la base de datos: ${err}`);
                    }

                    // Enviamos como respuesta la URL de bienvenida
                    res.status(hsc.CREATED).send(alumnoStored.URLBienvenida);
                });
            }
        });
    }
};

module.exports = loginController;