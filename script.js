let ids = 0;

document.addEventListener('DOMContentLoaded', () => {
    const storedColumns = localStorage.getItem('columns');
    if (storedColumns) {
        const columnsData = JSON.parse(storedColumns);
        ids = columnsData.length;
        let lvColumn = 0;
        // Construye las columnas y sus tarjetas utilizando los datos cargados
        columnsData.forEach(columnData => {
            initilizerColumn(columnData.title, columnData.cards, lvColumn);
            lvColumn++;
        });
    }
    const imagenBackground = localStorage.getItem('background');
    if (imagenBackground){
        const backgroundData = JSON.parse(imagenBackground);
        background.style.backgroundImage = `url(${backgroundData})`;
    }
    tTrello = document.querySelector('.tituloTrello');
    const titluloTrelloD = localStorage.getItem('tituloTrello');
    if (titluloTrelloD){
        const tituloData = JSON.parse(titluloTrelloD);
        tTrello.textContent = tituloData;
    }
});


const fotos = ['img/bird.jpg','img/butterfly.jpg','img/cat.jpg','img/cats.jpg','img/elephant.jpg','img/fox.jpg','img/frog.jpg'];

function randomFoto (){
    return Math.floor(Math.random() * (fotos.length - 1));
}

// Variables importantes
const main = document.querySelector('.contenido');
let secciones = document.querySelectorAll(".tabla");
let buttonAdd = document.querySelectorAll(".button-add");
let delElemento = document.querySelectorAll('.del-elemento');

let seccionInciada;

// Form TD
const formAddCard = document.querySelector(".form-datos-targeta-TD");
const sendFormAddCard = formAddCard.querySelector('.login-box1 a');


buttonAdd.forEach(button => button.addEventListener('click', (e) => handleIniciarFormTD(e)));

sendFormAddCard.addEventListener('click', (e) => obtenerDatosFormTD(e));

const cancelFormTD = formAddCard.querySelector(".button-delete-form");
cancelFormTD.addEventListener('click', () => handleDelFormTD());


delElemento.forEach(element => element.addEventListener('click', (e) => handleBorrarElemento(e)));


function handleIniciarFormTD(element){
    formAddCard.style.display = 'block';
    if (element.target.tagName === "SPAN") {
        const divPadre = element.target.parentNode;
        const divPadre2 = divPadre.parentNode;
        const sectionPadre = divPadre2.parentNode;
        seccionInciada = document.getElementById(`${sectionPadre.id}`)
    } else if (element.target.tagName === "BUTTON") {
        const divPadre = element.target.parentNode;
        const divPadre2 = divPadre.parentNode;
        seccionInciada = document.getElementById(`${divPadre2.id}`)
    }
}

function obtenerDatosFormTD(e){
    e.preventDefault();
    const tablaElementos = seccionInciada.querySelector(".elementos");
    const tituloInput = formAddCard.querySelector('#title1');
    const descripcionInput = formAddCard.querySelector('#description1');
    const titulo = tituloInput.value;
    const descripcion = descripcionInput.value;
    addCardToSection(tablaElementos, titulo, descripcion, seccionInciada);
    formAddCard.style.display = 'none';
    tituloInput.value = "";
    descripcionInput.value = "";
}

function addCardToSection(tablaElementos, titulo, descripcion, seccion){
    let randomNumber = randomFoto();
    const cardId = generateUniqueId();
    const fechaActual = obtenerFechaActual();
    let contenido = `
        <li class="elemento" data-card-id="${cardId}">
            <div class="card" style="width: 18rem;">
                <button class="del-elemento">X</button>
                <img src="${fotos[randomFoto()]}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${titulo}</h5>
                    <p class="card-text">${descripcion}</p>
                </div>
                <div class="clock">
                    <input type="datetime-local" id="clock-content" name="trip-start" value="${fechaActual}"/>
                    <img class="clockimg" src="img/reloj.png" alt="">
                </div>
                <label class="checkbox-element">
                    <input type="checkbox">
                    <svg class="checkedBox" viewBox="0 0 64 64" height="2em" width="2em">
                        <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                        pathLength="575.0541381835938" class="path"></path>
                    </svg>
                </label>
            </div>
        </li>
    `;
    tablaElementos.innerHTML += contenido;

    const columnsData = JSON.parse(localStorage.getItem('columns')) || [];
    const columnIndex = Array.from(secciones).indexOf(seccion);
    let botonChecked = false;
    if (columnIndex !== -1) {
        columnsData[columnIndex].cards.push({ titulo, descripcion, cardId, botonChecked, fechaActual});
        localStorage.setItem('columns', JSON.stringify(columnsData));
    }

    inputClock = document.querySelectorAll(`#clock-content`);
    inputClock.forEach(input => input.addEventListener('change', (e) => {
        handleInputClock(e)}));
}

