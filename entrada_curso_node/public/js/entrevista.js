let questionCodeDiv = document.querySelector('.question-code');
let questionNumber = document.getElementById('question-number');
let questionTitle = document.getElementById('question-title');
let questionContainer = document.getElementById('question-container');
let choicesList = document.getElementById('choices-list');
let pre = document.createElement('pre');
let chatbot = document.getElementById('chatbot');
let ol = document.querySelector('ol');

let baseURL = 'https://prgm-delfin-2019-tutor-intelig.herokuapp.com';
// let baseURL = 'http://localhost:3000';
let numeroPreguntaTecnica = 1;
let numeroPreguntaEstilo = 1;

// Generamos un UUID que representa la sesión y lo guardamos en el localStorage
localStorage.setItem('sessId', uuid());

/**
 * @description Función que retorna un UUID (Identificador Unico Universal)
 * @returns Un string del UUID recién generado
 */
function uuid() {
    function hex4() {
        return Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
    }

    return `${hex4()}${hex4()}-${hex4()}-${hex4()}-${hex4()}-${hex4()}${hex4()}${hex4()}`;
}

document.addEventListener('DOMContentLoaded', function (event) {
    let socket = io.connect(baseURL);

    // Enviamos el id de la sesión al servidor
    socket.emit('send_session_id', {
        sessId: localStorage.getItem('sessId')
    });

    // Cuando recibimos una pregunta sobre nivel de conocimientos
    socket.on('next_tech_question', function (data) {
        chatbot.className = '';

        questionNumber.innerText = `Pregunta ${numeroPreguntaTecnica++}`;
        questionTitle.innerHTML = data.title;

        pre.innerText = data.code;
        questionCodeDiv.appendChild(pre);

        choicesList.innerHTML = null;
        data.answers.forEach(answer => {
            let listItem = document.createElement('li');
            listItem.innerText = answer;
            choicesList.appendChild(listItem);
        });
    });

    // Cuando recibimos una pregunta sobre estilo de aprendizaje
    socket.on('next_style_question', function (data) {
        chatbot.className = '';

        questionNumber.innerText = `Pregunta ${numeroPreguntaEstilo++}`;
        questionTitle.innerHTML = data.title;

        questionCodeDiv.style.display = 'none';
        ol.style.listStyleType = 'decimal';

        choicesList.innerHTML = null;
        data.answers.forEach(answer => {
            let listItem = document.createElement('li');
            listItem.innerText = answer;
            choicesList.appendChild(listItem);
        });
    });

    // Cuando recibimos del servidor que la entrevista terminó
    socket.on('finished_interview', function (data) {
        chatbot.className = 'full-screen'; // ponemos el chat en pantalla completa

        let child = questionContainer.lastElementChild;
        while (child) {
            questionContainer.removeChild(child);
            child = questionContainer.lastElementChild;
        }

        chatbot.contentWindow.postMessage('disable_chat'); // deshabilitamos el chat
    });

    axios.post(`${baseURL}/api/test/registerStudent`, {
        sessionId: localStorage.getItem('sessId'),
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
});