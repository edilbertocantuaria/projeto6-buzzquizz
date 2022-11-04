// ======================== VARIAVEIS GLOBAIS ======================== 

// criar var globais, uma para os quizzes do usuario e outra para os demais quizzes
// OBS: nao sei se serao necessarias, mas deixei ai (ass: ana)
let quizzesUsuario = [];
let quizzesServidor = [];

// armazenar TODOS os quizzes trazidos do servidor
let quizzesData;

// armazenar APENAS os dados do quizz selecionado
let quizzData;

// armazenar os ids no momento da criação dos quizzes
let listaIds = [];
const listaIdsSerializada = JSON.stringify(listaIds);
localStorage.setItem("id-user", listaIdsSerializada);

// armazenar os ids dos demais quizzes capturados do servidor
let listaIdsServidor = [];

// armazenar o id do quizz que foi selecionado
let idSelecionado;

// ==================== TELA 1: LISTA DE QUIZZES =====================

// requisicao axios --> buscar todos os quizzes
function buscaQuizzes() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    // console.log(promise);
    promise.then(renderizarQuizzes);
}

function renderizarQuizzes(resposta) {
    // console.log(resposta);
    quizzesData = resposta.data;
    // console.log(quizzesData);
    const elementoUserList = document.querySelector(".user-list");
    const elementoServerList = document.querySelector(".server-list");
    // console.log(elementoUserList);
    // console.log(elementoServerList);

    elementoUserList.innerHTML = "";
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
                        <li class="my-list-quizz ${quizzesData[i].id}" onclick="selecionaQuizz(this)">
                            <img src=${quizzesData[i].image}>
                            <p>${quizzesData[i].title}</p>
                        </li>
                    `
                    // armazenar objeto quizz na lista
                    quizzesUsuario.push(quizzesData[i]);

                    elementoUserList.innerHTML += quizz;
                } else {
                    quizz = `
                        <li class="quizz ${quizzesData[i].id}" onclick="selecionaQuizz(this)">
                            <img src=${quizzesData[i].image}>
                            <p>${quizzesData[i].title}</p>
                        </li>
                    `
                    // armazenar objeto quizz na lista
                    quizzesServidor.push(quizzesData[i]);

                    // armazenar o id do quizz na lista
                    listaIdsServidor.push(quizzesData[i].id);

                    elementoServerList.innerHTML += quizz;
                    console.log(quizz);
                }
            }
        } else {
            quizz = `
                <li class="quizz ${quizzesData[i].id}" onclick="selecionaQuizz(this)">
                    <img src=${quizzesData[i].image}>
                    <p>${quizzesData[i].title}</p>
                </li>
            `
            // armazenar objeto quizz na lista
            quizzesServidor.push(quizzesData[i]);

            // armazenar o id do quizz na lista
            listaIdsServidor.push(quizzesData[i].id);

            elementoServerList.innerHTML += quizz;
            console.log(quizz);
        }
    }
}

// funcao executada quando algum quizz e clicado
function selecionaQuizz(quizzSelecionado) {
    quizzSelecionado.classList.add("selecionado");
    // console.log(quizzSelecionado);

    for (let k = 0; k < quizzesData.length; k++) {
        const classeId = quizzesData[k].id;

        if (quizzSelecionado.classList.contains(classeId.toString())) {
            idSelecionado = classeId;
        }
        // nao sei o que por no else :(
    }

    // clicar em um quizz na tela 1 --> redirecionar para tela 2 
    // window.location.replace("./pages/quizz.html");
    buscaQuizz();
}

// ================ TELA 2: PÁGINA DE UM QUIZZ (PERGUNTAS) ================

// requisicao axios --> buscar dados do quiz clicado
function buscaQuizz() {
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idSelecionado}`);
    promise.then(tratarSucesso);
}

function tratarSucesso(resposta) {
    console.log(resposta);
    quizzData = resposta.data;
    console.log(quizzData);

    renderizarBaner();
    // renderizarPerguntas();
}

function renderizarBaner() {
    const elementoBaner = document.querySelector(".titulo");
    const imgBaner = quizzData.image;
    const titulo = quizzData.title;

    elementoBaner.innerHTML = "";

    elementoBaner.innerHTML += `
        <img src=${imgBaner}>
        <h2>${titulo}</h2>
    `
}

function criarQuizz() {
    const main = document.querySelector('.main');
    const page02 = document.querySelector('page02');
    main.classList.remove('main');
    main.classList.add('escondido');
    page02.classList.add('main-criandoQuizz');
}
function btnProssseguir() {
    const criandoQuizz = document.querySelector('.section-quizz');
    const criarPerguntas = document.querySelector('.section01');
    criandoQuizz.classList.remove('section-quizz');
    criarPerguntas.classList.remove('escondido');
    criarPerguntas.classList.add('section-quizz');
}
function btnProsseguir2() {
    const criarPerguntas = document.querySelector('.section01');
    const section02 = document.querySelector('.section02');
    criarPerguntas.classList.remove('section-quizz');
    criarPerguntas.classList.add('escondido')
    section02.classList.remove('escondio');
    section02.classList.add('section-niveis');
}
function btnFinalizarQuizz() {
    const section02 = document.querySelector('.section02');
    const section03 = document.querySelector('.section03');
    section02.classList.remove('section-niveis');
    section02.classList.add('escondido');
    section03.classList.remove('escondido');
    section03.classList.add('section-finalizer-Quizz');
}
function voltarHome() {
    window.location.replace("index.html");

}
buscaQuizzes();