function handleDelFormTD() {
    formAddCard.style.display = 'none';
}

function handleBorrarElemento(element) {
    const liPadre = element.target.closest('.elemento');
    if (!liPadre) return;

    const cardId = liPadre.dataset.cardId;

    const seccionTabla = liPadre.closest('.tabla');
    if (!seccionTabla) return;

    let id = seccionTabla.id;
    let columnIndex = parseInt(id.charAt(id.length - 1));

    const columnsData = JSON.parse(localStorage.getItem('columns')) || [];
    if (columnIndex >= 0 && columnIndex < columnsData.length) {
        // Filtra las tarjetas para eliminar la que coincide con el identificador único
        columnsData[columnIndex].cards = columnsData[columnIndex].cards.filter((card) => card.cardId !== cardId);
        localStorage.setItem('columns', JSON.stringify(columnsData));
    }

    liPadre.parentNode.removeChild(liPadre);
}


function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9); // Genera una cadena aleatoria
}

// Form T
const formAddColumn = document.querySelector(".form-datos-targeta-T");
const sendFormAddColumn = formAddColumn.querySelector('.login-box2 a');

function handleAddColumn(){
    formAddColumn.style.display = 'block';
}

const cancelFormT = formAddColumn.querySelector(".button-delete-form");
cancelFormT.addEventListener('click', () => handleDelFormT());

function handleDelFormT() {
    formAddColumn.style.display = 'none';
}

const buttonAddTabla = document.querySelector('.button-addTabla');
buttonAddTabla.addEventListener('click', handleAddColumn);

sendFormAddColumn.addEventListener('click', (e) => obtenerDatosFormT(e));

function obtenerDatosFormT(e) {
    e.preventDefault();
    const tituloInput = formAddColumn.querySelector('#title2');
    const titulo = tituloInput.value;
    addColumnToMain(titulo);
    formAddColumn.style.display = 'none';
    tituloInput.value = "";
}

function addColumnToMain(titulo){
    let content = `
    <section class="tabla" id="section${ids}">
        <div class="cont">
            <div class="title">
                <h3>${titulo}</h3>
                <button class="button-options"> 
                    <img src="img/opciones.png" alt="">
                </button>
            </div>
            <button class="button-delete-column" type="button">
                    <strong>Delete</strong>
                    <div id="container-stars">
                        <div id="stars"></div>
                    </div>
                    <div id="glow">
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
            </button>
            <button class="button-add" id=button-add${ids}> +
                <span class="content-button-add"></span>
            </button>
            <ul class="elementos">
                
            </ul>
        </div>
    </section>`;
    main.innerHTML += content;
    ids++;
    secciones = document.querySelectorAll(".tabla");

    let idSection = ids-1;
    const columnsData = JSON.parse(localStorage.getItem('columns')) || [];
    columnsData.push({ title: titulo, cards: [], idSection });
    localStorage.setItem('columns', JSON.stringify(columnsData));

    tituloColumnas = document.querySelectorAll('.button-options');
    tituloColumnas.forEach(tituloColumna => tituloColumna.addEventListener('click', (e) => handleSetTitleColumna(e)));

    botonDeletearColumna = document.querySelectorAll(".button-delete-column");
    botonDeletearColumna.forEach(boton => boton.addEventListener('click', (e) => deletearColumna(e)));
}


