const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;

    const markCell = () => {
        return getMark();
    };

    const playerWins = () => {
        alert(`${getName()} wins!`);
    };

    return {
        markCell,
        playerWins
    }
};

const gameBoard = (() => {
    const gameBoard = document.querySelector('.gameboard');
    const cells = gameBoard.querySelectorAll('div');
    const restartButton = document.querySelector('.restart');
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
            console.log('zle');
            return;
        }

        renederBoard();
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

        renederBoard();
        divListeners();
    };

    const divListeners = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', gameState.playGame);
        });
    };

    window.addEventListener('load', divListeners);   
    restartButton.addEventListener('click', restartGame);
    
    return {
        fillBoard,
        getIndexOfEmptyCells,
        board,
        cells
    }
})();

const gameState = (() => {
    const playerOne = Player('Michał', 'X');
    const playerTwo = Player('AI', 'O');
    const playerChoice = playerOne.markCell();
    const computerChoice = playerTwo.markCell();
    const winCondtitions = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                            [0, 3, 6], [1, 4, 7], [2, 5, 8],
                            [0, 4, 8], [2, 4, 6]];
    let turn = true;
    let gameMode = '';

    const playGame = (e) => {
        const currentCell = e.target.getAttribute('id');

        if (e.target.textContent === '') {
            if (gameMode === 'pvp') {
                turn ? gameBoard.fillBoard(playerChoice, currentCell) : gameBoard.fillBoard(computerChoice, currentCell);
                turn = !turn;
            } else {
                gameBoard.fillBoard(playerChoice, currentCell);
                setTimeout(computerPlay, 500);
            }
        } else {
            return;
        }

        winCheck(gameBoard.board, gameBoard.cells);
    };

    const winCheck = (arr, cells) => {
        let winner = false;
        winCondtitions.forEach(condition => {
            if (arr[condition[0]] && arr[condition[0]] === arr[condition[1]] && arr[condition[0]] === arr[condition[2]]) {
                if (arr[condition[0]] === playerChoice) {
                    playerOne.playerWins();
                } else {
                    playerTwo.playerWins();
                }

                cells.forEach(cell => {
                    cell.removeEventListener('click', playGame);
                });

                turn = true;
                winner = true;
            }
        });

        const tieCheck = (indexes) => indexes !== '';

        if (arr.every(tieCheck) && !winner) {
            alert('tie');
            turn = true;
        };
    }; 

    const computerPlay = () => {
        const freeCells = gameBoard.getIndexOfEmptyCells();
        const choice = freeCells[Math.round(Math.random() * (freeCells.length - 1))];
        gameBoard.fillBoard(computerChoice, choice);
        winCheck(gameBoard.board, gameBoard.cells);
    };

    return {
        playGame,
        winCheck
    }
})();
