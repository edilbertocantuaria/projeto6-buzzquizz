// =============================================== VARIAVEIS GLOBAIS =============================================== 

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

let contador = 0;


// =========================================== TELA 1: LISTA DE QUIZZES ===========================================

// requisicao axios --> buscar todos os quizzes
function buscaQuizzes() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v2/buzzquizz/quizzes");
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
                        <li class="my-list-quizz ${quizzesData[i].id}" 
                        onclick="selecionaQuizz(this)"
                        style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, 
                        rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzesData[i].image}); 
                        background-size: cover;"
                        >
                            <img src=${quizzesData[i].image}>
                            <p>${quizzesData[i].title}</p>
                        </li>
                    `
                    // armazenar objeto quizz na lista
                    quizzesUsuario.push(quizzesData[i]);

                    elementoUserList.innerHTML += quizz;
                } else {
                    quizz = `
                        <li class="quizz ${quizzesData[i].id}" 
                        onclick="selecionaQuizz(this)"
                        style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, 
                        rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzesData[i].image}); 
                        background-size: cover;"
                        >
                            <img src=${quizzesData[i].image}>
                            <p>${quizzesData[i].title}</p>
                        </li>
                    `
                    // armazenar objeto quizz na lista
                    quizzesServidor.push(quizzesData[i]);

                    // armazenar o id do quizz na lista
                    listaIdsServidor.push(quizzesData[i].id);

                    elementoServerList.innerHTML += quizz;
                    // console.log(quizz);
                }
            }
        } else {
            quizz = `
                <li class="quizz ${quizzesData[i].id}" 
                onclick="selecionaQuizz(this)" 
                style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, 
                rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzesData[i].image}); 
                background-size: cover;">
                    <p>${quizzesData[i].title}</p>
                </li>
            `
            // armazenar objeto quizz na lista
            quizzesServidor.push(quizzesData[i]);

            // armazenar o id do quizz na lista
            listaIdsServidor.push(quizzesData[i].id);

            elementoServerList.innerHTML += quizz;
            // console.log(quizz);
        }
    }
}

// funcao executada quando algum quizz e clicado
function selecionaQuizz(quizzSelecionado) {
    // quizzSelecionado.classList.add("selecionado");
    // console.log(quizzSelecionado);

    for (let k = 0; k < quizzesData.length; k++) {
        const classeId = quizzesData[k].id;

        if (quizzSelecionado.classList.contains(classeId.toString())) {
            idSelecionado = classeId;
        }
        // nao sei o que por no else :(
    }

    // clicar em um quizz na tela 1 --> mostrar tela 2
    const elementoTela01 = document.querySelector(".tela01");
    const elementoTela02 = document.querySelector(".tela02");
    elementoTela01.classList.add("escondido");
    elementoTela02.classList.remove("escondido");

    buscaQuizz();
}


// ==================================== TELA 2: PÁGINA DE UM QUIZZ (PERGUNTAS) ====================================
// requisicao axios --> buscar dados do quiz clicado
function buscaQuizz() {
    const promise = axios.get(`https://mock-api.driven.com.br/api/v2/buzzquizz/quizzes/${idSelecionado}`);
    promise.then(tratarSucesso);
}

