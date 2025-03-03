
// Initialize game state
const gameState = {
    currentPlayer: 'red',  // Player colors
    board: Array(6).fill().map(() => Array(7).fill(null)), // 6x7 grid
    gameOver: false,
    result: null
};

// Create board structure
function createBoard() {
    const board = document.getElementById('board');
    // Clear existing board
    board.innerHTML = '';
    // Create 7 columns
    for (let col = 0; col < 7; col++) {
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.col = col;  // Store column index

        // Create 6 cells per column
        for (let row = 0; row < 6; row++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row; // Store row index
            cell.dataset.col = col;
            column.appendChild(cell);
        }
        board.appendChild(column);
    }

}

// Initialize game
function initGame() {
    //Reset variables
    gameState.currentPlayer = 'red';  // Player colors
    gameState.board = Array(6).fill().map(() => Array(7).fill(null)); // 6x7 grid
    gameState.gameOver = false;
    gameState.result = null;

    createBoard();
    updateStatus();
    document.querySelectorAll('.column').forEach(column => {
        column.addEventListener('click', handleColumnClick);
    });

}

// Start game when page loads
window.onload = initGame;

//Basic game status display
function updateStatus() {
    const statusText = document.querySelector('.status-text');
    const indicator = document.querySelector('.player-indicator');
    
    // Update text
    if (gameState.gameOver) {
        statusText.textContent = gameState.result === 'win' 
            ? `${gameState.currentPlayer.toUpperCase()} Wins!` 
            : "Game Tied!";
    } 
    else {
        statusText.textContent = `${gameState.currentPlayer.toUpperCase()}'s Turn`;
    }    
    // Update indicator color
    indicator.classList.remove('red', 'yellow');
    indicator.classList.add(gameState.currentPlayer);
}

//Adds column click handlers
function handleColumnClick(event) {
    if (gameState.gameOver) return;
    
    const col = parseInt(event.currentTarget.dataset.col);
    row = getLowestEmptyRow(col);
    //checks to see if its a valid move
    if (row != -1){
        //updates board
        gameState.board[row][col] = gameState.currentPlayer;
        //updates game visuals
        //changes players turn
        if(checkWin(row, col)){
            gameState.gameOver = true;
            gameState.result = 'win';
        }
        else if(checkDraw()) {
            gameState.gameOver = true;
            gameState.result = 'draw';
        }
        else{
            gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'yellow' : 'red';

        }
        updateBoardVisual();
        updateStatus();
    }

}

function getLowestEmptyRow(col){
    //goes thru whole col finding the lowest row
    col = parseInt(col);
    for (let row = 0; row<6; row++){
        if (gameState.board[row][col] == null){
            return row
        }
    }
    //Means whole col is full
    return -1
}

//updates board visual
function updateBoardVisual(){
    //get all elements
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        //gets current location
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        //gets player color
        const playerColor = gameState.board[row][col];

        // Track previous state
        const wasEmpty = !cell.classList.contains('red') && 
        !cell.classList.contains('yellow');


        cell.classList.remove('red', 'yellow');
        //adds color to board
        if (playerColor) {
            cell.classList.add(playerColor);
                // Only animate if piece is new
                if (wasEmpty) {
                    cell.classList.add('new-piece');
                }
        }
    });
}
//Checks for a full board
function checkDraw() {
    //goes thru every index of array and checks for null if there is a null not tied yet
    for(let row = 0; row < 6; row++){
        for(let col = 0; col < 7; col++){
            if (gameState.board[row][col] == null){
                return false;
            }
        }
    }
    return true;
}
//checks for a win
function checkWin(row, col){
    const player = gameState.board[row][col];
    
    // Check all 4 directions
    return checkDirection(row, col, 0, 1) || // Horizontal
           checkDirection(row, col, 1, 0) || // Vertical
           checkDirection(row, col, 1, 1) || // Diagonal \
           checkDirection(row, col, 1, -1);  // Diagonal /
    
    function checkDirection(r, c, dr, dc) {
        return 1 + countConsecutive(r, c, dr, dc, player) 
                 + countConsecutive(r, c, -dr, -dc, player) >= 4;
    }
}
function countConsecutive(row, col, deltaRow, deltaCol, player) {
    let count = 0;
    let currentRow = row + deltaRow;
    let currentCol = col + deltaCol;
    
    while (currentRow >= 0 && currentRow < 6 && 
           currentCol >= 0 && currentCol < 7 &&
           gameState.board[currentRow][currentCol] === player) {
        count++;
        currentRow += deltaRow;
        currentCol += deltaCol;
    }
    return count;
}

//Basic reset handler
document.getElementById('reset').addEventListener('click', initGame);

