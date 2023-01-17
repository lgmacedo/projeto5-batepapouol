/* ============== USUÁRIO ================================================================================= */
let nomeUsuario;
let destinatario = "Todos";
let tipoMsg = "message";

function tratarSucessoUsuario(dados){
    console.log("Deu certo!!!");
    console.log(dados);
    setInterval(mantemOnline, 5000);
}

function mantemOnline(){
    const Status = {name:nomeUsuario};
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", Status);
}

function tratarErroUsuario(dados){
    console.log("Deu errado!!!");
    console.log(dados);
    perguntaNome();
}

function perguntaNome(){
    nomeUsuario = prompt("Insira o seu nome");
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
    document.querySelector('input').value = "";
    buscaMensagens();
}

function mensagemNãoEnviada(){
    window.location.reload();
}

function enviaMensagem(){
    const mensagem = document.querySelector('input').value;
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

/* ============== SCRIPT DE FATO ================================================================= */
perguntaNome();
buscaMensagens();
setInterval(buscaMensagens, 3000);