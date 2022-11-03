// criar var globais, uma para os quizzes do usuario e outra para os demais quizzes
// obs: nao sei se serao necessarias, mas deixai ai :/ 
let quizzesUsuario;
let quizzesServidor;

// armazenar os ids no momento da criação dos quizzes
const listaIds = [];
const listaIdsSerializada = JSON.stringify(listaIds);
localStorage.setItem("id", listaIdsSerializada);

// requisicao axios --> buscar todos os quizzes
function buscaQuizzes() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    // console.log(promise);
    promise.then(renderizarQuizzes);
    promise.catch();
}

function renderizarQuizzes(resposta) {
    // console.log(resposta);
    const quizzesData = resposta.data;
    console.log(quizzesData);
    const elementoUserList = document.querySelector(".user-list");
    const elementoServerList = document.querySelector(".server-list");
    // console.log(elementoUserList);
    // console.log(elementoServerList);

    // elementoUserList.innerHTML = "";
    elementoServerList.innerHTML = "";

    // pegar de volta os ids armazenados
    const idsSerializados = localStorage.getItem("id"); // isso e uma string
    const ids = JSON.parse(idsSerializados); // isso e um array
    // console.log(ids);

    for (let i = 0; i < quizzesData.length; i++) {

        let quizz = "";

        // comparar os ids vindos do servidor com os armazenados
        if (listaIds.length > 0) {
            for (let j = 0; j < ids.length; j++) {
                if (quizzesData[i].id === ids[j]) {
                    quizz = `
                        <li class="quizz">
                            <img src=${quizzesData[i].image}>
                            <p>${quizzesData[i].title}</p>
                        </li>
                    `
                    elementoUserList.innerHTML += quizz;
                } else {
                    quizz = `
                        <li class="quizz">
                            <img src=${quizzesData[i].image}>
                            <p>${quizzesData[i].title}</p>
                        </li>
                    `
                    elementoServerList.innerHTML += quizz;
                    console.log(quizz);
                }
            }
        } else {
            quizz = `
                <li class="quizz">
                    <img src=${quizzesData[i].image}>
                    <p>${quizzesData[i].title}</p>
                </li>
            `
            elementoServerList.innerHTML += quizz;
            console.log(quizz);
        }
    }
}
function criarQuizz(){
    const main = document.querySelector('.main');
    const page02 = document.querySelector('page02');
    main.classList.remove('main');
    main.classList.add('escondido');
    page02.classList.add('main-criandoQuizz');
}
function btnProssseguir(){
    const criandoQuizz = document.querySelector('.section-quizz');
    const criarPerguntas = document.querySelector('.section01');
    criandoQuizz.classList.remove('section-quizz');
    criarPerguntas.classList.remove('escondido');
    criarPerguntas.classList.add('section-quizz');
}
function btnProsseguir2(){
    const criarPerguntas = document.querySelector('.section01');
    const section02 = document.querySelector('.section02');
    criarPerguntas.classList.remove('section-quizz');
    criarPerguntas.classList.add('escondido')
    section02.classList.remove('escondio');
    section02.classList.add('section-niveis');
}
function btnFinalizarQuizz(){
    const section02 = document.querySelector('.section02');
    const section03 = document.querySelector('.section03');
    section02.classList.remove('section-niveis');
    section02.classList.add('escondido');
    section03.classList.remove('escondido');
    section03.classList.add('section-finalizer-Quizz');
}
function voltarHome(){
    window.location.replace("../pages/page01.html");
}
buscaQuizzes();
