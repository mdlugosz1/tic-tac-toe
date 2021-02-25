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
    let board = ['O', '', '', '', '', '', '', '', ''];
    const cells = gameBoard.querySelectorAll('div');
    const playerOne = Player('Michał', 'X');
    
    const renederBoard = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                fillBoard(cell);
                cell.textContent = board[cell.getAttribute('id')];
            })
        });
    };
    
    const fillBoard = (cell) => {
        for (let i = 0; i < board.length; i++) {
            if (Number(cell.getAttribute('id')) === i) {
                board[i] = playerOne.markCell();
                console.log(board);
            }
            
        }
    }
    
    renederBoard();

    return {
        renederBoard
    }
})();

const gameState = (() => {
    
    //const playerTwo = Player('AI', 'O');
})();
