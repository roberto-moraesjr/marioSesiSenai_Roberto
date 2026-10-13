document.addEventListener('DOMContentLoaded', () => {
    const mario = document.querySelector('.mario');
    const pipe = document.querySelector('.pipe');
    const gameBoard = document.getElementById('game-board');
    const hudPlayerName = document.getElementById('hud-player-name');
    const scoreDisplay = document.getElementById('score-display');
    const jumpTip = document.getElementById('jump-tip');
    const startModal = document.getElementById('start-modal');
    const startForm = document.getElementById('start-form');
    const playerInput = document.getElementById('player-input');
});

let currentPlayer = '';
let score = 0;
let isPlaying = false;
let gameLoop = null;
let scoreLoop = null;

const savedName = localStorage.getItem('mario_jump_player');
if (savedName && playerInput) {
    playerInput.value = savedName;
}

startForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const nameValue = playerInput.value.trim();
    if (!nameValue) {
        playerInput.focus();
        return;
    }

    currentPlayer = nameValue;
    localStorage.setItem('mario_jump_player', currentPlayer);

    // Fecha tela de início e começa o jogo
    startModal.classList.remove('active');
    startGame();
});

function startGame() {
    // Limpa loops anteriores se existirem
    clearInterval(gameLoop);
    clearInterval(scoreLoop);

    // Reseta posições e visuais
    resetElements();

    isPlaying = true;
    score = 0;
    scoreDisplay.textContent = '0';
    hudPlayerName.textContent = currentPlayer || 'Jogador';

    // Ativa animações CSS do jogo
    gameBoard.classList.add('running');

    // Loop de pontuação progressiva (1 ponto a cada 100ms)
    scoreLoop = setInterval(() => {
        if (isPlaying) {
            score += 1;
            scoreDisplay.textContent = score;
        }
    }, 100);

    // Loop de colisão
    gameLoop = setInterval(checkCollision, 10);
}

function resetElements() {
    // Reseta cano
    pipe.style.animation = '';
    pipe.style.left = '';

    // Reseta Mario
    mario.src = 'imagens/mario.gif';
    mario.style.animation = '';
    mario.style.bottom = '0px';
    mario.style.width = '';
    mario.style.marginLeft = '';
    mario.classList.remove('jump');

    if (jumpTip) {
        jumpTip.style.opacity = '1';
    }
}

function jump() {
    if (!isPlaying) return;
    if (mario.classList.contains('jump')) return;

    mario.classList.add('jump');

    if (jumpTip) {
        jumpTip.style.opacity = '0';
    }

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp') {
        if (isPlaying) {
            e.preventDefault();
            jump();
        }
    }
});

function triggerGameOver(pipePosition, marioPosition) {
    isPlaying = false;
    clearInterval(gameLoop);
    clearInterval(scoreLoop);

    // Remove classe running para parar animações gerais
    gameBoard.classList.remove('running');

    // Congela o cano na posição exata da colisão
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;


    // Congela o Mario na altura exata e muda para a imagem de Game Over
    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = 'imagens/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    // Atualiza modal de Game Over
    finalScoreValue.textContent = score;
    saveStatusMsg.textContent = 'Salvando pontuação no banco...';
    saveStatusMsg.style.color = '#ffcc00';

    // Abre modal de Game Over
    gameoverModal.classList.add('active');

    // Salva a pontuação no banco MySQL via PHP
    saveScore(currentPlayer, score);
}
function saveScore(
    playerName,
    finalScore
) {
    fetch('salvar_ranking.php', {
        method: 'POST',
        headers: {
            'Content-Type':
                'application/json'
        },
        body: JSON.stringify({
            nome: playerName,
            pontos: finalScore
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                saveStatusMsg.textContent =
                    'Pontuação registrada no banco!';
                if (data.ranking) {
                    renderRanking(
                        data.ranking,
                        playerName,
                        finalScore
                    );
                }
            }
        })
        .catch(err => {
            console.error(
                'Erro na requisição:',
                err
            );
        });
}

    function renderRanking(list, highlightName = null, highlightScore = null) {
        if (!rankingBody) return;
        rankingBody.innerHTML = '';

        if (!list || list.length === 0) {
            rankingBody.innerHTML = '<tr><td colspan="3" class="loading-cell">Nenhuma pontuação gravada ainda. Jogue para ser o 1º!</td></tr>';
            return;
        }

        let highlighted = false;

        list.forEach((item, index) => {
            const tr = document.createElement('tr');

            // Destaca a pontuação atual recém-salva se coincidir
            if (!highlighted && highlightName && item.nome === highlightName && parseInt(item.pontos, 10) === highlightScore) {
                tr.classList.add('highlight-current');
                highlighted = true;
            }

            let medal = `${index + 1}º`;
            if (index === 0) medal = '🥇 1º';
            else if (index === 1) medal = '🥈 2º';
            else if (index === 2) medal = '🥉 3º';

            tr.innerHTML = `
                <td class="ranking-pos">${medal}</td>
                <td><strong>${escapeHtml(item.nome)}</strong></td>
                <td>${parseInt(item.pontos, 10)} pts</td>
            `;

            rankingBody.appendChild(tr);
        });
    }




function checkCollision() {
    if (!isPlaying) return;

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    // Tolerância de colisão: quando o cano está na faixa de contato com o Mario
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        triggerGameOver(pipePosition, marioPosition);
    }
}

gameBoard.addEventListener('click', () => {
    if (isPlaying) {
        jump();
    }
});

gameBoard.addEventListener('touchstart', (e) => {
    if (isPlaying) {
        e.preventDefault();
        jump();
    }
}, { passive: false });





