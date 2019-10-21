'use strict';

let interprete = {
	/**
     * @description Función que recibe los resultados del Test de estilo de aprendizaje (Test de Felder)
     * @param {String[]} resultados 
     * @returns Un string que indica el estilo predominante del alumno
     */
    interpretarEstiloDominante: function (resultados) {
        let estiloDominante = '';
        
        resultados.forEach(resultado => {
            if (resultado.estiloPredominante === 'Visual') {
                estiloDominante = 'Visual';
            }
            else if (resultado.estiloPredominante === 'Verbal') { // el alumno verbal también es auditivo
                estiloDominante = 'Auditivo';
            }
        });

        return estiloDominante;
    }
};

module.exports = interprete;