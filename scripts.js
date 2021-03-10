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

const gameBoard = (() => {
    const gameBoard = document.querySelector('.gameboard');
    const cells = gameBoard.querySelectorAll('div');
    const restartButton = document.querySelector('.restart');
    const gamemodeChoice = document.querySelectorAll('[data-game-mode]');
    const startScreen = document.querySelector('.start-screen');
    let gameMode = '';
    let board = ['', '', '', '', '', '', '', '', ''];

    const renederBoard = () => {
        for (let i = 0; i < board.length; i++) {
            cells[i].textContent = board[i];
        }
    };

    const fillBoard = (playerMark, cell) => {
        if (board[cell] === '') {
            board[cell] = playerMark;
        } else {
            return;
        }

        renederBoard();

        let isWin = gameState.winCheck(board);

        if (isWin) {
            cells.forEach(cell => {
                cell.removeEventListener('click', gameState.playGame);
            });
        }

        gameState.tieCheck(board);
    };

    const getIndexOfEmptyCells = () => {
        const element = '';
        let emptyArr = [];
        let index = board.indexOf(element);

        while (index != -1) {
            emptyArr.push(index);
            index = board.indexOf(element, index + 1);
        }

        return emptyArr;
    };

    const restartGame = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }

        gameState.resetValues();
        renederBoard();
        divListeners();
    };

    const divListeners = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', gameState.playGame);
        });

        gamemodeChoice.forEach(gamemode => {gamemode.addEventListener('click', setGameMode);});
    };

    const setGameMode = (e) => {
        startScreen.style.display = 'none';
        gameMode = e.target.dataset.gameMode;
        const playerTwoInput = document.querySelector('.player-two-input');

        if (gameMode !== 'pvp') {
            playerTwoInput.style.display = 'none';
        }
    };

    const getGameMode = () => {
        return gameMode;
    };
    
    window.addEventListener('load', divListeners);
    restartButton.addEventListener('click', restartGame);

    return {
        fillBoard,
        getIndexOfEmptyCells,
        getGameMode,
        board,
    }
})();


const gameState = (() => {
    const endGame = document.querySelector('.endgame');
    const submitPlayers = document.querySelector('.submit');
    const winCondtitions = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];
    let playerOne, playerTwo, playerOneMark, playerTwoMark;
    let turn = true;
    let p1win = 0;
    let p2win = 0;


    const getPlayers = () => {
        const playerNames = document.querySelector('.player-names');
        const playerOneName = document.querySelector('#player-one');
        const playerTwoName = document.querySelector('#player-two');
        const p1 = document.querySelector('#p1name');
        const p2 = document.querySelector('#p2name');
        playerOne = Player(playerOneName.value, 'X');

        if (gameBoard.getGameMode() === 'pvp') {
            playerTwo = Player(playerTwoName.value, 'O');
        } else {
            playerTwo = Player('AI', 'O');
        }

        playerOneMark = playerOne.getMark();
        playerTwoMark = playerTwo.getMark();
        p1.textContent = playerOne.getName();
        p2.textContent = playerTwo.getName();
        playerNames.style.display = 'none';
    };

    const playGame = (e) => {
        const currentCell = e.target.getAttribute('id');
        const currentGameMode = gameBoard.getGameMode();
        
        if (e.target.textContent === '') {
            if (currentGameMode === 'pvp') {
                turn ? gameBoard.fillBoard(playerOneMark, currentCell) : gameBoard.fillBoard(playerTwoMark, currentCell);
                turn = !turn;
                minmax(gameBoard.board, playerOneMark);
            } else if (currentGameMode === 'easy'){
                gameBoard.fillBoard(playerOneMark, currentCell);
                setTimeout(computerPlay, 300);
            } else {
                gameBoard.fillBoard(playerOneMark, currentCell);
                setTimeout(unbeatableAi, 300);
            }
        } else {
            return;
        }

        
    };

    const winCheck = (arr) => {
        const p1points = document.querySelector('#p1points');
        const p2points = document.querySelector('#p2points');
        let winner;
        
        winCondtitions.forEach(condition => {
            if (arr[condition[0]] && arr[condition[0]] === arr[condition[1]] && arr[condition[0]] === arr[condition[2]]) {
                if (arr[condition[0]] === playerOneMark) {
                    /* playerOne.playerWins(endGame);
                    p1win += 1
                    p1points.textContent = p1win; */
                    winner = playerOneMark;
                } else {
                    /* playerTwo.playerWins(endGame);
                    p2win +=1;
                    p2points.textContent = p2win; */
                    winner = playerTwoMark;
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

    const resetValues = () => {
        turn = true;
        winner = undefined;
        endGame.textContent = '';
    };

    const computerPlay = () => {
        if (winner === undefined) {
            const freeCells = gameBoard.getIndexOfEmptyCells();
            const choice = freeCells[Math.round(Math.random() * (freeCells.length - 1))];
            gameBoard.fillBoard(playerTwoMark, choice);
        }
    };

    const unbeatableAi = () => {
        
            const move = minmax(gameBoard.board, playerTwoMark).index;
            gameBoard.fillBoard(playerTwoMark, move);
        
    };

    const minmax = (board, player) => {
        if (tieCheck(board)) {
            return {score: 0};
        } else if (winCheck(board) === playerOneMark) {
            return {score: -10};
        } else if (winCheck(board) === playerTwoMark) {
            return {score: 10};
        }

        let freeCells = gameBoard.getIndexOfEmptyCells();
        let moves = [];

        for (let i = 0; i < freeCells.length; i++) {
            let index = freeCells[i];
            let move = {};
            move.index = index;
            let savedBoard = board[index];
            board[index] = player;

            if (player === playerTwoMark) {
                move.score = minmax(board, playerOneMark).score;
            } else {
                move.score = minmax(board, playerTwoMark).score;
            }

            board[index] = savedBoard;
            moves.push(move);
        }

        let bestMove;

        if (player === playerTwoMark) {
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

    submitPlayers.addEventListener('click', getPlayers);

    return {
        playGame,
        winCheck,
        resetValues,
        tieCheck,
        minmax,
        playerTwoMark,
        playerOneMark 
    }
})();
