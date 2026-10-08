<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mario Jump</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="game-container">
        <header class="hud-bar">
            <div class="player-info">
                <span class="label">PONTOS:</span>
                <span class="value" id="hud-player-name">--</span>
            </div>

            <div class="score-info">
                <span class="label">PONTOS:</span>
                <span class="value" id="score-display">0</span>
            </div>
        </header>
        <main class="game-board" id="game-board">
            <img src="assets/clouds.png" class="clouds" alt="Nuvens">
            <img src="assets/mario.gif" class="mario" alt="Mario">
            <img src="assets/pipe.png" class="pipe" alt="Cano">

            <span class="jump-tip" id="jump-tip">
                Pressione ESPAÇO ou clique para pular
            </span>
        </main>        
    </div>
    <div class="modal-overlay active" id="start-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h1 class="game-title">MARIO JUMP</h1>
                <p class="game-subtitle">
                    Corra, desvie dos canos e dispute o topo do ranking!
                </p>
            </div>
            <form class="start-form" id="start-form">
                <div class="input-group">
                    <label for="player-input">DIGITE SEU NOME</label>

                    <input 
                        type="text"
                        id="player-input"
                        placeholder="Ex: Seu Nome"
                        maxlength="30"
                        required
                        autocomplete="off"
                        autofocus
                    >
                </div>

                <div class="modal-actions">
                    <button type="submit"
                            class= "btn btn-primary"
                            id="btn-start">
                        INICIAR JOGO           
                    </button>

                    <button type="button" 
                            class="btn btn-secondary" 
                            id="btn-view-ranking">
                            VER RANKING
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>