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
    let board = ['', '', '', '', '', '', '', '', ''];

    const renederBoard = () => {
        for (let i = 0; i < board.length; i++) {
            cells[i].textContent = board[i];
        }
    };

    const fillBoard = (playerMark, cell) => {
        let cellID;

        if (isNaN(cell)) {
            cellID = Number(cell.getAttribute('id'));
        } else {
            cellID = cell;
        }
            
        if (board[cellID] === '') {
            board[cellID] = playerMark;
        } else {
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

    window.addEventListener('load', () => {
        cells.forEach(cell => {
            cell.addEventListener('click', gameState.playGame);
        });
    });
    
    return {
        fillBoard,
        cells,
        getIndexOfEmptyCells,
        board
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

    const playGame = (e) => {
        const currentCell = Number(e.target.getAttribute('id'));

        if (e.target.textContent === '') {
            turn ? gameBoard.fillBoard(playerChoice, currentCell) : gameBoard.fillBoard(computerChoice, currentCell);                   
            turn = !turn;
        } else {
            return;
        }
        
        const showWinner = winCheck(gameBoard.board);
    }

    
    const winCheck = (arr) => {
        winCondtitions.forEach(condition => {
            if (arr[condition[0]] && arr[condition[0]] === arr[condition[1]] && arr[condition[0]] === arr[condition[2]]) {
                if (arr[condition[0]] === playerChoice) {
                    playerOne.playerWins();
                }
            } 
        });
    }; 

    
    const computerPlay = () => {
        const freeCells = gameBoard.getIndexOfEmptyCells();
        const computerPick = freeCells[Math.round(Math.random() * freeCells.length - 1)];
        gameBoard.fillBoard(computerChoice, computerPick);
    };

    return {
        playGame,
    }
})();
