const dino = document.getElementById("dino");
const cacto = document.getElementById("cacto");
const jogo = document.querySelector(".jogo");
const scoreTexto = document.getElementById("score");
const highscoreTexto = document.getElementById("highscore");

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let jogoRodando = true;

// Inicializa o recorde
highscoreTexto.innerText = String(highscore).padStart(5, '0');

// Contagem de pontos
const contarPontos = setInterval(function() {
    if (!jogoRodando) return;
    score++;
    scoreTexto.innerText = String(score).padStart(5, '0');
}, 100);

// Função de pular
function pular(event) {
    // Impede o pulo se o jogo acabou ou se for uma tecla que não 'Espaço' ou 'Seta Cima'
    if (!jogoRodando) return;
    if (event.type === "keydown" && event.code !== "Space" && event.code !== "ArrowUp") return;

    if (!dino.classList.contains("pular")) {
        dino.classList.add("pular");
        setTimeout(function () {
            dino.classList.remove("pular");
        }, 500); // Duração igual à da animação CSS
    }
}

// Escuta cliques e teclas
document.addEventListener("keydown", pular);
jogo.addEventListener("click", pular);

// Verificação de Colisão
const verificarColisao = setInterval(function () {
    if (!jogoRodando) return;

    // Posições atuais
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let cactoLeft = parseInt(window.getComputedStyle(cacto).getPropertyValue("left"));

    // Ajuste fino da área de colisão baseada na imagem do dino
    if (cactoLeft < 85 && cactoLeft > 50 && dinoTop <= 40) {
        gameOver();
    }
}, 10);

function gameOver() {
    jogoRodando = false;
    clearInterval(contarPontos);
    clearInterval(verificarColisao);

    // Para as animações
    cacto.style.animation = "none";
    dino.style.animation = "none";

    // Mostra mensagem e atualiza recorde
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreTexto.innerText = String(highscore).padStart(5, '0');
        alert(`NOVO RECORDE! 🎉\nSua pontuação: ${score}`);
    } else {
        alert(`GAME OVER!\nSua pontuação: ${score}\nAtualize para tentar novamente.`);
    }
}