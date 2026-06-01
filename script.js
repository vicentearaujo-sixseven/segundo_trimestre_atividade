const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const elementoPlacar = document.getElementById("placar");
const elementoNivel = document.getElementById("nivel");

// Cria dinamicamente o indicador de nível no HTML caso não exista
if (!document.getElementById("nivel")) {
    const painel = document.createElement("div");
    painel.className = "paineis";
    elementoPlacar.parentNode.insertBefore(painel, canvas);
    painel.appendChild(elementoPlacar);
    
    const nivelDiv = document.createElement("div");
    nivelDiv.id = "nivel";
    nivelDiv.innerText = "Nível: 1";
    painel.appendChild(nivelDiv);
}

const tamanhoBloco = 20;
const quantidadeBlocos = canvas.width / tamanhoBloco;

let cobra = [];
let direcaoX = 0;
let direcaoY = 0;
let macaX = 0;
let macaY = 0;
let pontuacao = 0;
let nivel = 1;
let jogoAtivo = true;
let loopJogo;
let velocidadeAtual = 120; // Velocidade inicial (mais lenta para permitir upgrades)

function iniciarJogo() {
    cobra = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direcaoX = 1;
    direcaoY = 0;
    pontuacao = 0;
    nivel = 1;
    velocidadeAtual = 120;
    
    atualizarInterface();
    jogoAtivo = true;
    gerarMaca();
    
    configurarTemporizador();
}

function configurarTemporizador() {
    if (loopJogo) clearInterval(loopJogo);
    loopJogo = setInterval(atualizar, velocidadeAtual);
}

function atualizarInterface() {
    elementoPlacar.innerText = "Pontuação: " + pontuacao;
    document.getElementById("nivel").innerText = "Nível: " + nivel;
}

function gerarMaca() {
    macaX = Math.floor(Math.random() * quantidadeBlocos);
    macaY = Math.floor(Math.random() * quantidadeBlocos);

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
        // Upgrade de Pontos: Níveis mais altos dão mais pontos por maçã
        pontuacao += 10 * nivel; 
        verificarUpgrade();
        atualizarInterface();
        gerarMaca();
    } else {
        cobra.pop();
    }
}

// Sistema de Upgrades baseado em metas de pontuação
function verificarUpgrade() {
    let nivelAlvo = nivel;

    if (pontuacao >= 300) {
        nivelAlvo = 4;
    } else if (pontuacao >= 150) {
        nivelAlvo = 3;
    } else if (pontuacao >= 60) {
        nivelAlvo = 2;
    }

    // Se subiu de nível, aplica o upgrade de velocidade
    if (nivelAlvo > nivel) {
        nivel = nivelAlvo;
        // Reduz o tempo de resposta do loop (deixando o jogo mais rápido e desafiador)
        velocidadeAtual = 120 - (nivel * 15); 
        configurarTemporizador();
    }
}

function verificarColisao() {
    const cabeca = cobra[0];

    if (cabeca.x < 0 || cabeca.x >= quantidadeBlocos || cabeca.y < 0 || cabeca.y >= quantidadeBlocos) {
        fimDeJogo();
    }

    for (let i = 1; i < cobra.length; i++) {
        if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
            fimDeJogo();
        }
    }
}

function fimDeJogo() {
    jogoAtivo = false;
    clearInterval(loopJogo);
    
    ctx.fillStyle = "rgba(10, 12, 18, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ff4d4d";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FIM DE JOGO", canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px sans-serif";
    ctx.fillText("Pressione ESPAÇO para reiniciar", canvas.width / 2, canvas.height / 2 + 25);
}

function limparTela() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function desenharCobra() {
    cobra.forEach((parte, index) => {
        // Efeito de degradê anatômico (Cabeça destacada, corpo suavizado)
        if (index === 0) {
            ctx.fillStyle = "#00ffaa"; // Verde neon para a cabeça
        } else {
            // Alterna levemente a tonalidade para dar aspecto de escamas
            ctx.fillStyle = index % 2 === 0 ? "#00cca3" : "#00a382"; 
        }
        
        // Renderização arredondada (mais realista do que blocos rígidos)
        const raio = tamanhoBloco / 2;
        const x = parte.x * tamanhoBloco;
        const y = parte.y * tamanhoBloco;
        
        ctx.beginPath();
        if (index === 0) {
            // Cabeça totalmente redonda
            ctx.arc(x + raio, y + raio, raio - 1, 0, Math.PI * 2);
        } else if (index === cobra.length - 1) {
            // Cauda levemente menor
            ctx.arc(x + raio, y + raio, raio - 4, 0, Math.PI * 2);
        } else {
            // Corpo intermediário semi-arredondado
            ctx.arc(x + raio, y + raio, raio - 2, 0, Math.PI * 2);
        }
        ctx.fill();

        // Brilho nos olhos apenas na cabeça
        if (index === 0) {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
            ctx.arc(x + 14, y + 6, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function desenharMaca() {
    const raio = tamanhoBloco / 2;
    const x = macaX * tamanhoBloco + raio;
    const y = macaY * tamanhoBloco + raio;

    // Desenho tridimensional esférico para a maçã
    const gradiente = ctx.createRadialGradient(x - 3, y - 3, 2, x, y, raio);
    gradiente.addColorStop(0, "#ff6b6b");
    gradiente.addColorStop(1, "#dc2626");

    ctx.fillStyle = gradiente;
    ctx.beginPath();
    ctx.arc(x, y, raio - 1, 0, Math.PI * 2);
    ctx.fill();

    // Folha da maçã
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.ellipse(x + 2, y - 8, 3, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
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