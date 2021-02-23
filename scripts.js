const gameBoard = (() => {
    const gameBoard = document.querySelector('.gameboard');
    let board = ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'];

    const _createBoard = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            gameBoard.appendChild(cell);
        }
    }

    _createBoard();

    const fillBoard = () => {
        for (let i = 0; i < board.length; i++) {
            const fillCells = gameBoard.querySelectorAll('div');
            fillCells[i].textContent = board[i];
        }
    }

    //fillBoard();

    return {
        fill : fillBoard
    }
})();
