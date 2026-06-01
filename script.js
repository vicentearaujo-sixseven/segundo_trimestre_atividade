const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const elementoPlacar = document.getElementById("placar");

const tamanhoBloco = 20;
const quantidadeBlocos = canvas.width / tamanhoBloco;

let cobra = [];
let direcaoX = 0;
let direcaoY = 0;
let macaX = 0;
let macaY = 0;
let pontuacao = 0;
let jogoAtivo = true;
let loopJogo;
const velocidade = 100; // Milissegundos por atualização

function iniciarJogo() {
    cobra = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direcaoX = 1;
    direcaoY = 0;
    pontuacao = 0;
    elementoPlacar.innerText = "Pontuação: " + pontuacao;
    jogoAtivo = true;
    gerarMaca();
    
    if (loopJogo) clearInterval(loopJogo);
    loopJogo = setInterval(atualizar, velocidade);
}

function gerarMaca() {
    macaX = Math.floor(Math.random() * quantidadeBlocos);
    macaY = Math.floor(Math.random() * quantidadeBlocos);

    // Evita que a maçã surja dentro do corpo da cobra
    for (let parte of cobra) {
        if (parte.x === macaX && parte.y === macaY) {
            gerarMaca();
            break;
        }
    }
}

function atualizar() {
    if (!jogoAtivo) return;

    moverCobra();
    verificarColisao();
    
    if (jogoAtivo) {
        limparTela();
        desenharMaca();
        desenharCobra();
    }
}

function moverCobra() {
    const cabeca = { x: cobra[0].x + direcaoX, y: cobra[0].y + direcaoY };
    cobra.unshift(cabeca);

    if (cabeca.x === macaX && cabeca.y === macaY) {
        pontuacao += 10;
        elementoPlacar.innerText = "Pontuação: " + pontuacao;
        gerarMaca();
    } else {
        cobra.pop();
    }
}

function verificarColisao() {
    const cabeca = cobra[0];

    // Colisão com bordas
    if (cabeca.x < 0 || cabeca.x >= quantidadeBlocos || cabeca.y < 0 || cabeca.y >= quantidadeBlocos) {
        fimDeJogo();
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < cobra.length; i++) {
        if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
            fimDeJogo();
        }
    }
}

function fimDeJogo() {
    jogoAtivo = false;
    clearInterval(loopJogo);
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FIM DE JOGO", canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText("Pressione ESPAÇO para reiniciar", canvas.width / 2, canvas.height / 2 + 25);
}

function limparTela() {
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function desenharCobra() {
    cobra.forEach((parte, index) => {
        ctx.fillStyle = index === 0 ? "#00ff88" : "#00b35f";
        ctx.strokeStyle = "#050505";
        ctx.lineWidth = 2;
        
        ctx.fillRect(parte.x * tamanhoBloco, parte.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        ctx.strokeRect(parte.x * tamanhoBloco, parte.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
    });
}

function desenharMaca() {
    ctx.fillStyle = "#ff3b30";
    ctx.fillRect(macaX * tamanhoBloco, macaY * tamanhoBloco, tamanhoBloco, tamanhoBloco);
}

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direcaoY !== 1) { direcaoX = 0; direcaoY = -1; }
            break;
        case "ArrowDown":
            if (direcaoY !== -1) { direcaoX = 0; direcaoY = 1; }
            break;
        case "ArrowLeft":
            if (direcaoX !== 1) { direcaoX = -1; direcaoY = 0; }
            break;
        case "ArrowRight":
            if (direcaoX !== -1) { direcaoX = 1; direcaoY = 0; }
            break;
        case " ":
            if (!jogoAtivo) iniciarJogo();
            break;
    }
});

iniciarJogo();