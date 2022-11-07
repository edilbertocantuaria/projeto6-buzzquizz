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

// armazenar a quantidade de perguntas respondidas (tela2)
let count = 0;

// armazenar a quantidade de acertos
let acertos = 0;

// serve de parametro para a scrollagem
let respostaDoBlocoAtual;


// =========================================== TELA 1: LISTA DE QUIZZES ===========================================
buscaQuizzes();

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
    respostaDoBlocoAtual = "";
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
        <div class="teste">
            <div class="sobreposicao escondido"></div>
            <section class="gamer-quizz">
                <div class="titulo-quizz" style="background-color:${perguntas[l].color}">
                    <h3>${perguntas[l].title}</h3>
                </div>
                <div class="quizz-pergunta pendente">

                </div>
            </section>
        </div>
        `
        elementoQuizzContainer.innerHTML += pergunta;

        for (let m = 0; m < 4; m++) {
            const img = perguntas[l].answers[m].image;
            const texto = perguntas[l].answers[m].text;
            const classeTrueOrFalse = perguntas[l].answers[m].isCorrectAnswer;

            resposta = `
                <div class="card" 
                style="background-image: url(${img}); 
                background-size: cover;"
                onclick="selecionaResposta(this)">
                    <p class="${classeTrueOrFalse}">${texto}</p>
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

function scrollar() {
    blocoAtual = respostaDoBlocoAtual.parentNode.parentNode.parentNode;
    // console.log(blocoAtual);
    let proximoBloco = blocoAtual.nextElementSibling;
    // console.log(proximoBloco);

    if (proximoBloco !== null) {
        proximoBloco.scrollIntoView();
    } else {
        const ultimoBloco = document.querySelector(".gameOver");
        ultimoBloco.scrollIntoView();
    }
}

// funcao executada quando alguma resposta e clicada
function selecionaResposta(respostaSelecionada) {
    respostaDoBlocoAtual = respostaSelecionada;
    // console.log(respostaDoBlocoAtual);
    // console.log(respostaSelecionada);
    // pegar a div pai das divs de respostas
    const elementoQuizzPergunta = respostaSelecionada.parentNode;
    const divPai = elementoQuizzPergunta.parentNode;
    // console.log(divPai);
    divPai.previousElementSibling.classList.remove("escondido");
    elementoQuizzPergunta.classList.add("pergunta-selecionada");
    respostaSelecionada.classList.add("resposta-selecionada");
    respostaSelecionada.classList.add("respondeu-essa");
    elementoQuizzPergunta.classList.add("esbranquicar");
    // console.log(elementoQuizzPergunta);
    const elementoResposta = document.querySelector(".respondeu-essa");
    // console.log(elementoResposta);
    const elementoTexto = elementoResposta.childNodes[1];
    console.log(elementoTexto);


    if (elementoTexto.classList.contains("true")) {
        elementoTexto.classList.add("acertô");
        acertos++;
    } else if (elementoTexto.classList.contains("false")) {
        const respostaCerta = document.querySelector(".pergunta-selecionada p.true");
        respostaCerta.classList.add("acertô");
        elementoTexto.classList.add("eroouuu");
    }

    respostaSelecionada.classList.remove("respondeu-essa");
    elementoQuizzPergunta.classList.remove("pergunta-selecionada");

    count++;

    if (count === quizzData.questions.length) {
        renderizarResultado();
    }

    setTimeout(scrollar, 2000);
}

