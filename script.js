/* ============== VARIÁVEIS GLOBAIS ================================================================================= */
let nomeUsuario;
let destinatario = "Todos";
let tipoMsg = "message";
let participantesOnline = [];

/* ============== USUÁRIOS ================================================================================= */
function tratarSucessoUsuario(dados){
    console.log("Deu certo!!!");
    console.log(dados);
    setInterval(mantemOnline, 5000);
    document.querySelector('.entrada').remove();
    document.querySelector('header').classList.remove('escondido');
    document.querySelector('main').classList.remove('escondido');
    document.querySelector('footer').classList.remove('escondido');
    buscaMensagens();
    setInterval(buscaMensagens, 3000);
    buscaParticipantes();
    setInterval(buscaParticipantes, 10000);
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
        document.querySelector('.participantesOnline').innerHTML += `<div onclick="marcaDestinatario(this)" class="interiorParticipante"><ion-icon name="person-circle-sharp"></ion-icon>
        <p>${participante[i].name}</p><div class="checkVerdeDestinatario escondido">
        <ion-icon name="checkmark-sharp"></ion-icon></div></div>`
    }
}

function mantemOnline(){
    const Status = {name:nomeUsuario};
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", Status);
}

function tratarErroUsuario(dados){
    console.log("Deu errado!!!");
    console.log(dados);
    if(dados.response.status===400){
        alert("Usuário já logado. Insira outro nome");
    }else{
        alert("Erro. Tente novamente");
    }
    document.querySelector('.entrada input').value = "";
}

function perguntaNome(){
    nomeUsuario = document.querySelector('.entrada input').value;
    const Usuario = {name:nomeUsuario};
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", Usuario);
    promessa.then(tratarSucessoUsuario);
    promessa.catch(tratarErroUsuario);
}

/* ============== MENSAGENS ================================================================================= */
function buscaMensagens(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(tratarSucessoMensagens);
    promessa.catch(tratarErroMensagens);
}

function tratarSucessoMensagens(recebido){
    console.log("Deu certo!!!");
    console.log(recebido);
    const mensagem = recebido.data;
    const innerAnterior = document.querySelector('main').innerHTML;
    document.querySelector('main').innerHTML = "";
    for(let i=0; i<mensagem.length; i++){
        if(mensagem[i].type === "message"){
            document.querySelector('main').innerHTML += `<div><span class="fontColorGrey">(${mensagem[i].time})</span>&nbsp;<span class="font700">${mensagem[i].from}</span>&nbsp;para&nbsp;<span class="font700">${mensagem[i].to}</span>: ${mensagem[i].text}</div>`
        }else if(mensagem[i].type === "status"){
            document.querySelector('main').innerHTML += `<div class="bgCinza"><span class="fontColorGrey">(${mensagem[i].time})</span>&nbsp;<span class="font700">${mensagem[i].from}</span>&nbsp;${mensagem[i].text}</div>`
        }else if(mensagem[i].type === "private_message" && (mensagem[i].to === nomeUsuario || mensagem[i].from === nomeUsuario)){
            document.querySelector('main').innerHTML += `<div class="bgVermelho"><span class="fontColorGrey">(${mensagem[i].time})</span>&nbsp;<span class="font700">${mensagem[i].from}</span>&nbsp;reservadamente para&nbsp;<span class="font700">${mensagem[i].to}</span>: ${mensagem[i].text} </div>`
        }
    }
    document.querySelector('main').innerHTML += `<aside><aside>`;
    if(document.querySelector('main').innerHTML !== innerAnterior){
        document.querySelector('aside').scrollIntoView();
    }
}

function tratarErroMensagens(dados){
    console.log("Deu errado!!!");
    console.log(dados);
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
    if(!(document.querySelector('.publico .checkVerdeVisibilidade').classList.contains('escondido')));
        document.querySelector('.publico .checkVerdeVisibilidade').classList.add('escondido');
    if(!(document.querySelector('.reservadamente .checkVerdeVisibilidade').classList.contains('escondido')));
        document.querySelector('.reservadamente .checkVerdeVisibilidade').classList.add('escondido');
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
let input1 = document.querySelector('.entrada input');
input1.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    perguntaNome();
  }
});
// configuração do Enviar Mensagem com Enter
let input2 = document.querySelector('footer input');
input2.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    enviaMensagem();
  }
});