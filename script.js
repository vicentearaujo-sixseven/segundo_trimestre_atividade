const dino = document.getElementById("dino");
const cacto = document.getElementById("cacto");
const scoreTexto = document.getElementById("score");
const highscoreTexto = document.getElementById("highscore");

let score = 0;
let highscore = localStorage.getItem("highscore") || 0; // Recupera o recorde salvo

// Carrega o recorde na tela ao iniciar
highscoreTexto.innerText = String(highscore).padStart(5, '0');

// Atualiza o Score a cada 100ms
const contarPontos = setInterval(function() {
    score++;
    // Formata o número para ter sempre 5 dígitos (ex: 00015)
    scoreTexto.innerText = String(score).padStart(5, '0');
}, 100);

// Função para fazer o dinossauro pular
function pular() {
    if (!dino.classList.contains("pular")) {
        dino.classList.add("pular");

        setTimeout(function () {
            dino.classList.remove("pular");
        }, 500);
    }
}

// Escuta teclas para pular
document.addEventListener("keydown", function (event) {
    pular();
});

// Loop para verificar colisão (Game Over)
const verificarColisao = setInterval(function () {
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    let cactoLeft = parseInt(window.getComputedStyle(cacto).getPropertyValue("left"));

    if (cactoLeft < 90 && cactoLeft > 50 && dinoTop <= 40) {
        // Para as animações e contagens
        cacto.style.animation = "none";
        cacto.style.left = `${cactoLeft}px`;
        clearInterval(verificarColisao);
        clearInterval(contarPontos);

        // Verifica se bateu o recorde
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore); // Salva o novo recorde
            highscoreTexto.innerText = String(highscore).padStart(5, '0');
            alert(`Novo Recorde! Você fez ${score} pontos.`);
        } else {
            alert(`Game Over! Pontuação: ${score}. Atualize para tentar de novo.`);
        }
    }
}, 10);