// Event Listener 
main.addEventListener('click', (e) => {
    const sectionPadre = e.target.closest('.tabla');

    if (!sectionPadre) return;

    if (e.target.classList.contains('button-add')) {
        handleIniciarFormTD(e);
    } else if (e.target.classList.contains('content-button-add')) {
        handleIniciarFormTD(e);
    }
    if (e.target.classList.contains('checkedBox')) {
        handleBotonChecked(e);
    }
    if (e.target.classList.contains('del-elemento')) {
        handleBorrarElemento(e);
    }

});

main.addEventListener('change', (e) => {
    const sectionPadre = e.target.closest('.tabla');

    if (!sectionPadre) return;

    if (e.target.classList.contains('clock-content')) {
        handleInputClock(e);
    } 
});



function initilizerColumn(titulo, cards = [], lvColumn){
    if (cards.length > 0){
        let contentCards = "";
        cards.forEach(card => {
            let randonVal = randomFoto();
            if (card.botonChecked === true){
                contentCards += `
                <li class="elemento" data-card-id="${card.cardId}">
                    <div class="card" style="width: 18rem;">
                        <button class="del-elemento">X</button>
                        <img src="${fotos[randonVal]}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${card.titulo}</h5>
                            <p class="card-text">${card.descripcion}</p>
                        </div>
                        <div class="clock">
                            <input type="datetime-local" id="clock-content" name="trip-start" value="${card.fechaActual}"/>
                            <img class="clockimg" src="img/reloj.png" alt="">
                        </div>
                        <label class="checkbox-element">
                            <input type="checkbox" checked>
                            <svg class="checkedBox" viewBox="0 0 64 64" height="2em" width="2em">
                                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                pathLength="575.0541381835938" class="path"></path>
                            </svg>
                        </label>
                    </div>
                </li>
            `;
            } else if (card.botonChecked === false){
                contentCards += `
                <li class="elemento" data-card-id="${card.cardId}">
                    <div class="card" style="width: 18rem;">
                        <button class="del-elemento">X</button>
                        <img src="${fotos[randonVal]}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${card.titulo}</h5>
                            <p class="card-text">${card.descripcion}</p>
                        </div>
                        <div class="clock">
                            <input type="datetime-local" id="clock-content" name="trip-start" value="${card.fechaActual}"/>
                            <img class="clockimg" src="img/reloj.png" alt="">    
                        </div>
                        <label class="checkbox-element">
                            <input type="checkbox">
                            <svg class="checkedBox" viewBox="0 0 64 64" height="2em" width="2em">
                                <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                pathLength="575.0541381835938" class="path"></path>
                            </svg>
                        </label>
                    </div>
                </li>
            `;
            }
        })
        let contentColumn = `
        <section class="tabla" id="section${lvColumn}">
            <div class="cont">
                <div class="title">
                    <h3>${titulo}</h3>
                    <button class="button-options"> 
                        <img src="img/opciones.png" alt="">
                    </button>
                </div>
                <button class="button-delete-column" type="button">
                    <strong>Delete</strong>
                    <div id="container-stars">
                        <div id="stars"></div>
                    </div>
                    <div id="glow">
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
                </button>
                <button class="button-add" id=button-add${lvColumn}> +
                    <span class="content-button-add"></span>
                </button>
                <ul class="elementos">
                    ${contentCards}
                </ul>
            </div>
        </section>`;
        main.innerHTML += contentColumn;
    }else{
        let contentColumn = `
        <section class="tabla" id="section${lvColumn}">
            <div class="cont">
                <div class="title">
                    <h3>${titulo}</h3>
                    <button class="button-options"> 
                        <img src="img/opciones.png" alt="">
                    </button>
                </div>
                <button class="button-delete-column" type="button">
                    <strong>Delete</strong>
                    <div id="container-stars">
                        <div id="stars"></div>
                    </div>
                    <div id="glow">
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
                </button>
                <button class="button-add" id=button-add${lvColumn}> +
                    <span class="content-button-add"></span>
                </button>
                <ul class="elementos">
                    
                </ul>
            </div>
        </section>`;
        main.innerHTML += contentColumn;
    }
    secciones = document.querySelectorAll(".tabla");
    delElemento = document.querySelectorAll('.del-elemento');
    delElemento.forEach(element => element.addEventListener('click', (e) => handleBorrarElemento(e)));
    
    tituloColumnas = document.querySelectorAll('.button-options');
    tituloColumnas.forEach(tituloColumna => tituloColumna.addEventListener('click', (e) => handleSetTitleColumna(e)));

    botonesChecked = document.querySelectorAll('.checkedBox');
    botonesChecked.forEach(boton => boton.addEventListener('click', (e) => handleBotonChecked(e)))

    inputClock = document.querySelectorAll('#clock-content');
    inputClock.forEach(input => input.addEventListener('change', (e) => handleInputClock(e)))

    botonDeletearColumna = document.querySelectorAll(".button-delete-column");
    botonDeletearColumna.forEach(boton => boton.addEventListener('click', (e) => deletearColumna(e)));
}



