// criar duas listas, uma para os quizzes do usuario e outra para os demais quizzes
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
buscaQuizzes()

function renderizarQuizzes(resposta) {
    // console.log(resposta);
    const quizzesData = resposta.data;
    console.log(quizzesData);
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

