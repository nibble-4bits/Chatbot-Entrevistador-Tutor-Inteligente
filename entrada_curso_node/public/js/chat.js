let chatMessages = document.querySelector('.chat-messages');
let txtUserMessage = document.getElementById('txtUserMessage');
let btnSendMessage = document.getElementById('btnSendMessage');

let baseURL = 'https://prgm-delfin-2019-tutor-intelig.herokuapp.com';
// let baseURL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', event => {
    createBotMessageBubble('api/chatbot/welcomeEvent');
});

window.addEventListener('message', event => {
    if (event.data === 'disable_chat') {
        txtUserMessage.setAttribute('disabled', '');
        btnSendMessage.setAttribute('disabled', '');
    }
})

txtUserMessage.addEventListener('keydown', event => {
    let message = txtUserMessage.value.trim();
    if (event.keyCode === 13 && message !== '') {
        createUserMessageBubble(message);
        createBotMessageBubble('api/chatbot/sendMessage', message.toUpperCase());
    }
});

txtUserMessage.addEventListener('input', event => {
    let message = txtUserMessage.value;
    if (message.length > 255) {
        txtUserMessage.value = message.slice(0, 255);
    }
});

btnSendMessage.addEventListener('click', event => {
    let message = txtUserMessage.value.trim();
    if (message !== '') {
        createUserMessageBubble(message);
        createBotMessageBubble('chatbot/sendMessage', message.toUpperCase());
    }
});

function createUserMessageBubble(text) {
    let userMessage = document.createElement('div');
    userMessage.textContent = text;
    userMessage.className = 'user-message';
    chatMessages.appendChild(userMessage);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    txtUserMessage.value = '';
}

function createBotMessageBubble(apiRoute, message = '') {
    let botMessage = document.createElement('div');
    botMessage.textContent = '...';
    botMessage.style.fontSize = '32px';
    botMessage.style.letterSpacing = '5px';
    botMessage.className = 'bot-message';
    chatMessages.appendChild(botMessage);

    axios.post(`${baseURL}/${apiRoute}`, {
        studentId: localStorage.getItem('ID'),
        sessionId: localStorage.getItem('sessId'),
        message: message
    })
        .then(function (response) {
            botMessage.removeAttribute('style');
            botMessage.textContent = response.data[0].queryResult.fulfillmentText;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(function (error) {
            console.log(error);
        });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}