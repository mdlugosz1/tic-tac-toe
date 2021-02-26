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
        
        console.log(cellID);
        console.log(board);
    
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

    return {
        fillBoard,
        cells,
        getIndexOfEmptyCells
    }
})();

const gameState = (() => {
    const playerOne = Player('Michał', 'X');
    const playerTwo = Player('AI', 'O');

    const playerChoice = playerOne.markCell();
    const computerChoice = playerTwo.markCell();

    gameBoard.cells.forEach(cell => {
        cell.addEventListener('click', () => {
            gameBoard.fillBoard(playerChoice, cell);
            setTimeout(computerPlay, 700);
           
        });
    });

    const computerPlay = () => {
        const freeCells = gameBoard.getIndexOfEmptyCells();
        const computerPick = freeCells[Math.round(Math.random() * freeCells.length - 1)];
        let choice = gameBoard.fillBoard(computerChoice, computerPick);
        return choice;
    };

    

})();
