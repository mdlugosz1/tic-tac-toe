const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    const playerWins = () => {
        alert(`${getName()} wins!`);
    };

    return {
        getMark,
        playerWins,
        getName
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
        gameState.winCheck(board, cells);
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
        const playerTwoName = document.querySelector('#player-two');

        if (gameMode !== 'pvp') {
            playerTwoName.style.display = 'none';
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
    }
})();


const gameState = (() => {
    const submitPlayers = document.querySelector('.submit');
    const winCondtitions = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]];
    let playerOne, playerTwo, playerOneMark, playerTwoMark;
    let turn = true;
    let winner = false;


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
            } else {
                gameBoard.fillBoard(playerOneMark, currentCell);
                setTimeout(computerPlay, 300);
            }
        } else {
            return;
        }
    };

    const winCheck = (arr, cells) => {
        winCondtitions.forEach(condition => {
            if (arr[condition[0]] && arr[condition[0]] === arr[condition[1]] && arr[condition[0]] === arr[condition[2]]) {
                if (arr[condition[0]] === playerOneMark) {
                    playerOne.playerWins();
                } else {
                    playerTwo.playerWins();
                }

                cells.forEach(cell => {
                    cell.removeEventListener('click', playGame);
                });

                winner = true;
            }
        });

        const tieCheck = (indexes) => indexes !== '';

        if (arr.every(tieCheck) && !winner) {
            alert('tie');
        };
    };

    const resetValues = () => {
        turn = true;
        winner = false;
    };

    const computerPlay = () => {
        if (!winner) {
            const freeCells = gameBoard.getIndexOfEmptyCells();
            const choice = freeCells[Math.round(Math.random() * (freeCells.length - 1))];
            gameBoard.fillBoard(playerTwoMark, choice);
        }
    };

    submitPlayers.addEventListener('click', getPlayers);

    return {
        playGame,
        winCheck,
        resetValues
    }
})();
