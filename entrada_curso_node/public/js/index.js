let txtMatricula = document.getElementById('txtMatricula');
let frmLogin = document.getElementById('frmLogin');
let modal = document.getElementById('modal');
let btnModalCancel = document.getElementById('btnModalCancel');
let btnModalAccept = document.getElementById('btnModalAccept');
let modalId = document.getElementById('modalID');

// Nos aseguramos de impedir que los usuarios no puedan introducir números en
// la caja de texto
txtMatricula.addEventListener('input', (event) => {
    if (isNaN(parseInt(event.data)) && event.data !== null) {
        txtMatricula.value = event.target.value.slice(0, event.target.value.length - 1);
    }
});

// Cuando se esté mostrando el modal, si se hace click fuera de él,
// en el área oscura, se cerrará el modal
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        txtMatricula.value = '';
        modal.style.display = "none";
    }
});

// Cerrar el modal cuando se haga click en el botón rojo
btnModalCancel.addEventListener('click', (event) => {
    txtMatricula.value = '';
    modal.style.display = 'none';
});

btnModalAccept.addEventListener('click', (event) => {
    localStorage.setItem('ID', txtMatricula.value);

    axios.post('https://prgm-delfin-2019-tutor-intelig.herokuapp.com/api/login', {
        ID: txtMatricula.value
    })
    .then(function (response) {
        document.location.href = response.data;
    })
    .catch(function (error) {
        console.error(error);
    });

    // axios.post('http://localhost:3000/api/login', {
    //     ID: txtMatricula.value
    // })
    // .then(function (response) {
    //     document.location.href = response.data;
    // })
    // .catch(function (error) {
    //     console.error(error);
    // });
});

// Mostrar el modal cuando se haga click en el botón Acceder
frmLogin.addEventListener('submit', (event) => {
    event.preventDefault();

    modalId.innerHTML = txtMatricula.value;
    modal.style.display = 'flex';
});