function renderizarResultado() {
    // console.log(count);
    let elementoQuizzContainer = document.querySelector(".quizz-container");
    elementoQuizzContainer.innerHTML += `
        <section class="gameOver">
                    
        </section>
    `
    let elementoTelaResultado = document.querySelector(".gameOver");
    console.log(elementoTelaResultado);
    const listaLevels = quizzData.levels;
    console.log(listaLevels);
    const totalDePerguntas = quizzData.questions.length;
    const pontuacao = (acertos / totalDePerguntas);
    const score = Math.round(100 * pontuacao);
    console.log(score);

    loop: for (let p = 0; p < listaLevels.length; p++) {
        let levelImg = listaLevels[p].image;
        let levelTexto = listaLevels[p].text;
        let levelTitulo = listaLevels[p].title;
        let valorMinimo = listaLevels[p].minValue;
        console.log(valorMinimo);

        // elementoTelaResultado = "";

        if (score == listaLevels[p].minValue) {
            elementoTelaResultado.innerHTML = `
                <div class="porcentagem-de-acertos">
                    <h1>${score}% de acerto: ${levelTitulo}</h1>
                </div>
                <div class="msm-fim-de-jogo">
                    <div class="img-fim-de-jogo" style="background-image: url(${levelImg}); 
                    background-size: cover;">
                    </div>
                    <div>
                        <p>
                            ${levelTexto}
                        </p>
                    </div>
                </div>
                <button onclick="reiniciarQuizz()">Reiniciar Quizz</button>
                <p class="pbtn" onclick="atualizarPag()">Voltar pra home</p>
            `
            break loop;
        } else if (score > listaLevels[p].minValue && score < (listaLevels[p + 1].minValue)) {
            elementoTelaResultado.innerHTML = `
                <div class="porcentagem-de-acertos">
                    <h1>${score}% de acerto: ${levelTitulo}</h1>
                </div>
                <div class="msm-fim-de-jogo">
                    <div>
                        <img src=${levelImg}>
                    </div>
                    <div>
                        <p>
                            ${levelTexto}
                        </p>
                    </div>
                </div>
                <button onclick="reiniciarQuizz()">Reiniciar Quizz</button>
                <p class="pbtn" onclick="atualizarPag()">Voltar pra home</p>
            `
            break loop;
        } else if (score < listaLevels[p].minValue) {
            elementoTelaResultado.innerHTML = `
                <div class="porcentagem-de-acertos">
                    <h1>${score}% de acerto: ${levelTitulo}</h1>
                </div>
                <div class="msm-fim-de-jogo">
                    <div>
                        <img src=${levelImg}>
                    </div>
                    <div>
                        <p>
                            ${levelTexto}
                        </p>
                    </div>
                </div>
                <button onclick="reiniciarQuizz()">Reiniciar Quizz</button>
                <p class="pbtn" onclick="atualizarPag()">Voltar pra home</p>
            `
            break loop;
        }
        // if (score <= listaLevels[p].minValue) {
        //     elementoTelaResultado.innerHTML = `
        //         <div class="porcentagem-de-acertos">
        //             <h1>${score}% de acerto: ${levelTitulo}</h1>
        //         </div>
        //         <div class="msm-fim-de-jogo">
        //             <div>
        //                 <img src=${levelImg}>
        //             </div>
        //             <div>
        //                 <p>
        //                     ${levelTexto}
        //                 </p>
        //             </div>
        //         </div>
        //         <button>Reiniciar Quizz</button>
        //         <p class="pbtn" onclick="voltarHome()">Voltar pra home</p>
        //     `
        //     break;
        // }
    }
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
let titulo, url, qtdPerguntas, qtdNiveis;
const form = document.getElementById('some-form')
form.addEventListener('submit', e => {
    e.preventDefault()
    titulo = document.querySelector('.title').value;
    urlImg = document.querySelector('.urlImg').value;
    qtdPerguntas = Number(document.querySelector('.qtdPerguntas').value);
    qtdNiveis = Number(document.querySelector('.qtdNiveis').value);
    const section = document.querySelector('.section-quizz');
    section.classList.remove('section-quizz');
    const section2 = document.querySelector('.section01');
    section2.classList.remove('escondido');
    renderizarPergts();
})
function renderizarPergts() {
    const forme = document.querySelector('.formeUl');
    for (let i = 0; i < qtdPerguntas; i++) {
        forme.innerHTML +=
            `<div onclick="mostrar(this)" class="test">
        <div class="perguntas">
            <h2>Pergunta ${i + 1}</h2>
            <img src="./img/Vector.png">
        </div>
        <div class="modal-perguntas">
            <div>
                <input class="titulo-pergunta" type="text" placeholder="Texto da pergunta" required minlength="20" maxlength="60">
                <input class="cor-de-fundo" type="text" placeholder="Cor de fundo da pergunta" required">
                <h2>Resposta correta</h2>
                <input class="resposta-correta" type="text" placeholder="Resposta correta" required>
                <input class="img00" type="url" placeholder="URL da imagem" required>
                <h2>Respostas incorretas</h2>
                <input class="resposta-incorreta1" type="text" placeholder="Resposta incorreta 1" required>
                <input class="img01" type="url" placeholder="URL da imagem 1" required>
                <input class="resposta-incorreta2" type="text" placeholder="Resposta incorreta 2" required>
                <input class="img02" type="url" placeholder="URL da imagem 2" required>
                <input class="resposta-incorreta3" type="text" placeholder="Resposta incorreta 3" required>
                <input class="img03" type="url" placeholder="URL da imagem 3" required>
            </div>
        </div>
    </div>`
    }
}
function mostrar(elemento) { // mostrar as perguntas ocultas 
    elemento.querySelector('.modal-perguntas').classList.add('mostrar')
}
let tituloPergunta,
    corDeFundo,
    respostaCorreta,
    img00,
    respostaIncorreta1,
    img01,
    respostaIncorreta2,
    img02,
    respostaIncorreta3,
    img03;
const formPerguntas = document.getElementById('formPerguntas')
formPerguntas.addEventListener('submit', e => {
    e.preventDefault()
    tituloPergunta = document.querySelector('.titulo-pergunta').value;
    corDeFundo = document.querySelector('.cor-de-fundo').value;
    respostaCorreta = document.querySelector('.resposta-correta').valeu;
    img00 = document.querySelector('.img00').value;
    respostaIncorreta1 = document.querySelector('.resposta-incorreta1').value;
    img01 = document.querySelector('.img01').value;
    respostaIncorreta2 = document.querySelector('.resposta-incorreta2').value;
    img02 = document.querySelector('.img02').value;
    respostaIncorreta3 = document.querySelector('.resposta-incorreta3').value;
    img03 = document.querySelector('.img03').value;

    const criarPerguntas = document.querySelector('.section01');
    const section02 = document.querySelector('.section02');
    criarPerguntas.classList.remove('section-quizz');
    criarPerguntas.classList.add('escondido')
    section02.classList.remove('escondio');
    section02.classList.add('section-niveis');
    renderizarNiveis();
})
function renderizarNiveis() {
    const ulNiveis = document.querySelector('.ulNiveis');
    for (let i = 0; i < qtdNiveis; i++) {
        ulNiveis.innerHTML += `
        <div onclick="niveisQuizz(this)">
            <div class="niveis">
                <h2> Nível ${i + 1}</h2>
                <img src="./img/Vector.png">
            </div>
            <div class="modal-perguntas">
                <div>
                <input type="text" placeholder="Título do nível" required>
                <input type="text" placeholder="% de acerto mínima" required>
                <input type="url" placeholder="URL da imagem do nível" required>
                <input type="text" placeholder="Descrição do nível" required>
                </div>
            </div>
        </div>   `
    }
}
function niveisQuizz(n) {
    n.querySelector('.modal-perguntas').classList.add('mostrar');
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
    section03.classList.remove('tela03');
    tela01.classList.remove('escondido');
    criarQuizz.classList.remove('criar-quizz');
    userQuizz.classList.remove('escondido');
}

function atualizarPag() {
    window.location.reload();
}

function reiniciarQuizz() {
    const banner = document.querySelector(".titulo");
    banner.scrollIntoView();
    buscaQuizz();
}
