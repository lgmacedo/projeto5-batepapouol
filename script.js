/* ============== VARIÁVEIS GLOBAIS ================================================================================= */
let nomeUsuario;
let destinatario = "Todos";
let tipoMsg = "message";

const cincoSegundos = 5000;
const tresSegundos = 3000;
const dezSegundos = 10000;

/* ============== USUÁRIOS ================================================================================= */
function tratarSucessoUsuario(dados){
    setInterval(mantemOnline, cincoSegundos);
    document.querySelector('.entrada').remove();
    document.querySelector('header').classList.remove('escondido');
    document.querySelector('main').classList.remove('escondido');
    document.querySelector('footer').classList.remove('escondido');
    buscaMensagens();
    setInterval(buscaMensagens, tresSegundos);
    buscaParticipantes();
    setInterval(buscaParticipantes, dezSegundos);
    document.querySelector('footer input').style.setProperty("--c", "black");
    document.querySelector('footer input').style.setProperty("--f", "italic");
}

function buscaParticipantes(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promessa.then(tratarSucessoParticipantes);
}

function tratarSucessoParticipantes(recebido){
    const participante = recebido.data;
    document.querySelector('.participantesOnline').innerHTML = "";
    for(let i = 0; i<participante.length; i++){
        document.querySelector('.participantesOnline').innerHTML += 
        `<div data-test = "participant" onclick="marcaDestinatario(this)" class="interiorParticipante">
            <ion-icon name="person-circle-sharp"></ion-icon>
            <p>${participante[i].name}</p>
            <div class="checkVerdeDestinatario escondido">
                <ion-icon data-test = "check" name="checkmark-sharp"></ion-icon>
            </div>
        </div>`
    }
}

function mantemOnline(){
    const Status = {name:nomeUsuario};
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", Status);
}

function tratarErroUsuario(dados){
    document.querySelector('.carregando').classList.add('escondido');
    document.querySelector('.entrada input').classList.remove('escondido');
    document.querySelector('.entrada button').classList.remove('escondido');
    const numErroUsuarioJaLogado = 400;
    if(dados.response.status===numErroUsuarioJaLogado){
        alert("Usuário já logado. Insira outro nome");
    }else{
        alert("Erro. Tente novamente");
    }
    document.querySelector('.entrada input').value = "";
}

function perguntaNome(){
    nomeUsuario = document.querySelector('.entrada input').value;
    document.querySelector('.carregando').classList.remove('escondido');
    document.querySelector('.entrada input').classList.add('escondido');
    document.querySelector('.entrada button').classList.add('escondido');
    const Usuario = {name:nomeUsuario};
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", Usuario);
    promessa.then(tratarSucessoUsuario);
    promessa.catch(tratarErroUsuario);
}

/* ============== MENSAGENS ================================================================================= */
function buscaMensagens(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(tratarSucessoMensagens);
}

function tratarSucessoMensagens(recebido){
    const mensagem = recebido.data;
    const innerAnterior = document.querySelector('main').innerHTML;
    document.querySelector('main').innerHTML = "";
    for(let i=0; i<mensagem.length; i++){
        if(mensagem[i].type === "message"){
            document.querySelector('main').innerHTML += 
            `<div data-test="message">
                <span class="fontColorGrey">(${mensagem[i].time})</span>&nbsp;
                <span class="font700">${mensagem[i].from}</span>
                para
                <span class="font700">${mensagem[i].to}</span>: ${mensagem[i].text}
            </div>`
        }else if(mensagem[i].type === "status"){
            document.querySelector('main').innerHTML += 
            `<div data-test="message" class="bgCinza">
                <span class="fontColorGrey">(${mensagem[i].time})</span>&nbsp;
                <span class="font700">${mensagem[i].from}</span>
                ${mensagem[i].text}
            </div>`
        }else if(mensagem[i].type === "private_message" && (mensagem[i].to === nomeUsuario || mensagem[i].from === nomeUsuario)){
            document.querySelector('main').innerHTML += 
            `<div data-test="message" class="bgVermelho">
                <span class="fontColorGrey">(${mensagem[i].time})</span>&nbsp;
                <span class="font700">${mensagem[i].from}</span>
                reservadamente para
                <span class="font700">${mensagem[i].to}</span>: ${mensagem[i].text} 
            </div>`
        }
    }
    document.querySelector('main').innerHTML += `<aside><aside>`;
    if(document.querySelector('main').innerHTML !== innerAnterior){
        document.querySelector('aside').scrollIntoView();
    }
}

function mensagemEnviada(){
    document.querySelector('footer input').value = "";
    buscaMensagens();
}

function mensagemNãoEnviada(){
    window.location.reload();
}

function enviaMensagem(){
    const mensagem = document.querySelector('footer input').value;
    const msgObj = { 
        from: nomeUsuario,
        to: destinatario,
        text: mensagem,
        type: tipoMsg
    };
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msgObj);
    promessa.then(mensagemEnviada);
    promessa.catch(mensagemNãoEnviada);
}

/* ============== PARTICIPANTES ATIVOS ================================================================= */
function abreParticipantes(){
    document.querySelector('.overlayPreto').classList.remove('escondido');
    document.querySelector('.participantesBranco').classList.remove('escondido');
}

function fechaParticipantes(){
    document.querySelector('.overlayPreto').classList.add('escondido');
    document.querySelector('.participantesBranco').classList.add('escondido');
}

function marcaVisibilidade(qual){
    const checkPublico = document.querySelector('.publico .checkVerdeVisibilidade');
    if(!(checkPublico.classList.contains('escondido')));
        checkPublico.classList.add('escondido');
    const checkReservado = document.querySelector('.reservadamente .checkVerdeVisibilidade');
    if(!(checkReservado.classList.contains('escondido')));
        checkReservado.classList.add('escondido');
    qual.querySelector('.checkVerdeVisibilidade').classList.remove('escondido');
    if(qual.classList.contains('reservadamente')){
        tipoMsg = "private_message";
        document.querySelector('.textoInf').innerHTML = `Enviando para ${destinatario} (reservadamente)`
    }else{
        tipoMsg = "message"
        document.querySelector('.textoInf').innerHTML = `Enviando para ${destinatario}`
    }
}

function marcaDestinatario(qual){
    const marcadoAnteriormente = document.querySelector('.checkVerdeDestinatario:not(.escondido)');
    if(marcadoAnteriormente!==null){
        marcadoAnteriormente.classList.add('escondido');
    }
    qual.querySelector('.checkVerdeDestinatario').classList.remove('escondido');
    destinatario = qual.querySelector('p').innerHTML;
    if(tipoMsg === "message")
        document.querySelector('.textoInf').innerHTML = `Enviando para ${destinatario}`
    if(tipoMsg === "private_message")
        document.querySelector('.textoInf').innerHTML = `Enviando para ${destinatario} (reservadamente)`
}

/* ============== SCRIPT DE FATO ================================================================= */
// configuração do Inserir Nome com Enter
document.querySelector('.entrada input').addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    perguntaNome();
  }
});

// configuração do Enviar Mensagem com Enter
document.querySelector('footer input').addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    enviaMensagem();
  }
});