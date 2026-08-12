/**
 * CONEXÃO | Portal de Apoio ao Estudante
 * Lógica SPA, Acessibilidade, Quiz Interativo e Formulário de Escuta.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SINGLE PAGE APPLICATION (SPA) ROUTING
       ========================================================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.spa-section');
    const navMenu = document.getElementById('nav-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');

    function navigateTo(sectionId, updateHistory = true) {
        // Ocultar todas as seções
        sections.forEach(sec => sec.classList.remove('active'));

        // Ativar a seção selecionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Atualizar estados dos links do menu
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Fechar menu mobile se estiver aberto
        if (navMenu.classList.contains('mobile-open')) {
            toggleMobileMenu();
        }

        // Histórico de navegação
        if (updateHistory && history.pushState) {
            history.pushState({ section: sectionId }, '', `#${sectionId}`);
        }
    }

    // Event Listener nos links da aplicação
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link');
        if (link) {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            if (sectionId) {
                navigateTo(sectionId);
            }
        }
    });

    // Manipular botão voltar/avançar do navegador
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.section) {
            navigateTo(e.state.section, false);
        } else {
            const hash = window.location.hash.replace('#', '') || 'home';
            navigateTo(hash, false);
        }
    });

    // Carregamento inicial baseado na URL
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        navigateTo(initialHash, false);
    } else {
        navigateTo('home', false);
    }

    /* ==========================================================================
       2. MENU MOBILE (HAMBURGER)
       ========================================================================== */
    function toggleMobileMenu() {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('mobile-open');

        const icon = hamburgerBtn.querySelector('i');
        if (navMenu.classList.contains('mobile-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }

    /* ==========================================================================
       3. FERRAMENTAS DE ACESSIBILIDADE
       ========================================================================== */
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');
    const btnToggleContrast = document.getElementById('btn-toggle-contrast');
    
    let fontScale = 100; // Porcentagem

    if (btnIncreaseFont) {
        btnIncreaseFont.addEventListener('click', () => {
            if (fontScale < 130) {
                fontScale += 10;
                document.documentElement.style.fontSize = `${fontScale}%`;
            }
        });
    }

    if (btnDecreaseFont) {
        btnDecreaseFont.addEventListener('click', () => {
            if (fontScale > 90) {
                fontScale -= 10;
                document.documentElement.style.fontSize = `${fontScale}%`;
            }
        });
    }

    if (btnToggleContrast) {
        btnToggleContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
    }

    /* ==========================================================================
       4. PORTAL DE ESCUTA (FORMULÁRIO E FRASES MOTIVACIONAIS)
       ========================================================================== */
    const listeningForm = document.getElementById('listening-form');
    const listeningResponse = document.getElementById('listening-response');
    const btnResetForm = document.getElementById('btn-reset-form');
    const motivationalQuote = document.getElementById('motivational-quote');

    const quotes = [
        '"Pedir ajuda não é fraqueza, é um ato de coragem."',
        '"Você merece ser tratado com respeito, dentro e fora da internet."',
        '"Não precisa enfrentar tudo sozinho. Falar alivia o peso."',
        '"Sua voz e seus sentimentos têm valor."'
    ];

    let quoteIndex = 0;
    setInterval(() => {
        if (motivationalQuote) {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            motivationalQuote.style.opacity = '0';
            setTimeout(() => {
                motivationalQuote.textContent = quotes[quoteIndex];
                motivationalQuote.style.opacity = '1';
            }, 300);
        }
    }, 5000);

    if (listeningForm) {
        listeningForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (listeningForm.checkValidity()) {
                listeningForm.classList.add('hidden');
                listeningResponse.classList.remove('hidden');
                listeningForm.reset();
            } else {
                alert('Por favor, preencha todos os campos antes de enviar.');
            }
        });
    }

    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            listeningResponse.classList.add('hidden');
            listeningForm.classList.remove('hidden');
        });
    }

    /* ==========================================================================
       5. QUIZ INTERATIVO
       ========================================================================== */
    const quizData = [
        {
            question: "1. Um perfil anônimo começa a deixar comentários ofensivos diariamente nas fotos de um colega de turma. Isso pode ser considerado cyberbullying?",
            options: [
                "Não, pois na internet as pessoas têm direito de comentar o que quiserem.",
                "Sim. O envio contínuo de mensagens ofensivas e humilhantes caracteriza cyberbullying.",
                "Apenas se as mensagens contiverem ameaças físicas diretas.",
                "Não, basta o colega excluir a conta que o problema desaparece."
            ],
            correct: 1,
            explanation: "Exato! A persistência em humilhar ou constranger alguém no ambiente virtual é caracterizada como cyberbullying."
        },
        {
            question: "2. Qual das seguintes opções representa a senha mais segura para proteger suas contas virtuais?",
            options: [
                "12345678",
                "suadata_de_nascimento",
                "K9#mP!2x$QL8",
                "nome_do_seu_pet"
            ],
            correct: 2,
            explanation: "Correto! Senhas fortes combinam letras maiúsculas, minúsculas, números e caracteres especiais sem formar padrões óbvios."
        },
        {
            question: "3. Se você for vítima de chantagem ou mensagens intimidadoras na internet, qual deve ser o primeiro passo?",
            options: [
                "Responder na mesma moeda para se defender imediatamente.",
                "Apagar todas as conversas e fingir que nada aconteceu.",
                "Guardar as provas (prints) e contar para um adulto de confiança.",
                "Compartilhar as mensagens com todos os amigos da escola."
            ],
            correct: 2,
            explanation: "Perfeito! Registrar as provas (fazer prints) é essencial para validar a denúncia junto aos responsáveis ou autoridades."
        },
        {
            question: "4. É seguro compartilhar seu endereço, telefone e horário das suas aulas em fóruns abertos de jogos ou redes sociais públicas?",
            options: [
                "Sim, desde que seja apenas com pessoas que jogam no mesmo time.",
                "Não. Dados pessoais nunca devem ser expostos publicamente a desconhecidos.",
                "Sim, não há perigo algum em divulgar a escola onde estuda.",
                "Apenas se você utilizar um apelido (nickname) carinhoso."
            ],
            correct: 1,
            explanation: "Certo! Preservar sua localização e rotina é fundamental para garantir sua segurança física e digital."
        },
        {
            question: "5. O que você faria ao perceber que um amigo da escola está sendo isolado e ridicularizado em um grupo de mensagens?",
            options: [
                "Não faria nada, pois não é um problema meu.",
                "Entraria na brincadeira para não virar o próximo alvo.",
                "Ofereceria apoio ao colega no privado e avisaria a orientação da escola.",
                "Riria da situação junto com os outros integrantes."
            ],
            correct: 2,
            explanation: "Acolhimento perfeito! Demonstrar empatia e acionar a mediação escolar ajuda a interromper o ciclo de hostilidade."
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    // Elementos DOM do Quiz
    const quizIntro = document.getElementById('quiz-intro');
    const quizBody = document.getElementById('quiz-body');
    const quizResult = document.getElementById('quiz-result');
    const btnStartQuiz = document.getElementById('btn-start-quiz');
    const btnNextQuestion = document.getElementById('btn-next-question');
    const btnRestartQuiz = document.getElementById('btn-restart-quiz');
    
    const quizQuestionTitle = document.getElementById('quiz-question-title');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    const quizStepText = document.getElementById('quiz-step-text');
    const quizScoreLive = document.getElementById('quiz-score-live');
    const quizProgressFill = document.getElementById('quiz-progress-fill');
    const quizFeedback = document.getElementById('quiz-feedback');

    function startQuiz() {
        currentQuestion = 0;
        score = 0;
        quizIntro.classList.add('hidden');
        quizResult.classList.add('hidden');
        quizBody.classList.remove('hidden');
        loadQuestion();
    }

    function loadQuestion() {
        const q = quizData[currentQuestion];
        quizQuestionTitle.textContent = q.question;
        quizStepText.textContent = `Pergunta ${currentQuestion + 1} de ${quizData.length}`;
        quizScoreLive.textContent = `Acertos: ${score}`;
        quizProgressFill.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
        
        quizOptionsContainer.innerHTML = '';
        quizFeedback.classList.add('hidden');
        btnNextQuestion.classList.add('hidden');

        q.options.forEach((opt, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-opt-btn';
            button.textContent = opt;
            button.addEventListener('click', () => selectAnswer(index));
            quizOptionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedIndex) {
        const q = quizData[currentQuestion];
        const buttons = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');

        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === q.correct) {
            score++;
            buttons[selectedIndex].classList.add('correct');
            quizFeedback.textContent = `✨ ${q.explanation}`;
            quizFeedback.className = 'quiz-feedback-msg correct-fb';
        } else {
            buttons[selectedIndex].classList.add('wrong');
            buttons[q.correct].classList.add('correct');
            quizFeedback.textContent = `💡 ${q.explanation}`;
            quizFeedback.className = 'quiz-feedback-msg wrong-fb';
        }

        quizScoreLive.textContent = `Acertos: ${score}`;
        quizFeedback.classList.remove('hidden');
        btnNextQuestion.classList.remove('hidden');
    }

    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        quizBody.classList.add('hidden');
        quizResult.classList.remove('hidden');

        const percentage = Math.round((score / quizData.length) * 100);
        const resultScoreText = document.getElementById('result-score-text');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const resultIcon = document.getElementById('result-icon');

        resultScoreText.textContent = `Você acertou ${score} de ${quizData.length} perguntas (${percentage}%)`;

        if (score === 5) {
            resultTitle.textContent = "Mandou muito bem! 🎉";
            resultMessage.textContent = "Você demonstrou um ótimo conhecimento sobre segurança digital e respeito na internet. Continue espalhando boas atitudes!";
            resultIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
        } else if (score >= 3) {
            resultTitle.textContent = "Muito bem! 👍";
            resultMessage.textContent = "Você já sabe bastante sobre segurança e convivência digital. Continue explorando o portal para aprender ainda mais.";
            resultIcon.innerHTML = '<i class="fa-solid fa-star"></i>';
        } else {
            resultTitle.textContent = "Tudo bem! 😊";
            resultMessage.textContent = "O mais importante é aprender. Revise as informações das nossas seções e tente novamente quando quiser!";
            resultIcon.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
    }

    if (btnStartQuiz) btnStartQuiz.addEventListener('click', startQuiz);
    if (btnNextQuestion) btnNextQuestion.addEventListener('click', nextQuestion);
    if (btnRestartQuiz) btnRestartQuiz.addEventListener('click', startQuiz);

    /* ==========================================================================
       6. BOTÃO VOLTAR AO TOPO
       ========================================================================== */
    const btnTop = document.getElementById('btn-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btnTop.classList.add('visible');
        } else {
            btnTop.classList.remove('visible');
        }
    });

    if (btnTop) {
        btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});