// set titulo columna
let ultimoCambiarTituloColumna;

let tituloColumnas = document.querySelectorAll('.button-options');

function cambiarTituloColumna(e, title){
    let sectionTabla;
    if (e.target.tagName === "IMG") {
        const divPadre = e.target.parentNode;
        const divTitle = divPadre.parentNode;
        
        divTitle.querySelector('h3').textContent = title;

        const divCont = divTitle.parentNode;
        sectionTabla = divCont.parentNode;
    } else if (e.target.tagName === "BUTTON") {
        const divTitle = e.target.parentNode;
        
        divTitle.querySelector('h3').textContent = title;

        const divCont = divTitle.parentNode;
        sectionTabla = divCont.parentNode;
    }
    let id = sectionTabla.id;

    let columnIndex = parseInt(id.charAt(id.length - 1));

    const columnsData = JSON.parse(localStorage.getItem('columns')) || [];
    columnsData[columnIndex].title = title;
    localStorage.setItem('columns', JSON.stringify(columnsData));
}

tituloColumnas.forEach(tituloColumna => tituloColumna.addEventListener('click', (e) => handleSetTitleColumna(e)));


const formCambiarTituloColumna = document.querySelector(".form-datos-targeta-TN");
const sendFormCambiarTituloColumna = formCambiarTituloColumna.querySelector('.login-box3 a');

function handleSetTitleColumna(e){
    ultimoCambiarTituloColumna = e;
    formCambiarTituloColumna.style.display = 'block';
}

const cancelFormTM = formCambiarTituloColumna.querySelector(".button-delete-form");
cancelFormTM.addEventListener('click', () => handleDelFormTM());

function handleDelFormTM() {
    formCambiarTituloColumna.style.display = 'none';
}

sendFormCambiarTituloColumna.addEventListener('click', (e) => obtenerDatosFormTM(e));

function obtenerDatosFormTM(e) {
    e.preventDefault();
    const tituloInput = formCambiarTituloColumna.querySelector('#title3');
    const titulo = tituloInput.value;
    cambiarTituloColumna(ultimoCambiarTituloColumna, titulo);
    formCambiarTituloColumna.style.display = 'none';
    tituloInput.value = "";
}



// Fondo

const fondo = ['img/fondo/church.jpg','img/fondo/field.jpg','img/fondo/flower.jpg','img/fondo/heart.jpg','img/fondo/himalyas.jpg','img/fondo/plant.jpg','img/fondo/poppies.jpg','img/fondo/road.jpg'];

function randomBackground (){
    return Math.floor(Math.random() * (fondo.length - 1));
}

const background = document.querySelector('body');

const botonBackground = document.querySelector('.btnBackground')

function setFondo(){
    let posRBackground = randomBackground();
    let fotoRandom = fondo[posRBackground];
    background.style.backgroundImage = `url(${fotoRandom})`;

    localStorage.setItem('background', JSON.stringify(fotoRandom));
}

botonBackground.addEventListener('click', () => setFondo())


// Titulo
const botonTituloTrello = document.querySelector('.tituloProyect')

botonTituloTrello.addEventListener('click', () => handleSetTitleTrello())

function handleSetTitleTrello(){
    formCambiarTituloTrello.style.display = 'block';
}
let tTrello = document.querySelector('.tituloTrello');

function cambiarTituloTrello(title){
    tTrello = document.querySelector('.tituloTrello');
    tTrello.textContent = title;
    localStorage.setItem('tituloTrello', JSON.stringify(title));
}

