const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    const playerWins = (winInfo) => {
        winInfo.textContent = `${getName()} wins!`;
    };

    return {
        getMark,
        playerWins,
        getName,
    }
};

const dom = (() => {
    const board = document.querySelector('.gameboard');
    const cells = board.querySelectorAll('div');
    let gameMode = '';

    const _divListeners = () => {
        const restartButton = document.querySelector('.restart');
        const gamemodeChoice = document.querySelectorAll('[data-game-mode]');
        const submitPlayers = document.querySelector('.submit');

        cells.forEach(cell => {cell.addEventListener('click', gameState.playGame);});
        gamemodeChoice.forEach(gamemode => {gamemode.addEventListener('click', _setGameMode);});
        restartButton.addEventListener('click', gameBoard.resetBoard);
        submitPlayers.addEventListener('click', gameState.getPlayers);
    };

    const _setGameMode = (e) => {
        const startScreen = document.querySelector('.start-screen');
        const playerTwoInput = document.querySelector('.player-two-input');

        startScreen.classList.add('nodisplay');
        gameMode = e.target.dataset.gameMode;

        if (gameMode !== 'pvp') {
            playerTwoInput.classList.add('nodisplay');
        }
    };

    const getGameMode = () => {
        return gameMode;
    };

    window.addEventListener('load', _divListeners);

    return {
        getGameMode,
        cells, 
    }
})();

const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const _renederBoard = () => {
        for (let i = 0; i < board.length; i++) {
            dom.cells[i].textContent = board[i];
        }
    };

    const fillBoard = (playerMark, cell) => {
        if (board[cell] === '') {
            board[cell] = playerMark;
        } else {
            return;
        }

        _renederBoard();
    };

    const getIndexOfEmptyCells = () => {
        const element = '';
        let emptyArr = [];
        let index = board.indexOf(element);

        while (index !== -1) {
            emptyArr.push(index);
            index = board.indexOf(element, index + 1);
        }

        return emptyArr;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }

        gameState.resetValues();
        _renederBoard();
    };
    
    return {
        fillBoard,
        getIndexOfEmptyCells,
        resetBoard,
        board
    }
})();


const gameState = (() => {
    const results = document.querySelector('.results');
    const winCondtitions = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];
    let playerOne, playerTwo;
    let p1points = 0;
    let p2points = 0;
    let turn = true;

    const getPlayers = () => {
        const playerNames = document.querySelector('.player-names');
        const playerOneName = document.querySelector('#player-one');
        const playerTwoName = document.querySelector('#player-two');
        const p1 = document.querySelector('#p1name');
        const p2 = document.querySelector('#p2name');
        
        playerOne = Player(playerOneName.value, 'X');
        
        if (dom.getGameMode() === 'pvp') {
            playerTwo = Player(playerTwoName.value, 'O');
        } else {
            playerTwo = Player('Bot', 'O');
        }

        p1.textContent = playerOne.getName();
        p2.textContent = playerTwo.getName();
        playerNames.classList.add('nodisplay');
    };

    const playGame = (e) => {
        const currentCell = e.target.getAttribute('id');
        const currentGameMode = dom.getGameMode();
        
        if (e.target.textContent === '' && !_showScores()) {
            if (currentGameMode === 'pvp') {
                turn ? gameBoard.fillBoard(playerOne.getMark(), currentCell) : gameBoard.fillBoard(playerTwo.getMark(), currentCell);
                turn = !turn;
            } else {
                gameBoard.fillBoard(playerOne.getMark(), currentCell);

                if (currentGameMode === 'easy') {
                    setTimeout(_computerPlay, 300);
                } else {
                    setTimeout(_unbeatableAi, 300);
                }  
            } 
        } else {
            return;
        }

        _showScores();
    };

    const winCheck = (arr, player) => {
        let winner;
        
        winCondtitions.forEach(condition => {
            if (arr[condition[0]] && arr[condition[0]] === arr[condition[1]] && arr[condition[0]] === arr[condition[2]]) {
                if (arr[condition[0]] === player.getMark()) {
                    winner = player.getMark();
                }
            }
        });

        return winner;
    };

    const tieCheck = (arr) => {
        const tieCheck = (indexes) => indexes !== '';

        if (arr.every(tieCheck)) {
            return true;
        };

        return false;
    };

    const _computerPlay = () => {
        if (!winCheck(gameBoard.board, playerOne)) {
            const freeCells = gameBoard.getIndexOfEmptyCells();
            const choice = freeCells[Math.round(Math.random() * (freeCells.length - 1))];
            gameBoard.fillBoard(playerTwo.getMark(), choice);
            _showScores();
        }
    };

    const _unbeatableAi = () => {
        const move = _minmax(gameBoard.board, playerTwo.getMark()).index;
        gameBoard.fillBoard(playerTwo.getMark(), move);
        _showScores();
    };

    const _minmax = (board, player) => {
        if (tieCheck(board)) {
            return {score: 0};
        } else if (winCheck(board, playerOne)) {
            return {score: -10};
        } else if (winCheck(board, playerTwo)) {
            return {score: 10};
        }

        const freeCells = gameBoard.getIndexOfEmptyCells();
        let moves = [];

        for (let i = 0; i < freeCells.length; i++) {
            let index = freeCells[i];
            let move = {};
            move.index = index;
            let savedBoard = board[index];
            board[index] = player;

            if (player === playerTwo.getMark()) {
                move.score = _minmax(board, playerOne.getMark()).score;
            } else {
                move.score = _minmax(board, playerTwo.getMark()).score;
            }

            board[index] = savedBoard;
            moves.push(move);
        }

        let bestMove;

        if (player === playerTwo.getMark()) {
            let bestScore = -1000

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        } else {
            let bestScore = 1000

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        }

        return bestMove;
    };

    const _showScores = () => {
        const showp1points = document.querySelector('#p1points');
        const showp2points = document.querySelector('#p2points');

        if (winCheck(gameBoard.board, playerTwo)) {
            playerTwo.playerWins(results);
            p2points += 1;
            showp2points.textContent = p2points;
            return true;
        }

        if (winCheck(gameBoard.board, playerOne)) {
            playerOne.playerWins(results);
            p1points += 1;
            showp1points.textContent = p1points;
            return true;
        }

        if (tieCheck(gameBoard.board)) {
            results.textContent = 'Draw';
        }
    };

    const resetValues = () => {
        results.textContent = '';
        turn = true;
    };

    return {
        playGame,
        winCheck,
        resetValues,
        tieCheck,
        getPlayers,
        resetValues,
    }
})();