function tratarSucesso(resposta) {
    // console.log(resposta);
    quizzData = resposta.data;
    // console.log(quizzData);

    renderizarBaner();
    renderizarPerguntas();
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

function renderizarPerguntas() {
    const elementoQuizzContainer = document.querySelector(".quizz-container");
    console.log(elementoQuizzContainer);
    const perguntas = quizzData.questions;
    // console.log(perguntas);
    let pergunta = "";
    let resposta = "";

    elementoQuizzContainer.innerHTML = "";

    for (let l = 0; l < perguntas.length; l++) {

        let respostas = [];

        pergunta = `
            <section class="gamer-quizz">
                <div class="titulo-quizz">
                    <h3>${perguntas[l].title}</h3>
                </div>
                <div class="quizz-pergunta pendente">

                </div>
            </section>
        `
        elementoQuizzContainer.innerHTML += pergunta;

        for (let m = 0; m < 4; m++) {
            const img = perguntas[l].answers[m].image;
            const texto = perguntas[l].answers[m].text;
            const classeTrueOrFalse = perguntas[l].answers[m].isCorrectAnswer;

            resposta = `
                <div class="card ${classeTrueOrFalse}" 
                style="background-image: url(${img}); 
                background-size: cover;"
                onclick="selecionaResposta(this)">
                    <p>${texto}</p>
                </div>
            `
            respostas.push(resposta);
        }

        const elementoQuizzPergunta = document.querySelector(".pendente");
        respostas.sort(comparador);
        for (let n = 0; n < 4; n++) {
            elementoQuizzPergunta.innerHTML += respostas[n];
        }

        elementoQuizzPergunta.classList.remove("pendente");
        // console.log(respostas);
    }
}

function comparador() {
    return Math.random() - 0.5;
}

// funcao executada quando alguma resposta e clicada
function selecionaResposta(respostaSelecionada) {
    const elementoQuizzPergunta = respostaSelecionada.parentNode;
    elementoQuizzPergunta.classList.add("pergunta-atual");
    respostaSelecionada.classList.add("resposta-selecionada");
    console.log(elementoQuizzPergunta);
    respostaSelecionada.classList.add("selecionada");
    // console.log(respostaSelecionada);
    // const respostasOfuscadas = respostaSelecionada.siblings();
    // console.log(respostasOfuscadas);
}


// ====================================== Botões de navegação das paginas ======================================
function criarQuizz() {
    const main = document.querySelector('.main');
    const page02 = document.querySelector('.tela03');
    main.classList.remove('main');
    main.classList.add('escondido');
    page02.classList.add('main-criandoQuizz');
    page02.classList.remove('escondido');
}

function btnProssseguir() { // validação da primeira página
    const titulo = document.querySelector('.title').value;
    const urlImg = document.querySelector('.urlImg').value;
    const qtdPerguntas = Number(document.querySelector('.qtdPerguntas').value);
    const qtdNiveis = Number(document.querySelector('.qtdNiveis').value);
    const criandoQuizz = document.querySelector('.section-quizz');
    /*console.log(titulo);
    console.log(urlImg);
    console.log(qtdPerguntas);
    console.log(qtdNiveis);
    console.log(titulo.length);*/
    if (titulo.length >= 22) {
        contador += 1;
    } else {
        alert('O campu deve ter no meninimo 22 caracteres!')
    }
    if (urlImg.includes('http') || urlImg !== "") {
        contador += 1;
    } else {
        alert('Prencha o campu com um link da imagem')
    }
    if (qtdPerguntas >= 2) {
        contador += 1;
    } else {
        alert('Por favor o quizz deve ter no minimo duas perguntas!')
    }
    if (qtdNiveis !== 0 || qtdNiveis >= 1) {
        contador += 1;
    } else {
        alert('Por favor prencha o compu corretamente!')
    }
    if (contador === 4) {
        const criarPerguntas = document.querySelector('.section01');
        criandoQuizz.classList.remove('section-quizz');
        criarPerguntas.classList.remove('escondido');
        criarPerguntas.classList.add('section-quizz');
    } else {
        return;
    }
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
function acessarQuizz() {
    const tela03 = document.querySelector('.tela03');
    const tela02 = document.querySelector('.tela02');
    tela03.classList.remove('tela03');
    tela03.classList.add('escondido');
    tela02.classList.remove('escondido');
}
function voltarHome() {
    const section03 = document.querySelector('.section03');
    const tela01 = document.querySelector('.tela01');
    const criarQuizz = document.querySelector('.criar-quizz');
    const userQuizz = document.querySelector('.my-quizz');
    section03.classList.remove('section03');
    tela01.classList.remove('escondido');
    criarQuizz.classList.remove('criar-quizz');
    userQuizz.classList.remove('escondido');
}
buscaQuizzes();