tituloColumnas.forEach(tituloColumna => tituloColumna.addEventListener('click', (e) => handleSetTitleColumna(e)));

const formCambiarTituloTrello = document.querySelector(".form-datos-targeta-TT");
const sendFormCambiarTituloTrello = formCambiarTituloTrello.querySelector('.login-box4 a');

const cancelFormTT = formCambiarTituloTrello.querySelector(".button-delete-form");
cancelFormTT.addEventListener('click', () => handleDelFormTT());

function handleDelFormTT() {
    formCambiarTituloTrello.style.display = 'none';
}

sendFormCambiarTituloTrello.addEventListener('click', (e) => obtenerDatosFormTT(e));

function obtenerDatosFormTT(e) {
    e.preventDefault();
    const tituloInput = formCambiarTituloTrello.querySelector('#title4');
    const titulo = tituloInput.value;
    cambiarTituloTrello(titulo);
    formCambiarTituloTrello.style.display = 'none';
    tituloInput.value = "";
}

// Tarea completa (checked)
let botonesChecked = document.querySelectorAll('.checkedBox');

function handleBotonChecked(e){
    const cardPadre = e.target.closest('.elemento');
    const sectionPadre = e.target.closest('.tabla');

    const idCard = cardPadre.getAttribute('data-card-id');
    const idSection = sectionPadre.id.charAt(sectionPadre.id.length - 1);
    

    const columnsData = JSON.parse(localStorage.getItem('columns')) || [];
    if (idSection >= 0 && idSection < columnsData.length) {
        columnsData[idSection].cards.forEach(
            (card) => {
                if (card.cardId === idCard){
                    if (card.botonChecked === false){
                        card.botonChecked = true;
                    }else{
                        card.botonChecked = false;
                    }
                }
            }
        );
        localStorage.setItem('columns', JSON.stringify(columnsData));
    }
}

botonesChecked.forEach(boton => boton.addEventListener('click', (e) => handleBotonChecked(e)))



// fecha vencimiento

function obtenerFechaActual() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Agregar 1 al mes ya que los meses comienzan en 0.
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${año}-${mes}-${dia}T${horas}:${minutos}`;
}


let inputClock = document.querySelectorAll('#clock-content');

function handleInputClock(e){
    const cardPadre = e.target.closest('.elemento');
    const sectionPadre = e.target.closest('.tabla');

    const idCard = cardPadre.getAttribute('data-card-id');
    const idSection = sectionPadre.id.charAt(sectionPadre.id.length - 1);

    const columnsData = JSON.parse(localStorage.getItem('columns')) || [];
        columnsData[idSection].cards.forEach(
            (card) => {
                if (card.cardId === idCard){
                    card.fechaActual = e.target.value;
                }
            }
        );
        localStorage.setItem('columns', JSON.stringify(columnsData));
    
}

inputClock.forEach(input => input.addEventListener('change', (e) => handleInputClock(e)))


/* Clock chequed */
function funcionCheckeoDia(){
    let inputClock = document.querySelectorAll('#clock-content');
    inputClock.forEach(input => {
        let fechaCard = input.value;

        let divPadre = input.parentNode;
        let iconoClock = divPadre.querySelector('.clockimg');

        let fechaAct = obtenerFechaActual();

        const date1 = new Date(fechaAct);
        const date2 = new Date(fechaCard);

        if (date1 > date2) {
            iconoClock.src = "img/reloj-de-arena.png"
        } else{
            iconoClock.src = "img/reloj.png"
        }
    })
}

setInterval(funcionCheckeoDia, 20000);



// Delete columna

let botonDeletearColumna = document.querySelectorAll(".button-delete-column");

function deletearColumna(boton){
    const sectionPadre = boton.target.closest('.tabla');

    const idSection = sectionPadre.id.charAt(sectionPadre.id.length - 1);

    let columnsData = JSON.parse(localStorage.getItem('columns')) || [];
    columnsData = columnsData.filter((seccion) => parseInt(seccion.idSection) !== parseInt(idSection));
    localStorage.setItem('columns', JSON.stringify(columnsData));
    
    sectionPadre.style.display = 'none';
}

botonDeletearColumna.forEach(boton => boton.addEventListener('click', () => deletearColumna(boton)));