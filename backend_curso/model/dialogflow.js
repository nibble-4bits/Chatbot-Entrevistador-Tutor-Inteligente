'use strict';

const dialogflow = require('dialogflow');

const CONFIG = require('../config');

const LANGUAGE_CODE = 'es-419'; // el bot utiliza español de Latinoamérica

class DialogFlow {
    constructor(sessionId, projectId = 'entrevistadelfin2019-amhihd') {
        this.projectId = projectId
        this.sessionId = sessionId;
        this.sessionClient = new dialogflow.SessionsClient();
    }

    async callWelcomeEvent() {
        // Define session path
        const sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
        let eventName = 'WELCOME';  //name of the event

        let request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: eventName,
                    languageCode: LANGUAGE_CODE
                }
            }
        };

        try {
            let responses = await this.sessionClient.detectIntent(request);
            return responses;
        }
        catch (err) {
            console.error('DialogFlow.callWelcomeEvent ERROR:', err);
            throw err;
        }
    }

    async sendTextMessage(textMessage) {
        // Define session path
        const sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
		
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: textMessage,
                    languageCode: LANGUAGE_CODE
                }
            }
        }
        try {
            let responses = await this.sessionClient.detectIntent(request);
            return responses;
        }
        catch (err) {
            console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
            throw err;
        }
    }
}

module.exports = DialogFlow;