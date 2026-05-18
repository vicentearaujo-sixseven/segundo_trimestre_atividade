const dino = document.getElementById("dino");
const cacto = document.getElementById("cacto");

// Função para fazer o dinossauro pular
function pular() {
    if (!dino.classList.contains("pular")) {
        dino.classList.add("pular");

        setTimeout(function () {
            dino.classList.remove("pular");
        }, 500); // Tempo da animação do pulo
    }
}

// Escuta qualquer tecla pressionada para pular
document.addEventListener("keydown", function (event) {
    pular();
});

// Loop para verificar colisão (Game Over)
const verificarColisao = setInterval(function () {
    // Pega a posição vertical atual do dino
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    // Pega a posição horizontal atual do cacto
    let cactoLeft = parseInt(window.getComputedStyle(cacto).getPropertyValue("left"));

    // Se o cacto estiver na área do dino e o dino não estiver alto o suficiente: Game Over
    if (cactoLeft < 90 && cactoLeft > 50 && dinoTop <= 40) {
        cacto.style.animation = "none"; // Para o cacto
        cacto.style.left = `${cactoLeft}px`;
        alert("Game Over! Atualize a página para tentar de novo.");
        clearInterval(verificarColisao);
    }
}, 10);