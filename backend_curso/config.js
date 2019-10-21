'use strict';

module.exports = {
    port: process.env.PORT,
    webSocketPort: process.env.WSPORT,
    database: {
        connectionString: process.env.MONGODB_URI
    },
    apiBaseURL: process.env.BASE_URL,
    courseBaseURL: process.env.BASE_COURSE_URL,
    googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    schoologyCoursesCodes: {
        basicoAuditivo: process.env.BASICO_AUDITIVO,
        basicoVisual: process.env.BASICO_VISUAL,
        intermedioAuditivo: process.env.INTERMEDIO_AUDITIVO,
        intermedioVisual: process.env.INTERMEDIO_VISUAL,
        avanzadoAuditivo: process.env.AVANZADO_AUDITIVO,
        avanzadoVisual: process.env.AVANZADO_VISUAL
    }
};