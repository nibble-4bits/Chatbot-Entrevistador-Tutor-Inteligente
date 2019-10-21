'use strict';

const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const CONFIG = require('../config');

// Los datos que guardamos del alumno
const AlumnoSchema = new mongoose.Schema({
    ID: { type: String, unique: true },
    Nombre: { type: String },
    ApPaterno: { type: String },
    ApMaterno: { type: String },
    Email: { type: String },
    FechaNacimiento: { type: Date },
    Estado: { type: String },
    Ciudad: { type: String },
    Preparatoria: { type: String },
    NivelConocimiento: { type: String },
    EstilosAprendizaje: { type: Array },
    RespuestasConocimiento: { type: Array },
    RespuestasEstilo: { type: Array },
    EntrevistaRealizada: { type: Boolean, default: false },
    URLBienvenida: { type: String, default: CONFIG.courseBaseURL }
});

// Agregamos el plugin que permite que cada _id sea autoincrementable y numérico
AlumnoSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Alumno' });

module.exports = {
    modeloAlumno: mongoose.model('Alumno', AlumnoSchema)
};