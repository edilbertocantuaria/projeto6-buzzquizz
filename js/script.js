let listaDeQuizz = [];

function obeterTodosOsQuizz(){
    const listQuizz = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    listQuizz.then(quizzs);   
}
function quizzs(quizz){
    listaDeQuizz = quizz.data;
    console.log(listaDeQuizz);
    renderizarQuizzs();
}
function renderizarQuizzs(){
    const ul = document.querySelector('.todos-os-quizz');
    ul.innerHTML = '';
    for(let i = 0; i < listaDeQuizz.length; i++){
        let title = listaDeQuizz[i].title;
        let img = listaDeQuizz[i].image;
    ul.innerHTML += `
        <li class="quizz">
            <img src="${img}">
            <p>${title}</p>
        </li>
    `
    }  
}
function criarQuizz(){
    window.location.assign("../pages/page02.html");
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
obeterTodosOsQuizz();
